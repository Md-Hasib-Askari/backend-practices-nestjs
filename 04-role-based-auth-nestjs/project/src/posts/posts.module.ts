import { Logger, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PostOwnershipGuard } from './guards/posts.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './posts.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Post.name, schema: PostSchema }
    ]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, Logger, PostOwnershipGuard],
})
export class PostsModule {}
