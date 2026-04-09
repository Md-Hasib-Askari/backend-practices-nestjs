import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type RoleDocument = Role & Document;

@Schema({ timestamps: true })
export class Role {
    @Prop({ required: true })
    name!: string;

    @Prop({ type: [String], default: [] })
    permissions!: string[];

    @Prop({ required: true, index: true })
    tenantId!: string;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

// Unique role name per tenant
RoleSchema.index({ name: 1, tenantId: 1 }, { unique: true });
