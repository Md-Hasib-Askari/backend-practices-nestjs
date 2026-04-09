import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { TenantAwareRepository } from './posts.repository';

@Injectable()
export class PostsService {
    constructor(private readonly repository: TenantAwareRepository) { }

    create(createPostDto: CreatePostDto) {
        return this.repository.create(createPostDto);
    }

    findAll() {
        return this.repository.find();
    }

    async findOne(id: string) {
        const post = await this.repository.findById(id);
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }

    async update(id: string, updatePostDto: UpdatePostDto) {
        const post = await this.repository.update(id, updatePostDto);
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }

    async remove(id: string) {
        const post = await this.repository.delete(id);
        if (!post) throw new NotFoundException(`Post ${id} not found`);
        return post;
    }
}
