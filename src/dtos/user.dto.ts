import { z } from "zod";

export const registerDto = z.object({
  email: z.string().email(),
  username: z.string(),
  password: z.string().min(6),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});

export const loginDto = z.object({
  email: z.string().email(),
  password: z.string(),
});
