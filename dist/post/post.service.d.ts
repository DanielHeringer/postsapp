import { Model } from 'mongoose';
import { CommentService } from './../comment/comment.service';
import { Post } from './post.interface';
import { UserService } from 'src/user/user.service';
export declare class PostService {
    private postModel;
    private userService;
    private readonly commentService;
    constructor(postModel: Model<Post>, userService: UserService, commentService: CommentService);
    getAll(page?: number): Promise<any>;
    getByUser(username: string, page?: number): Promise<any>;
    getByID(id: string): Promise<any>;
    getByCreator(id: string): Promise<Post>;
    create(post: Partial<Post>, userID: string): Promise<any>;
    update(text: string, id: string, userID: string): Promise<any>;
    pushComment(idComment: string, idPost: string): Promise<Post>;
    removeComment(idComment: string, idPost: string): Promise<Post>;
    upvote(id: string, userID: string): Promise<any>;
    delete(id: string, userID: string): Promise<boolean>;
    verifyOwner(userID: any, creatorID: any): void;
}
