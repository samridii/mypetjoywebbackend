import { Request, Response } from "express";
import adminProductService from "../../services/admin/product.service";

class AdminProductController {
  async createProduct(req: Request, res: Response) {
    const product = await adminProductService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  }

  async getAllProducts(req: Request, res: Response) {
    const products = await adminProductService.getAllProducts();
    res.json({ success: true, data: products });
  }

  async updateProduct(req: Request, res: Response) {
    const product = await adminProductService.updateProduct(
      req.params.id,
      req.body
    );
    res.json({ success: true, data: product });
  }

  async deleteProduct(req: Request, res: Response) {
    await adminProductService.deleteProduct(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  }
}

export default new AdminProductController();