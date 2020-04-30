"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const mongoose = require("mongoose");
const user_service_1 = require("../user/user.service");
const post_service_1 = require("../post/post.service");
let CommentService = class CommentService {
    constructor(commentModel, userService, postService) {
        this.commentModel = commentModel;
        this.userService = userService;
        this.postService = postService;
    }
    async getByID(postID) {
        const idToSearch = mongoose.Types.ObjectId(postID);
        const comment = await this.commentModel
            .aggregate()
            .match({ _id: idToSearch })
            .lookup({
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
        })
            .lookup({
            from: 'users',
            localField: 'upvotes',
            foreignField: '_id',
            as: 'upvotes'
        })
            .lookup({
            from: 'posts',
            localField: 'postRef',
            foreignField: '_id',
            as: 'postRef'
        })
            .unwind('$postRef')
            .unwind('$creator');
        if (comment.length === 0) {
            throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
        }
        return comment[0];
    }
    async getByPost(postID) {
        const idToSearch = mongoose.Types.ObjectId(postID);
        const comment = await this.commentModel
            .aggregate()
            .match({ postRef: idToSearch })
            .lookup({
            from: 'users',
            localField: 'creator',
            foreignField: '_id',
            as: 'creator'
        })
            .lookup({
            from: 'users',
            localField: 'upvotes',
            foreignField: '_id',
            as: 'upvotes'
        })
            .unwind('$creator')
            .sort({ created: 1 });
        return comment;
    }
    async create(comment, postID, userID) {
        const creator = await this.userService.getByID(userID);
        if (!creator) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const postRef = await this.postService.getByID(postID);
        if (!postRef) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        comment.creator = creator._id;
        comment.postRef = postRef._id;
        comment.created = new Date().getTime().toString();
        const createdComment = new this.commentModel(comment);
        if (await createdComment.save()) {
            await this.postService.pushComment(createdComment._id, postRef._id);
            return await this.getByID(createdComment._id);
        }
    }
    async update(text, commentID, userID) {
        const find = await this.commentModel.findOne({ _id: commentID });
        if (!find) {
            throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (find.creator != userID) {
            throw new common_1.HttpException('User not authorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const update = await this.commentModel.updateOne({ _id: commentID }, { text: text });
        if (update) {
            return this.getByID(commentID);
        }
        else {
            return false;
        }
    }
    async upvote(id, userID) {
        const find = await this.commentModel.findOne({ _id: id });
        if (!find) {
            throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (find.upvotes.find(id => id == userID)) {
            const index = find.upvotes.indexOf(userID);
            if (index !== -1) {
                find.upvotes.splice(index, 1);
            }
        }
        else {
            find.upvotes.push(userID);
        }
        const update = await find.save();
        if (update) {
            return this.getByID(id);
        }
    }
    async delete(id, userID) {
        const find = await this.commentModel.findOne({ _id: id });
        if (!find) {
            throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
        }
        this.verifyOwner(userID, find.creator);
        await this.postService.removeComment(id, find.postRef);
        const remove = await this.commentModel.deleteOne({ _id: id });
        if (remove) {
            return true;
        }
        else {
            return false;
        }
    }
    verifyOwner(userID, creatorID) {
        if (userID != creatorID) {
            throw new common_1.HttpException('User not authorized', common_1.HttpStatus.UNAUTHORIZED);
        }
    }
};
CommentService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('COMMENT_MODEL')),
    __param(2, common_1.Inject(common_1.forwardRef(() => post_service_1.PostService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService,
        post_service_1.PostService])
], CommentService);
exports.CommentService = CommentService;
//# sourceMappingURL=comment.service.js.map