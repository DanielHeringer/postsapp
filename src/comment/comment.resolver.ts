import { Resolver, Args, Query, Mutation, Context  } from '@nestjs/graphql';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { Comment } from './comment.interface';

@Resolver('Comment')
export class CommentResolver {

    constructor(private commentService: CommentService) {}
    
    @Query()
    commentsByPost(@Args('postID') postID: string){
        return this.commentService.getByPost(postID)
    }
    
    @Query()
    commentByID(@Args('postID') postID: string){
        return this.commentService.getByID(postID)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    createComment(
        @Args('text') text: string,
        @Args('post') postID: string,
        @Context('user') user: any
    ) {
        const comment: Partial<Comment> = {text}
        return this.commentService.create(comment, postID, user._id)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    updateComment(
        @Args('text') text: string,
        @Args('comment') commentID: string,
        @Context('user') user: any
    ) {
        return this.commentService.update(text, commentID, user._id)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    removeComment(
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        return this.commentService.delete(id, user._id)
    }

    @Mutation()
    @UseGuards(new AuthGuard)
    upvoteComment(
        @Args('id') id: string,
        @Context('user') user: any
    ) {
        return this.commentService.upvote(id, user._id)
    }


}
