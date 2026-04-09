import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './users.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    ) { }

    async create(createUserDto: CreateUserDto, tenantId: string) {
        return new this.userModel({ ...createUserDto, tenantId }).save();
    }

    async findByEmail(email: string, tenantId: string) {
        return this.userModel.findOne({ email, tenantId }).exec();
    }

    async findById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async findAll(tenantId: string) {
        return this.userModel.find({ tenantId }).exec();
    }

    async findOne(id: string, tenantId: string) {
        return this.userModel.findOne({ _id: id, tenantId }).exec();
    }

    async update(id: string, updateUserDto: Partial<CreateUserDto>, tenantId: string) {
        return this.userModel.findOneAndUpdate({ _id: id, tenantId }, updateUserDto, { new: true }).exec();
    }

    async remove(id: string, tenantId: string) {
        return this.userModel.findOneAndDelete({ _id: id, tenantId }).exec();
    }

    async assignRole(id: string, role: string, tenantId: string) {
        const user = await this.userModel.findOneAndUpdate(
            { _id: id, tenantId },
            { role },
            { new: true },
        ).exec();
        if (!user) throw new Error('User not found');
        return user;
    }
}
