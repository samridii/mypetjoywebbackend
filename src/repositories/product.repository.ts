import Product, { IProduct } from "../models/product.model";

class ProductRepository {
  async create(data: Partial<IProduct>): Promise<IProduct> {
    return await Product.create(data);
  }

  async findAll(): Promise<IProduct[]> {
    return await Product.find();
  }

  async findById(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async update(id: string, data: Partial<IProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<IProduct | null> {
    return await Product.findByIdAndDelete(id);
  }
}

export default new ProductRepository();