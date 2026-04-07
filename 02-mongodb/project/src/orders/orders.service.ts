import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './orders.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel('Order') private orderModel: Model<Order>
  ) { }

  create(createOrderDto: CreateOrderDto) {
    return this.orderModel.create(createOrderDto);
  }

  findAll() {
    return this.orderModel.find().exec();
  }

  findOne(id: string) {
    return this.orderModel.findById(id).exec();
  }

  async findByUser(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('userId', 'name email') // Populate user details
      .populate('products', 'name price') // Populate product details
      .lean().exec();
  }

  update(id: string, updateOrderDto: UpdateOrderDto) {
    return this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
