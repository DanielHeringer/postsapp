"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const comment_service_1 = require("./comment.service");
const comment_providers_1 = require("./comment.providers");
const comment_resolver_1 = require("./comment.resolver");
const user_module_1 = require("../user/user.module");
const post_module_1 = require("../post/post.module");
let CommentModule = class CommentModule {
};
CommentModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule, user_module_1.UserModule, common_1.forwardRef(() => post_module_1.PostModule)],
        providers: [comment_service_1.CommentService, comment_resolver_1.CommentResolver,
            ...comment_providers_1.commentProviders],
        exports: [comment_service_1.CommentService]
    })
], CommentModule);
exports.CommentModule = CommentModule;
//# sourceMappingURL=comment.module.js.map