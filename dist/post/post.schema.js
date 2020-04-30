"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    upvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    downvotes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created: {
        type: String,
        required: true
    }
});
//# sourceMappingURL=post.schema.js.map