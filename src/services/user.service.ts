import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import { HttpError } from "../errors/http-error";

const userRepository = new UserRepository();

export class UserService {
  async register(data: CreateUserDTO) {
    const emailExists = await userRepository.getUserByEmail(data.email);
    if (emailExists) {
      throw new HttpError(403, "Email already in use");
    }

    const usernameExists = await userRepository.getUserByUsername(data.username);
    if (usernameExists) {
      throw new HttpError(403, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await userRepository.createUser({
      email: data.email,
      username: data.username,
      password: hashedPassword,
    });

    return user;
  }

  async login(data: LoginUserDTO) {
    const user = await userRepository.getUserByEmail(data.email);

    if (!user) {
      throw new HttpError(404, "User not found");
    }

    const isValid = await bcrypt.compare(data.password, user.password);

    if (!isValid) {
      throw new HttpError(401, "Invalid credentials");
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "30d" }
    );

    return { token, user };
  }
}


