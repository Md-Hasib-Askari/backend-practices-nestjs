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
}
