import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './products.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>
  ) { }

  create(createProductDto: CreateProductDto) {
    return this.productModel.create(createProductDto);
  }

  findAll() {
    const products = this.productModel.find().exec();
    if (!products) {
      throw new Error('No products found');
    }
    return products;
  }

  findOne(id: string) {
    const product = this.productModel.findById(id).exec();
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
    const product = this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  remove(id: string) {
    const product = this.productModel.findByIdAndDelete(id).exec();
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }
}
