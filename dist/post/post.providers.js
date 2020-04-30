"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const post_schema_1 = require("./post.schema");
exports.postProviders = [
    {
        provide: 'POST_MODEL',
        useFactory: (connection) => connection.model('Post', post_schema_1.PostSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=post.providers.js.map