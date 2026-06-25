import jwt, { type JwtPayload } from "jsonwebtoken";
import { Env } from "../config/env.config.js";

export const generateAccessToken = (userId: string) => {
    const accessToken = jwt.sign({ userId }, Env.JWT_ACCESS_SECRET, { expiresIn: '60m' });
    return accessToken;
};

export const generateRefreshToken = (userId: string) => {
    const refreshToken = jwt.sign({ userId }, Env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    return refreshToken;
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, Env.JWT_ACCESS_SECRET) as JwtPayload;
}
export const verifyRefreshToken = (token: string): JwtPayload => {
    return jwt.verify(token, Env.JWT_REFRESH_SECRET) as JwtPayload;
}

