import { Module, forwardRef } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { CommentService } from './comment.service';
import { commentProviders } from './comment.providers';
import { CommentResolver } from './comment.resolver';
import { UserModule } from 'src/user/user.module';
import { PostModule } from 'src/post/post.module';

@Module({
    imports: [DatabaseModule, UserModule, forwardRef(() =>PostModule)],
    providers: [CommentService, CommentResolver,
      ...commentProviders],
    exports: [CommentService]
})
export class CommentModule {}
