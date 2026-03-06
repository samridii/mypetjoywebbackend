import { Request, Response, NextFunction } from "express";

const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const isAdmin = adminMiddleware; 
export default adminMiddleware;