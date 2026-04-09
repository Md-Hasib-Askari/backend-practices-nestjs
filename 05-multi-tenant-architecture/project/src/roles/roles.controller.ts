import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import type { Request } from 'express';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('roles')
@ApiHeader({ name: 'x-tenant-id', required: true })
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('roles:manage')
@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() dto: CreateRoleDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.rolesService.create(dto, tenantId);
    }

    @Get()
    findAll(@Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.rolesService.findAll(tenantId);
    }

    @Get(':id')
    findOne(@Param('id') id: string, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.rolesService.findOne(id, tenantId);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateRoleDto, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.rolesService.update(id, dto, tenantId);
    }

    @Delete(':id')
    remove(@Param('id') id: string, @Req() req: Request) {
        const tenantId = (req as any).tenantId as string;
        return this.rolesService.remove(id, tenantId);
    }
}
