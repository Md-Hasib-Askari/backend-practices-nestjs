import { Injectable } from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Tenant } from './tenants.schema';
import { Model } from 'mongoose';

@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<Tenant>,
  ) { }

  async create(createTenantDto: CreateTenantDto) {
    const createdTenant = new this.tenantModel(createTenantDto);
    return createdTenant.save();
  }

  async findAll() {
    return this.tenantModel.find().exec();
  }

  async findOne(id: number) {
    return this.tenantModel.findById(id).exec();
  }

  async update(id: number, updateTenantDto: UpdateTenantDto) {
    return this.tenantModel.findByIdAndUpdate(id, updateTenantDto, { new: true }).exec();
  }

  async remove(id: number) {
    return this.tenantModel.findByIdAndDelete(id).exec();
  }
}
