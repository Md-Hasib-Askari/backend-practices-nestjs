import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Model } from 'mongoose';
import { Post, PostDocument } from './posts.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable({ scope: Scope.REQUEST })
export class TenantAwareRepository {
    constructor(
        @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
        @Inject(REQUEST) private readonly request: Request,
    ) { }

    private get tenantId(): string {
        return (this.request as any).tenantId;
    }

    find() {
        return this.postModel.find({ tenantId: this.tenantId }).exec();
    }

    findById(id: string) {
        return this.postModel.findOne({ _id: id, tenantId: this.tenantId }).exec();
    }

    create(dto: CreatePostDto) {
        const post = new this.postModel({ ...dto, tenantId: this.tenantId });
        return post.save();
    }

    update(id: string, dto: UpdatePostDto) {
        return this.postModel
            .findOneAndUpdate({ _id: id, tenantId: this.tenantId }, dto, { new: true })
            .exec();
    }

    delete(id: string) {
        return this.postModel
            .findOneAndDelete({ _id: id, tenantId: this.tenantId })
            .exec();
    }
}
