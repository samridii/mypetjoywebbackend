import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(5050),
  MONGO_URI: z.string().min(10),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),

  JWT_EXPIRES_IN: z.string().default('7d'),

  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error(' Invalid environment variables:', parsed.error.format());
  process.exit(1);
}

const env = parsed.data;

export default env;
