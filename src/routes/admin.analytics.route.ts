import { Router } from "express";
import User from "../models/user.model";
import Pet from "../models/pet.model";
import Product from "../models/product.model";
import Order from "../models/order.model";
import Adoption from "../models/adoption.model";
import authMiddleware from "../middlewares/auth.middleware";
import adminMiddleware from "../middlewares/admin.middleware";

const router = Router();

router.get("/", authMiddleware, adminMiddleware, async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPets = await Pet.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalAdoptions = await Adoption.countDocuments();

    const revenue = await Order.aggregate([
      { $match: { status: "PAID" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);
    const totalRevenue = revenue[0]?.totalRevenue || 0;

    const dailyRevenue = await Order.aggregate([
      { $match: { status: "PAID" } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { status: "PAID" } },
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const topProducts = await Order.aggregate([
      { $match: { status: "PAID" } },
      { $unwind: "$products" },
      {
        $group: {
          _id: "$products.product",
          totalSold: { $sum: "$products.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);

    const mostAdoptedPets = await Adoption.aggregate([
      { $match: { status: "APPROVED" } },
      { $group: { _id: "$pet", totalAdopted: { $sum: 1 } } },
      { $sort: { totalAdopted: -1 } },
      { $limit: 5 },
    ]);

    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          users: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.status(200).json({
      success: true,
      analytics: {
        overview: { totalUsers, totalPets, totalProducts, totalOrders, totalAdoptions, totalRevenue },
        charts: { dailyRevenue, monthlyRevenue, topProducts, mostAdoptedPets, userGrowth },
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;