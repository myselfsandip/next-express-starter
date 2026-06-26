import mongoose from "mongoose";
import { Env } from "./env.config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(Env.DATABASE_URL);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
};