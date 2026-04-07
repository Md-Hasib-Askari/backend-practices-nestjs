import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";
import { Product } from "src/products/products.schema";
import { User } from "src/user/users.schema";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
    userId: Types.ObjectId;

    @Prop({ type: [MongooseSchema.Types.ObjectId], ref: Product.name, required: true })
    products: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);