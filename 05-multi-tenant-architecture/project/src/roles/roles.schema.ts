import { Schema } from "@nestjs/mongoose";

@Schema()
export class Role {
    name!: string;
    permissions!: string[];
}