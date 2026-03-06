import productRepository from "../../repositories/product.repository";
import { IProduct } from "../../models/product.model";

class AdminProductService {
  async createProduct(data: Partial<IProduct>) {
    return await productRepository.create(data);
  }

  async getAllProducts() {
    return await productRepository.findAll();
  }

  async updateProduct(id: string, data: Partial<IProduct>) {
    const product = await productRepository.update(id, data);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async deleteProduct(id: string) {
    const product = await productRepository.delete(id);
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export default new AdminProductService();