import { Prop, Schema } from "@nestjs/mongoose";
import { Tenant } from "../tenants/tenants.schema";
import { Types } from "mongoose";

@Schema()
export class User {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true })
    password!: string;

    @Prop({ required: true, default: 'user' })
    role!: string;

    @Prop({ required: true, ref: Tenant.name })
    tenantId!: Types.ObjectId;
}