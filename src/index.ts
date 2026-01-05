import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import connectDB from "./database/mongodb";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5050;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
