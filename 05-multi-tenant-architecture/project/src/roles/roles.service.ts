import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role, RoleDocument } from './roles.schema';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name) private readonly roleModel: Model<RoleDocument>,
    ) { }

    async create(dto: CreateRoleDto, tenantId: string) {
        const existing = await this.roleModel.findOne({ name: dto.name, tenantId }).exec();
        if (existing) throw new ConflictException(`Role '${dto.name}' already exists in this tenant`);
        return new this.roleModel({ ...dto, tenantId }).save();
    }

    async findAll(tenantId: string) {
        return this.roleModel.find({ tenantId }).exec();
    }

    async findOne(id: string, tenantId: string) {
        const role = await this.roleModel.findOne({ _id: id, tenantId }).exec();
        if (!role) throw new NotFoundException(`Role not found`);
        return role;
    }

    async findByName(name: string, tenantId: string) {
        return this.roleModel.findOne({ name, tenantId }).exec();
    }

    async update(id: string, dto: UpdateRoleDto, tenantId: string) {
        const role = await this.roleModel.findOneAndUpdate(
            { _id: id, tenantId },
            dto,
            { new: true },
        ).exec();
        if (!role) throw new NotFoundException(`Role not found`);
        return role;
    }

    async remove(id: string, tenantId: string) {
        const role = await this.roleModel.findOneAndDelete({ _id: id, tenantId }).exec();
        if (!role) throw new NotFoundException(`Role not found`);
        return role;
    }
}
