import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type TenantDocument = Tenant & Document;

@Schema()
export class Tenant {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    slug!: string;

    @Prop({ required: true, default: true })
    isActive!: boolean;

    @Prop()
    description!: string;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);