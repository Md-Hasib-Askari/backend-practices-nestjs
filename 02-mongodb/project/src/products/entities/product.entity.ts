import * as mongoose from "mongoose";

export interface IProduct extends Document {
    name: string;
    price: number;
    description: string;
}

export const ProductSchema = new mongoose.Schema<IProduct>({
    name: String,
    price: Number,
    description: String,
});
