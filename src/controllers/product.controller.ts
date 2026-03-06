import { Request, Response } from "express";
import productService from "../services/product.service";

class ProductController {
  async getAllProducts(req: Request, res: Response) {
    const products = await productService.getAllProducts();
    res.json({ success: true, data: products });
  }

  async getProductById(req: Request, res: Response) {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, data: product });
  }
}

export default new ProductController();