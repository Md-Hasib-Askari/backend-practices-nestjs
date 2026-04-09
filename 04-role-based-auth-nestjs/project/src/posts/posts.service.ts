import { Inject, Injectable, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserDocument } from '../users/users.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { }

  async create(createPostDto: CreatePostDto, userId: string) {
    const createdPost = new this.postModel({ ...createPostDto, authorId: userId });
    return createdPost.save();
  }

  async findAll() {
    return this.postModel.find().populate('authorId', 'email');
  }

  async findAllByAuthor(authorId: string) {
    return this.postModel.find({ authorId }).populate('authorId', 'email');
  }

  async findOne(id: string) {
    return this.postModel.findById(id);
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    return this.postModel.findByIdAndUpdate(id, updatePostDto, { returnDocument: 'after' }).populate('authorId', 'email');
  }

  async remove(id: string) {
    return this.postModel.findByIdAndDelete(id).populate('authorId', 'email');
  }
}
