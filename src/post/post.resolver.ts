import { Resolver, Args, Query, Mutation, Context } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from './post.interface';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';

@Resolver('Post')
export class PostResolver {

    constructor(private postService: PostService) {}

    @Query()
    posts(@Args('page') page = 0){
        return this.postService.getAll(page)
    }
    
    @Query()
    postsByUser(
        @Args('username') username: string,
        @Args('page') page = 0){
        return this.postService.getByUser(username, page)
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
    upvotePost(
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        return this.postService.upvote(id, user._id)
    }


}
