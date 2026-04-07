import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema, Types } from "mongoose";

export type OrderDocument = Order & Document;

@Schema()
export class Order {
    @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
    userId: Types.ObjectId;

    @Prop({ type: [MongooseSchema.Types.ObjectId], required: true })
    products: Types.ObjectId[];
}

export const OrderSchema = SchemaFactory.createForClass(Order);