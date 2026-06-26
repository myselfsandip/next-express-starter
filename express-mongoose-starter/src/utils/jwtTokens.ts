import jwt, { JwtPayload } from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const generateToken = (userId: string) => {
    const accessToken = jwt.sign({ userId }, Env.JWT_SECRET, { expiresIn: '7d' });
    return accessToken;
};


export const verifyToken = (token: string): JwtPayload => {
    return jwt.verify(token, Env.JWT_SECRET) as JwtPayload;
}
