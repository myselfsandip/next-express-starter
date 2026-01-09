import { getEnv } from "../utils/get-env.js";

const envConfig = () => ({
  NODE_ENV: getEnv("NODE_ENV", "development"),
  PORT: getEnv("PORT", "5000"),
  BASE_PATH: getEnv("BASE_PATH", "/api"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:3000"),
  LOG_LEVEL: getEnv("LOG_LEVEL", "info"),
  JWT_ACCESS_SECRET: getEnv("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET"),
  NODEMAILER_EMAIL: getEnv("NODEMAILER_EMAIL"),
  NODEMAILER_PASSWORD: getEnv("NODEMAILER_PASSWORD"),
  SEED_CONFIRM: getEnv("SEED_CONFIRM", "false"),
  AWS_S3_BUCKET_NAME: getEnv("AWS_S3_BUCKET_NAME"),
  AWS_REGION: getEnv("AWS_REGION"),
  AWS_ACCESS_KEY: getEnv("AWS_ACCESS_KEY"),
  AWS_SECRET_ACCESS_KEY: getEnv("AWS_SECRET_ACCESS_KEY"),
});

export const Env = envConfig();
