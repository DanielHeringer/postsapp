import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';

import { CommentService } from './../comment/comment.service';
import { Post } from './post.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {

    constructor(
        @Inject('POST_MODEL')
        private postModel: Model<Post>,
        private userService: UserService,
        @Inject(forwardRef(() => CommentService))
        private readonly commentService: CommentService,
    ) {}

    async getAll(page = 0) {
        const pageSize = Number(process.env.PAGE_SIZE)
        const skip =  page * pageSize
        const posts: any = await this.postModel
            .aggregate([
                {$lookup:{
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                }},
                {$unwind: "$creator" },
                {$lookup: {
                    from: "users",
                    localField: "upvotes",
                    foreignField: "_id",
                    as: "upvotes"
                }},
                {$unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
                {$group: {
                    _id: "$_id",
                    text: {$first: "$text"},
                    created: {$first: "$created"},
                    creator: {$first: {_id:"$creator._id", username: "$creator.username" } },
                    upvotes: {$addToSet: "$upvotes"},
                    comments: {$addToSet: "$comments"},
                }},
                {$sort: {"created": -1}},
            ])
            .skip(skip)
            .limit(pageSize)
            for(const index in posts){
                posts[index].comments = await this.commentService.getByPost(posts[index]._id)
            }


        return posts
    }

    async getByUser(username: string, page = 0) {
        const findUser: any = await this.userService.getByUsername(username)
        if(!findUser){
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const pageSize = Number(process.env.PAGE_SIZE)
        const skip =  page * pageSize
        const posts: any = await this.postModel
            .aggregate([
                {$match: {creator: findUser._id}},
                {$lookup:{
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                }},
                {$unwind: "$creator" },
                {$lookup: {
                    from: "users",
                    localField: "upvotes",
                    foreignField: "_id",
                    as: "upvotes"
                }},
                {$unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
                {$group: {
                    _id: "$_id",
                    text: {$first: "$text"},
                    created: {$first: "$created"},
                    creator: {$first: {_id:"$creator._id", username: "$creator.username" } },
                    upvotes: {$addToSet: "$upvotes"},
                    comments: {$addToSet: "$comments"},
                }},
                {$sort: {"created": -1}},
            ])
            .skip(skip)
            .limit(pageSize)
            for(const index in posts){
                posts[index].comments = await this.commentService.getByPost(posts[index]._id)
            }
        return posts
    }


    async getByID(id: string) {
        const idToSearch = mongoose.Types.ObjectId(id)
        const post: any = await this.postModel
        .aggregate([
            {$match: {_id: idToSearch}},
            {$lookup:{
                from: "users",
                localField: "creator",
                foreignField: "_id",
                as: "creator"
            }},
            {$unwind: "$creator" },
            {$lookup: {
                from: "users",
                localField: "upvotes",
                foreignField: "_id",
                as: "upvotes"
            }},
            {$unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
            {$group: {
                _id: "$_id",
                text: {$first: "$text"},
                created: {$first: "$created"},
                creator: {$first: {_id:"$creator._id", username: "$creator.username" } },
                upvotes: {$addToSet: "$upvotes"},
                comments: {$addToSet: "$comments"},
            }}
        ])

        post[0].comments = await this.commentService.getByPost(post[0]._id)
        if( post.length === 0){
            throw new HttpException('Comment not found', HttpStatus.NOT_FOUND)
        }
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
        post.created = new Date().getTime().toString()
        const createdPost = new this.postModel(post)
        if (await createdPost.save()) {
            await this.userService.pushPost(createdPost._id, creator._id)
            return await this.getByID(createdPost._id)
        }
    }

    async update(text: string, id: string, userID: string) {
        const find = await this.postModel.findOne({_id: id})
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
        const find = await this.postModel.findOne({_id: idPost})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        find.comments.push(idComment)
        return await find.save()
    }
    
    async removeComment(idComment: string, idPost: string) {
        const find = await this.postModel.findOne({_id: idPost})
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
        const find = await this.postModel.findOne({_id: id})
        if(!find) {
            throw new HttpException('Post not found', HttpStatus.NOT_FOUND)
        }
        if(find.upvotes.find(id => id == userID)){
            const index: number = find.upvotes.indexOf(userID)
            if (index !== -1) {
                find.upvotes.splice(index, 1);
            }     
        }
        else {
            find.upvotes.push(userID)
        }
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
