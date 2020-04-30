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
const post_service_1 = require("./post.service");
const common_1 = require("@nestjs/common");
const auth_guard_1 = require("../shared/auth.guard");
let PostResolver = class PostResolver {
    constructor(postService) {
        this.postService = postService;
    }
    posts(page = 0) {
        return this.postService.getAll(page);
    }
    postsByUser(username, page = 0) {
        return this.postService.getByUser(username, page);
    }
    postByID(id) {
        return this.postService.getByID(id);
    }
    createPost(text, user) {
        const post = { text };
        return this.postService.create(post, user._id);
    }
    updatePost(text, id, user) {
        return this.postService.update(text, id, user._id);
    }
    removePost(id, user) {
        return this.postService.delete(id, user._id);
    }
    upvotePost(id, user) {
        return this.postService.upvote(id, user._id);
    }
};
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "posts", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('username')),
    __param(1, graphql_1.Args('page')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "postsByUser", null);
__decorate([
    graphql_1.Query(),
    __param(0, graphql_1.Args('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "postByID", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('text')),
    __param(1, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "createPost", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('text')),
    __param(1, graphql_1.Args('id')),
    __param(2, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "updatePost", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('id')),
    __param(1, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "removePost", null);
__decorate([
    graphql_1.Mutation(),
    common_1.UseGuards(new auth_guard_1.AuthGuard),
    __param(0, graphql_1.Args('id')),
    __param(1, graphql_1.Context('user')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], PostResolver.prototype, "upvotePost", null);
PostResolver = __decorate([
    graphql_1.Resolver('Post'),
    __metadata("design:paramtypes", [post_service_1.PostService])
], PostResolver);
exports.PostResolver = PostResolver;
//# sourceMappingURL=post.resolver.js.map