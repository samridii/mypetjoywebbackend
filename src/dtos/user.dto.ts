import { z } from 'zod';

export const registerUserDto = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(50),
  email: z.string().email('Invalid email address').min(5),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['user', 'admin']).optional().default('user'), // admin only via DB or special route
});

export const loginUserDto = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authResponseDto = z.object({
  success: z.literal(true),
  token: z.string(),
  user: z.object({
    id: z.string(),
    fullName: z.string(),
    email: z.string(),
    role: z.enum(['user', 'admin']),
  }),
});


export type CreateUserDTO = z.infer<typeof registerUserDto>;
export type LoginUserDTO = z.infer<typeof loginUserDto>;
