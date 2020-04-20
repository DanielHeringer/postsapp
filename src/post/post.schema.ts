import * as mongoose from 'mongoose';

export const PostSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    upvotes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    downvotes:  [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    creator:  {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    created:  {
        type: String,
        required: true
    }
});