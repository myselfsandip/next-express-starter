import { getEnv } from "../utils/get-env.js";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  JWT_SECRET: getEnv("JWT_SECRET"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
  NODEMAILER_EMAIL: getEnv("NODEMAILER_EMAIL", "example@gmail.com"),
  NODEMAILER_PASSWORD: getEnv("NODEMAILER_PASSWORD", "12345678"),
  SEED_CONFIRM: getEnv("SEED_CONFIRM", "false"),
});

export const Env = envConfig();
