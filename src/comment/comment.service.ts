import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

import { Comment } from './comment.interface';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService {

    constructor(
        @Inject('COMMENT_MODEL')
        private commentModel: Model<Comment>,
        private userService: UserService,
        private postService: PostService
    ) {}

    async getByID(postID: string) {
        let idToSearch = mongoose.Types.ObjectId(postID)
        
        const comment = await this.commentModel
            .aggregate()
            .match({_id: idToSearch})
            .lookup({
                from: 'users',
                localField: 'creator',
                foreignField:'_id',
                as: 'creator'
            })
            .lookup({
                from: 'users',
                localField: 'upvotes',
                foreignField:'_id',
                as: 'upvotes'
            })
            .lookup({
                from: 'posts',
                localField: 'postRef',
                foreignField:'_id',
                as: 'postRef'
            })
            .unwind('$postRef')
            .unwind('$creator')
        if( comment.length === 0){
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        }
            
        return comment[0]
    }

    async getByPost(postID: string) {
        let idToSearch = mongoose.Types.ObjectId(postID)
        const comment = await this.commentModel
            .aggregate()
            .match({postRef: idToSearch})
            .lookup({
                from: 'users',
                localField: 'creator',
                foreignField:'_id',
                as: 'creator'
            })
            .lookup({
                from: 'users',
                localField: 'upvotes',
                foreignField:'_id',
                as: 'upvotes'
            })
            .unwind('$creator')
            .sort({created: -1})
        return comment
    }

    async create(comment: Partial<Comment>, postID:string, userID: string) {
        const creator = await this.userService.getByID(userID)
        if(!creator){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const postRef = await this.postService.getByID(postID)
        if(!postRef){
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        comment.creator = creator._id
        comment.postRef = postRef._id
        comment.created = new Date().getTime().toString()
        let createdComment = new this.commentModel(comment)
        if (await createdComment.save()) {
            await this.postService.pushComment(createdComment._id, postRef._id)
            return await this.getByID(createdComment._id)
        }
    }

    async update(text: string, commentID: string, userID: string) {
        let find = await this.commentModel.findOne({_id: commentID})
        if(!find) {
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        }
        if(find.creator != userID){
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
        }
        const update = await this.commentModel.updateOne({_id: commentID}, {text: text})
        if(update){
            return this.getByID(commentID)
        }
        else{
            return false
        }
    }

    async upvote(id: string, userID: string) {
        let find = await this.commentModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        }
        if(find.upvotes.find(id => id == userID)){
            throw new HttpException('Already upvoted', HttpStatus.OK)
        }
        find.upvotes.push(userID)
        const update = await find.save()
        if(update){
            return this.getByID(id)
        }
    }

    async delete(id: string, userID: string) {
        const find = await this.commentModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        }
        this.verifyOwner(userID, find.creator)
        
        await this.postService.removeComment(id, find.postRef)
        const remove = await this.commentModel.deleteOne({ _id: id });
        if(remove){
            return true
        }
        else{
            return false
        }
    }

    verifyOwner(userID: string, creatorID: string){
        if(userID != creatorID){
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
        }
    }

}
