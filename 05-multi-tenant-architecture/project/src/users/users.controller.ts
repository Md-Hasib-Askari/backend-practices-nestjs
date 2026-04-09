import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AssignRoleDto } from './dto/assign-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('users')
@ApiHeader({ name: 'x-tenant-id', required: true })
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    @UseGuards(PermissionsGuard)
    @RequirePermissions('users:create')
    create(@Body() createUserDto: CreateUserDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.create(createUserDto, tenantId);
    }

    @Get()
    @UseGuards(PermissionsGuard)
    @RequirePermissions('users:read')
    findAll(@Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.findAll(tenantId);
    }

    @Get(':id')
    @UseGuards(PermissionsGuard)
    @RequirePermissions('users:read')
    findOne(@Param('id') id: string, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.findOne(id, tenantId);
    }

    @Patch(':id')
    @UseGuards(PermissionsGuard)
    @RequirePermissions('users:update')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.update(id, updateUserDto, tenantId);
    }

    @Patch(':id/role')
    @UseGuards(PermissionsGuard)
    @RequirePermissions('roles:manage')
    assignRole(@Param('id') id: string, @Body() dto: AssignRoleDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.assignRole(id, dto.role, tenantId);
    }

    @Delete(':id')
    @UseGuards(PermissionsGuard)
    @RequirePermissions('users:delete')
    remove(@Param('id') id: string, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.usersService.remove(id, tenantId);
    }
}
