import { Resolver, Args, Query, Mutation, Context, GqlExecutionContext, Info, Root  } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './post.interface';
import { UseGuards, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';

@Resolver('Post')
export class PostResolver {

    constructor(private postService: PostService) {}

    @Query()
    posts(@Args('page') page: number = 0){
        return this.postService.getAll(page)
    }
    
    @Query()
    postByID(@Args('id') id: string){
        return this.postService.getByID(id)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    createPost(
        @Args('text') text: string,
        @Context('user') user: any
    ) {
        const post: Partial<Post> = {text}
        return this.postService.create(post, user._id)
    }
    @Mutation()
    @UseGuards(new AuthGuard)
    updatePost(
        @Args('text') text: string,
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        const post: Partial<Post> = {text}
        return this.postService.update(text, id, user._id)
    }
    @Mutation()
    @UseGuards(new AuthGuard)
    removePost(
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        return this.postService.delete(id, user._id)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    upvote(
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        return this.postService.upvote(id, user._id)
    }


}
