import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UnauthorizedException, Logger, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/dto/jwt-payload.dto';
import { PostOwnershipGuard } from './guards/posts.guard';

@Controller('posts')
  @UseGuards(JwtAuthGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly logger: Logger
  ) { }

  @Post()
  async create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    const user = req.user as JwtPayload;
    this.logger.debug(req.user);
    if (!user || user.sub === undefined) {
      throw new UnauthorizedException('You must be logged in to create a post');
    }
    return this.postsService.create(createPostDto, user.sub);
  }

  @Get()
  async findAll() {
    return this.postsService.findAll();
  }

  @Get('author')
  async findAllWithAuthor(@Req() req: Request) {
    const user = req.user as JwtPayload;
    return this.postsService.findAllByAuthor(user.sub);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(PostOwnershipGuard)
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
