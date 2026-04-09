import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { JwtPayload } from '../strategies/jwt.strategy';
import { Role } from '../../roles/enums/roles.enum';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    private logger = new Logger(PermissionsGuard.name);

    canActivate(context: ExecutionContext): boolean {
        const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!required || required.length === 0) return true;

        const user = context.switchToHttp().getRequest().user as JwtPayload;
        this.logger.log(`Checking permissions for user ${user.email} | role: ${user.role} | permissions: ${user.permissions?.join(', ')}`);
        if (user.role === Role.ADMIN) return true; // Admins have all permissions

        return required.every((p) => user.permissions?.includes(p));
    }
}
