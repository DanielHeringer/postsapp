import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model, Mongoose } from 'mongoose';
import * as mongoose from 'mongoose';

import { Post } from './post.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {

    constructor(
        @Inject('POST_MODEL')
        private postModel: Model<Post>,
        private userService: UserService,
    ) {}

    async getAll(page: number = 0) {
        const page_size = Number(process.env.PAGE_SIZE)
        const skip =  page * page_size
        const posts = await this.postModel
            .aggregate()
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
                from: 'comments',
                localField: 'comments',
                foreignField:'_id',
                as: 'comments'
            })
            .unwind('$creator')
            .skip(skip)
            .limit(page_size)
        return posts
    }

    async getByID(id: string) {
        let idToSearch = mongoose.Types.ObjectId(id)
        const post = await this.postModel
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
            .unwind('$creator')
            console.log(post)
            
        return post[0]
    }

    async getByCreator(id: string) {
        return await this.postModel.findOne({creator: id})
    }


    async create(post: Partial<Post>, userID: string) {
        const creator = await this.userService.getByID(userID)
        if(!creator){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        post.creator = creator._id
        post.created = new Date().toString()
        let createdPost = new this.postModel(post)
        if (await createdPost.save()) {
            await this.userService.pushPost(createdPost._id, creator._id)
            return await this.getByID(createdPost._id)
        }
    }

    async update(text: string, id: string, userID: string) {
        let find = await this.postModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        if(find.creator != userID){
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
        }
        const update = await this.postModel.updateOne({_id: id}, {text: text});
        if(update){
            return this.getByID(id)
        }
    }

    async pushComment(idComment: string, idPost: string) {
        let find = await this.postModel.findOne({_id: idPost})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        find.comments.push(idComment)
        return await find.save()
    }
    
    async removeComment(idComment: string, idPost: string) {
        let find = await this.postModel.findOne({_id: idPost})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        const index: number = find.comments.indexOf(idComment)
        if (index !== -1) {
            find.comments.splice(index, 1);
        }     
        return await find.save()
    }

    async upvote(id: string, userID: string) {
        let find = await this.postModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        if(find.upvotes.find(id => id == userID)){
            throw new HttpException('Already upvoted', HttpStatus.OK)
        }
        find.upvotes.push(userID)
        const update = await find.save();
        if(update){
            return this.getByID(id)
        }
    }

    async delete(id: string, userID: string) {
        const find = await this.postModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        this.verifyOwner(userID, find.creator)
        
        await this.userService.removePost(id, find.creator)
        const remove = await this.postModel.deleteOne({ _id: id });
        if(remove){
            return true
        }
        else{
            return false
        }
    }

    verifyOwner(userID, creatorID){
        if(userID != creatorID){
            throw new HttpException('User not authorized', HttpStatus.UNAUTHORIZED)
        }
    }

}
