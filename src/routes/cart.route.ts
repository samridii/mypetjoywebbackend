import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware";
import CartModel from "../models/cart.model";

const router = Router();

router.use(authMiddleware);

router.get("/", async (req: any, res, next) => {
  try {
    const cart = await CartModel.findOne({ user: req.user._id }).populate("items.product");
    res.json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: any, res, next) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    let cart = await CartModel.findOne({ user: userId });

    if (!cart) {
      cart = await CartModel.create({ user: userId, items: [{ product: productId, quantity }] });
    } else {
      const existingItem = cart.items.find(
        (item: any) => item.product.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      await cart.save();
    }

    await cart.populate("items.product");
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.delete("/:productId", async (req: any, res, next) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await CartModel.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item: any) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
});

router.delete("/", async (req: any, res, next) => {
  try {
    await CartModel.findOneAndDelete({ user: req.user._id });
    res.json({ success: true, message: "Cart cleared" });
  } catch (error) {
    next(error);
  }
});

export default router;