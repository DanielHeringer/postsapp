import * as mongoose from 'mongoose';

export const CommentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    upvotes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    postRef:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    created:  {
        type: String,
        required: true
    }
});