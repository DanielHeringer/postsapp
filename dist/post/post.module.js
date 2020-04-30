"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const comment_module_1 = require("./../comment/comment.module");
const common_1 = require("@nestjs/common");
const post_service_1 = require("./post.service");
const post_resolver_1 = require("./post.resolver");
const database_module_1 = require("../database/database.module");
const post_providers_1 = require("./post.providers");
const user_module_1 = require("../user/user.module");
let PostModule = class PostModule {
};
PostModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule, user_module_1.UserModule, comment_module_1.CommentModule],
        providers: [post_service_1.PostService, post_resolver_1.PostResolver,
            ...post_providers_1.postProviders],
        exports: [post_service_1.PostService]
    })
], PostModule);
exports.PostModule = PostModule;
//# sourceMappingURL=post.module.js.map