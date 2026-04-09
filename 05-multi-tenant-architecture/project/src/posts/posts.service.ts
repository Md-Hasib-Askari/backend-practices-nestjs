import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,

    ) { }

    create(createPostDto: CreatePostDto, tenantId: string) {
        return this.postModel.create({ ...createPostDto, tenantId });
    }

    findAll(tenantId: string) {
        return this.postModel.find({ tenantId }).exec();
    }

    async findOne(id: string, tenantId: string) {
        const post = await this.postModel.findOne({ _id: id, tenantId }).exec();
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto, tenantId: string) {
        const post = await this.postModel.findOneAndUpdate({ _id: id, tenantId }, updatePostDto, { new: true }).exec();
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }

    async remove(id: string, tenantId: string) {
        const post = await this.postModel.findOneAndDelete({ _id: id, tenantId }).exec();
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }
}
