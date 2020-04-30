import { CommentModule } from './../comment/comment.module';
import { Module } from '@nestjs/common';

import { PostService } from './post.service';
import { PostResolver } from './post.resolver';
import { DatabaseModule } from 'src/database/database.module';
import { postProviders } from './post.providers';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, CommentModule],
  providers: [PostService, PostResolver,
    ...postProviders],
  exports: [PostService]
})
export class PostModule {}
