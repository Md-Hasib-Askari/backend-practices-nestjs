import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  create(createProductDto: CreateProductDto) {
    // return this.productModel.create(createProductDto);
    return [];
  }

  findAll() {
    // return this.productModel.find().exec();
    return [];
  }

  findOne(id: string) {
    // return this.productModel.findOne({ _id: id }).exec();
    return null;
  }

  update(id: string, updateProductDto: UpdateProductDto) {
  // return this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).exec();
  }

  remove(id: string) {
    // return this.productModel.deleteOne({ _id: id }).exec();
    return null;
  }
}
