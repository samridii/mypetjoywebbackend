import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO, LoginUserDTO } from "../dtos/user.dto";
import z from "zod";

const userService = new UserService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const parsed = CreateUserDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const user = await userService.register(parsed.data);

      return res.status(201).json({
        success: true,
        message: "User registered successfully",
        data: user,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const parsed = LoginUserDTO.safeParse(req.body);

      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          message: z.prettifyError(parsed.error),
        });
      }

      const result = await userService.login(parsed.data);

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token: result.token,
        user: result.user,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

