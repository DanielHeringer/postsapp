import { CommentService } from './comment.service';
export declare class CommentResolver {
    private commentService;
    constructor(commentService: CommentService);
    commentsByPost(postID: string): Promise<any[]>;
    commentByID(postID: string): Promise<any>;
    createComment(text: string, postID: string, user: any): Promise<any>;
    updateComment(text: string, commentID: string, user: any): Promise<any>;
    removeComment(id: string, user: any): Promise<boolean>;
    upvoteComment(id: string, user: any): Promise<any>;
}
