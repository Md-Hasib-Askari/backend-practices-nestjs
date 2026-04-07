import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {
    @Prop({ required: true, trim: true })
    name: string

    @Prop({ required: true, min: 0 })
    price: number

    @Prop({ default: true })
    isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);