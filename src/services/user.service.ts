import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";

class UserService {
  async register(data: any) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = await User.create({
      ...data,
      password: hashed,
    });

    return user;
  }

  async login(data: any) {
    const user: IUser | null = await User.findOne({ email: data.email });

    if (!user) {
      throw new Error("User not found");
    }

    const match = await bcrypt.compare(data.password, user.password);

    if (!match) {
      throw new Error("Invalid password");
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return { token };
  }
}

export default new UserService();

