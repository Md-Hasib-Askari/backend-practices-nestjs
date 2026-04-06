import { Inject, Injectable } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class ProductService {
  readonly db = [
    { id: 1, name: 'Product 1', price: 10 },
    { id: 2, name: 'Product 2', price: 20 },
    { id: 3, name: 'Product 3', price: 30 },
  ];

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

  async addProduct(product: any) {
    // Simulate adding a product to the database
    const newProduct = { id: this.db.length + 1, ...product, date: new Date() };
    this.db.push(newProduct);
    return newProduct;
  }

  async getProduct(id: number) {
    const cacheKey = `product:${id}`;
    const cachedProduct = await this.cacheManager.get(cacheKey);
    if (cachedProduct) {
      console.log('CACHE HIT for product:', id);
      return cachedProduct;
    }

    // Simulate fetching product from database
    const product = this.db.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }

    // Cache the product for future requests
    await this.cacheManager.set(cacheKey, product, 60_000); // Cache for 60 seconds (ms)

    console.log('CACHE MISS for product:', id);
    return product;
  }

  async invalidateCache(id: number) {
    const cacheKey = `product:${id}`;
    await this.cacheManager.del(cacheKey);
    console.log('Cache invalidated for product:', id);
  }

  async findAll() {
    const date = new Date();

    // Simulate fetching all products from database
    return this.db.map((product) => ({ ...product, date }));
  }

  async findOne(id: number) {
    const date = new Date();

    // Simulate fetching a single product from database
    const product = this.db.find((p) => p.id === id);
    if (!product) {
      throw new Error(`Product with ID ${id} not found`);
    }
    return { ...product, date };
  }

  async update(id: number, updateProductDto: any) {
    // Simulate updating a product in the database
    const updatedProduct = { id, ...updateProductDto, date: new Date() };

    const index = this.db.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    this.db[index] = updatedProduct;

    // Invalidate cache for this product
    await this.invalidateCache(id);

    return updatedProduct;
  }

  async remove(id: number) {
    // Simulate removing a product from the database
    const index = this.db.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new Error(`Product with ID ${id} not found`);
    }
    this.db.splice(index, 1);

    // Invalidate cache for this product
    await this.invalidateCache(id);

    return { message: `Product ${id} removed` };
  }
}
