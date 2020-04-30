"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comment_schema_1 = require("./comment.schema");
exports.commentProviders = [
    {
        provide: 'COMMENT_MODEL',
        useFactory: (connection) => connection.model('Comment', comment_schema_1.CommentSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=comment.providers.js.map