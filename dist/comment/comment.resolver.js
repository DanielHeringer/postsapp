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
const graphql_1 = require("@nestjs/graphql");
const comment_service_1 = require("./comment.service");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../shared/auth.guard");
let CommentResolver = class CommentResolver {
    constructor(commentService) {
        this.commentService = commentService;
    }
    commentsByPost(postID) {
        return this.commentService.getByPost(postID);
    }
    commentByID(postID) {
        return this.commentService.getByID(postID);
    }
    createComment(text, postID, user) {
        const comment = { text };
        return this.commentService.create(comment, postID, user._id);
    }
    updateComment(text, commentID, user) {
        return this.commentService.update(text, commentID, user._id);
    }
    removeComment(id, user) {
        return this.commentService.delete(id, user._id);
    }
    upvoteComment(id, user) {
        return this.commentService.upvote(id, user._id);
    }
};
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('postID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "commentsByPost", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('postID')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "commentByID", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('text')),
    __param(1, graphql_1.Args('post')),
    __param(2, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "createComment", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('text')),
    __param(1, graphql_1.Args('comment')),
    __param(2, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "updateComment", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('id')),
    __param(1, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "removeComment", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('id')),
    __param(1, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CommentResolver.prototype, "upvoteComment", null);
CommentResolver = __decorate([
    graphql_1.Resolver('Comment'),
    __metadata("design:paramtypes", [comment_service_1.CommentService])
], CommentResolver);
exports.CommentResolver = CommentResolver;
//# sourceMappingURL=comment.resolver.js.map