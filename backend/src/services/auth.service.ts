import { db } from "../db/index";
import { users } from "../db/schema";
import { and, eq } from "drizzle-orm";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/jwtTokens";
import { BadRequestException, UnauthorizedException } from "../utils/app-error";
import { ErrorCodeEnum } from "../utils/error-code.enum";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator";
import { comparePassword, hashPassword } from "../utils/helper";


export const registerUser = async (data: RegisterSchemaType) => {
    const [existingUser] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (existingUser) {
        throw new BadRequestException("Email already exists", ErrorCodeEnum.VALIDATION_ERROR);
    }

    const hashedPassword = await hashPassword(data.password);

    const [newUser] = await db.insert(users).values({
        ...data,
        password: hashedPassword,
    }).returning();

    const accessToken = generateAccessToken(newUser.id);
    const refreshToken = generateRefreshToken(newUser.id);

    await db.update(users)
        .set({ refreshToken: refreshToken })
        .where(eq(users.id, newUser.id));

    const { password, ...safeUser } = newUser;

    return { user: safeUser, accessToken, refreshToken };
};

export const loginUser = async (data: LoginSchemaType) => {
    const [user] = await db.select().from(users)
        .where(
            and(eq(users.email, data.email),
                eq(users.banned, false),
                eq(users.isDeleted, false
                ))).limit(1);
    if (!user || !user.password) {
        throw new BadRequestException("Invalid credentials", ErrorCodeEnum.AUTH_USER_NOT_FOUND);
    }

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
        throw new BadRequestException("Invalid credentials", ErrorCodeEnum.AUTH_INVALID_TOKEN);
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await db.update(users)
        .set({ refreshToken: refreshToken })
        .where(eq(users.id, user.id));

    const { password, ...safeUser } = user;
    return { user: safeUser, accessToken, refreshToken };
};

export const refreshUserToken = async (token: string) => {
    let decoded;
    try {
        decoded = verifyRefreshToken(token);
    } catch (e) {
        throw new UnauthorizedException("Invalid refresh token", ErrorCodeEnum.AUTH_INVALID_TOKEN);
    }

    const [user] = await db.select().from(users).where(eq(users.id, decoded.userId)).limit(1);

    if (!user || user.refreshToken !== token) {
        throw new UnauthorizedException("Invalid or expired refresh token", ErrorCodeEnum.AUTH_INVALID_TOKEN);
    }

    const accessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);
    await db.update(users)
        .set({ refreshToken: newRefreshToken })
        .where(eq(users.id, user.id));

    return { accessToken, newRefreshToken };
};
