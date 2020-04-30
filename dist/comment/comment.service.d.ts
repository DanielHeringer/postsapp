import { Model } from 'mongoose';
import { Comment } from './comment.interface';
import { UserService } from 'src/user/user.service';
import { PostService } from 'src/post/post.service';
export declare class CommentService {
    private commentModel;
    private userService;
    private readonly postService;
    constructor(commentModel: Model<Comment>, userService: UserService, postService: PostService);
    getByID(postID: string): Promise<any>;
    getByPost(postID: string): Promise<any[]>;
    create(comment: Partial<Comment>, postID: string, userID: string): Promise<any>;
    update(text: string, commentID: string, userID: string): Promise<any>;
    upvote(id: string, userID: string): Promise<any>;
    delete(id: string, userID: string): Promise<boolean>;
    verifyOwner(userID: string, creatorID: string): void;
}
