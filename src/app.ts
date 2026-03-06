import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";

import authRoutes         from "./routes/auth.route";
import { HttpError }      from "./errors/http-error";

import userRoutes         from "./routes/user.route";
import petRoutes          from "./routes/pet.route";
import adoptionRoutes     from "./routes/adoption.route";
import productRoutes      from "./routes/product.route";
import cartRoutes         from "./routes/cart.route";
import orderRoutes        from "./routes/order.route";
import aiRoutes           from "./routes/ai.route";
import quizRoutes         from "./routes/quiz.route";
import costRoutes         from "./routes/cost.route";

import adminUserRoutes    from "./routes/admin/user.route";
import adminPetRoutes     from "./routes/admin/pet.route";
import adminProductRoutes from "./routes/admin/product.route";
import adminOrderRoutes   from "./routes/admin/order.route";
import adminAdoptionRoutes from "./routes/admin/adoption.route";
import analyticsRoutes    from "./routes/admin.analytics.route";

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

app.use("/api/auth",      authRoutes);
app.use("/api/user",      userRoutes);
app.use("/api/pets",      petRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/products",  productRoutes);
app.use("/api/cart",      cartRoutes);
app.use("/api/orders",    orderRoutes);
app.use("/api/ai",        aiRoutes);
app.use("/api/quiz",      quizRoutes);
app.use("/api/cost",      costRoutes);

app.use("/api/admin/pets",      adminPetRoutes);
app.use("/api/admin/products",  adminProductRoutes);
app.use("/api/admin/orders",    adminOrderRoutes);
app.use("/api/admin/adoptions", adminAdoptionRoutes);
app.use("/api/admin/analytics", analyticsRoutes);
app.use("/api/admin/users",     adminUserRoutes);  

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/", (_req, res) => res.send("Server is running"));

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const statusCode = err instanceof HttpError ? err.statusCode : 500;
  const message    = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, error: message });
});

export default app;