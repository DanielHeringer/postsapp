import { PostService } from './post.service';
export declare class PostResolver {
    private postService;
    constructor(postService: PostService);
    posts(page?: number): Promise<any>;
    postsByUser(username: string, page?: number): Promise<any>;
    postByID(id: string): Promise<any>;
    createPost(text: string, user: any): Promise<any>;
    updatePost(text: string, id: string, user: any): Promise<any>;
    removePost(id: string, user: any): Promise<boolean>;
    upvotePost(id: string, user: any): Promise<any>;
}
