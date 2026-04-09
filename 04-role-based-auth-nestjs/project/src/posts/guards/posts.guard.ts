import { CanActivate, ExecutionContext, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { JwtPayload } from "../../auth/dto/jwt-payload.dto";
import { Role } from "../../auth/enums/roles.enum";
import { PostsService } from "../posts.service";

@Injectable()
export class PostOwnershipGuard implements CanActivate {
    constructor(
        private readonly postsService: PostsService,
        private readonly logger: Logger
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const user = request.user as JwtPayload;
        const postId = request.params.id;

        this.logger.debug(`Checking ownership for user ${user.sub} on post ${postId}`);

        if (user.roles.includes(Role.Admin)) return true;

        const post = await this.postsService.findOne(postId);
        if (!post) throw new NotFoundException('Post not found');

        this.logger.debug(`Post author ID: ${post.authorId}, User ID: ${user.sub}`);

        return post.authorId.toString() === user.sub;
    }

}