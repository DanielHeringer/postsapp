"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    posts: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post'
        }]
});
//# sourceMappingURL=user.schema.js.map