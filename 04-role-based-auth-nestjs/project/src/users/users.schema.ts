import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "../auth/enums/roles.enum";

export type UserDocument = User & Document;

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({ required: true, min: 6 })
    password!: string;

    @Prop({ required: true, type: [String], default: [Role.User], enum: Role })
    roles!: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);