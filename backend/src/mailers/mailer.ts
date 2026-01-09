import nodemailer from "nodemailer";
import { Env } from "../config/env.config";

export const createTransporter = () => {
    if (!Env.NODEMAILER_EMAIL || !Env.NODEMAILER_PASSWORD) {
        throw new Error("Email credentials not configured");
    }

    return nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: Env.NODEMAILER_EMAIL,
            pass: Env.NODEMAILER_PASSWORD,
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
    });
};