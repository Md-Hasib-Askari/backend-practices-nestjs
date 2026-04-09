import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tenant } from '../tenants/tenants.schema';
import { Role } from '../roles/roles.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    email!: string;

    @Prop({ required: true })
    password!: string;

    @Prop({ required: true, ref: Role.name })
    roleId!: Types.ObjectId;

    @Prop({ required: true, ref: Tenant.name })
    tenantId!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Unique email per tenant
UserSchema.index({ email: 1, tenantId: 1 }, { unique: true });