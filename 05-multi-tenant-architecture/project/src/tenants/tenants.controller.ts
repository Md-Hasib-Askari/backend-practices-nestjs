import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('tenants')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@RequirePermissions('tenants:manage')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  async create(@Body() createTenantDto: CreateTenantDto) {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  async findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTenantDto: UpdateTenantDto) {
    return this.tenantsService.update(id, updateTenantDto);
  }

  @Patch(':id/activate')
  async activate(@Param('id') id: string) {
    return this.tenantsService.update(id, { isActive: true });
  }

  @Patch(':id/deactivate')
  async deactivate(@Param('id') id: string) {
    return this.tenantsService.update(id, { isActive: false });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.tenantsService.remove(id);
  }
}
