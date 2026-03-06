import productRepository from "../repositories/product.repository";

class ProductService {
  async getAllProducts() {
    return await productRepository.findAll();
  }

  async getProductById(id: string) {
    const product = await productRepository.findById(id);
    if (!product) throw new Error("Product not found");
    return product;
  }
}

export default new ProductService();