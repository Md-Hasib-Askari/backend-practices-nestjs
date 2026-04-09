import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('posts')
@ApiHeader({ name: 'x-tenant-id', required: true })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('posts')
export class PostsController {
    constructor(private readonly postsService: PostsService) { }

    @Post()
    @RequirePermissions('posts:create')
    async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
        const tenantId = req.headers['x-tenant-id'] as string;
        return this.postsService.create(createPostDto, tenantId);
    }

    @Get()
    @RequirePermissions('posts:read')
    async findAll(@Req() req: Request) {
        const tenantId = req.headers['x-tenant-id'] as string;
        return this.postsService.findAll(tenantId);
    }

    @Get(':id')
    @RequirePermissions('posts:read')
    async findOne(@Param('id') id: string, @Req() req: Request) {
        const tenantId = req.headers['x-tenant-id'] as string;
        return this.postsService.findOne(id, tenantId);
    }

    @Patch(':id')
    @RequirePermissions('posts:update')
    async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @Req() req: Request) {
        const tenantId = req.headers['x-tenant-id'] as string;
        return this.postsService.update(id, updatePostDto, tenantId);
    }

    @Delete(':id')
    @RequirePermissions('posts:delete')
    async remove(@Param('id') id: string, @Req() req: Request) {
        const tenantId = req.headers['x-tenant-id'] as string;
        return this.postsService.remove(id, tenantId);
    }
}
