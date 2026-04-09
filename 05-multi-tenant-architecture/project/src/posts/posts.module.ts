import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TenantAwareRepository } from './posts.repository';
import { Post, PostSchema } from './posts.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
        AuthModule,
    ],
    controllers: [PostsController],
    providers: [PostsService, TenantAwareRepository],
})
export class PostsModule { }
