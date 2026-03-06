import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User, { IUser } from "../models/user.model";
import { RegisterDTO, LoginDTO } from "../dtos/auth.dto";
import { HttpError } from "../errors/http-error";

export class AuthService {
  async register(data: RegisterDTO): Promise<IUser> {
    const { name, email, password } = data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new HttpError(400, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: name,
      email,
      password: hashedPassword,
      role: "user",
    });

    return user;
  }

  async login(data: LoginDTO): Promise<{ token: string }> {
    const { email, password } = data;

    const user = await User.findOne({ email });
    if (!user) {
      throw new HttpError(401, "Invalid credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "1d" }
    );

    return { token };
  }
}

export default new AuthService();