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
const comment_service_1 = require("./../comment/comment.service");
const user_service_1 = require("../user/user.service");
let PostService = class PostService {
    constructor(postModel, userService, commentService) {
        this.postModel = postModel;
        this.userService = userService;
        this.commentService = commentService;
    }
    async getAll(page = 0) {
        const pageSize = Number(process.env.PAGE_SIZE);
        const skip = page * pageSize;
        const posts = await this.postModel
            .aggregate([
            { $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                } },
            { $unwind: "$creator" },
            { $lookup: {
                    from: "users",
                    localField: "upvotes",
                    foreignField: "_id",
                    as: "upvotes"
                } },
            { $unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
            { $group: {
                    _id: "$_id",
                    text: { $first: "$text" },
                    created: { $first: "$created" },
                    creator: { $first: { _id: "$creator._id", username: "$creator.username" } },
                    upvotes: { $addToSet: "$upvotes" },
                    comments: { $addToSet: "$comments" },
                } },
            { $sort: { "created": -1 } },
        ])
            .skip(skip)
            .limit(pageSize);
        for (const index in posts) {
            posts[index].comments = await this.commentService.getByPost(posts[index]._id);
        }
        return posts;
    }
    async getByUser(username, page = 0) {
        const findUser = await this.userService.getByUsername(username);
        if (!findUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const pageSize = Number(process.env.PAGE_SIZE);
        const skip = page * pageSize;
        const posts = await this.postModel
            .aggregate([
            { $match: { creator: findUser._id } },
            { $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                } },
            { $unwind: "$creator" },
            { $lookup: {
                    from: "users",
                    localField: "upvotes",
                    foreignField: "_id",
                    as: "upvotes"
                } },
            { $unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
            { $group: {
                    _id: "$_id",
                    text: { $first: "$text" },
                    created: { $first: "$created" },
                    creator: { $first: { _id: "$creator._id", username: "$creator.username" } },
                    upvotes: { $addToSet: "$upvotes" },
                    comments: { $addToSet: "$comments" },
                } },
            { $sort: { "created": -1 } },
        ])
            .skip(skip)
            .limit(pageSize);
        for (const index in posts) {
            posts[index].comments = await this.commentService.getByPost(posts[index]._id);
        }
        return posts;
    }
    async getByID(id) {
        const idToSearch = mongoose.Types.ObjectId(id);
        const post = await this.postModel
            .aggregate([
            { $match: { _id: idToSearch } },
            { $lookup: {
                    from: "users",
                    localField: "creator",
                    foreignField: "_id",
                    as: "creator"
                } },
            { $unwind: "$creator" },
            { $lookup: {
                    from: "users",
                    localField: "upvotes",
                    foreignField: "_id",
                    as: "upvotes"
                } },
            { $unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
            { $group: {
                    _id: "$_id",
                    text: { $first: "$text" },
                    created: { $first: "$created" },
                    creator: { $first: { _id: "$creator._id", username: "$creator.username" } },
                    upvotes: { $addToSet: "$upvotes" },
                    comments: { $addToSet: "$comments" },
                } }
        ]);
        post[0].comments = await this.commentService.getByPost(post[0]._id);
        if (post.length === 0) {
            throw new common_1.HttpException('Comment not found', common_1.HttpStatus.NOT_FOUND);
        }
        return post[0];
    }
    async getByCreator(id) {
        return await this.postModel.findOne({ creator: id });
    }
    async create(post, userID) {
        const creator = await this.userService.getByID(userID);
        if (!creator) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        post.creator = creator._id;
        post.created = new Date().getTime().toString();
        const createdPost = new this.postModel(post);
        if (await createdPost.save()) {
            await this.userService.pushPost(createdPost._id, creator._id);
            return await this.getByID(createdPost._id);
        }
    }
    async update(text, id, userID) {
        const find = await this.postModel.findOne({ _id: id });
        if (!find) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (find.creator != userID) {
            throw new common_1.HttpException('User not authorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const update = await this.postModel.updateOne({ _id: id }, { text: text });
        if (update) {
            return this.getByID(id);
        }
    }
    async pushComment(idComment, idPost) {
        const find = await this.postModel.findOne({ _id: idPost });
        if (!find) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        find.comments.push(idComment);
        return await find.save();
    }
    async removeComment(idComment, idPost) {
        const find = await this.postModel.findOne({ _id: idPost });
        if (!find) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        const index = find.comments.indexOf(idComment);
        if (index !== -1) {
            find.comments.splice(index, 1);
        }
        return await find.save();
    }
    async upvote(id, userID) {
        const find = await this.postModel.findOne({ _id: id });
        if (!find) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
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
        const find = await this.postModel.findOne({ _id: id });
        if (!find) {
            throw new common_1.HttpException('Post not found', common_1.HttpStatus.NOT_FOUND);
        }
        this.verifyOwner(userID, find.creator);
        await this.userService.removePost(id, find.creator);
        const remove = await this.postModel.deleteOne({ _id: id });
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
PostService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('POST_MODEL')),
    __param(2, common_1.Inject(common_1.forwardRef(() => comment_service_1.CommentService))),
    __metadata("design:paramtypes", [mongoose_1.Model,
        user_service_1.UserService,
        comment_service_1.CommentService])
], PostService);
exports.PostService = PostService;
//# sourceMappingURL=post.service.js.map