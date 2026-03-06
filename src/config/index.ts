export const JWT_SECRET = process.env.JWT_SECRET || (() => {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production");
  }
  console.warn(" JWT_SECRET not set — using insecure default (dev only)");
  return "dev_secret_change_me";
})();

export const MONGODB_URI = process.env.MONGODB_URI ?? "";

export const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

export const PORT = process.env.PORT ?? "5050";