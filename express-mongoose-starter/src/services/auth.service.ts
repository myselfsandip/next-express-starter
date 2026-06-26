import { User } from "../models/User.js";
import { BadRequestException, NotFoundException } from "../utils/app-error.js";
import { ErrorCodeEnum } from "../utils/error-code.enum.js";
import { comparePassword, hashPassword } from "../utils/helper.js";
import { generateToken } from "../utils/jwtTokens.js";
import { LoginSchemaType, RegisterSchemaType } from "../validators/auth.validator.js";

export const registerUser = async (data: RegisterSchemaType) => {
    const existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
        throw new BadRequestException("Email already Exists", ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS);
    }

    //Hash Password
    const hashedPassword = await hashPassword(data.password);

    //Create New User
    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
    });

    //Generate JWT
    const token = generateToken(user._id.toString());

    //Give Response with User Data
    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            plan: user.plan,
        },
        token
    }
}

export const loginUser = async (data: LoginSchemaType) => {
    const user = await User.findOne({ email: data.email });
    if (!user) {
        throw new NotFoundException("User not found", ErrorCodeEnum.AUTH_USER_NOT_FOUND);
    }
    //Compare Password
    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) {
        throw new BadRequestException("Invalid Password", ErrorCodeEnum.AUTH_INVALID_TOKEN)
    }
    const token = generateToken(user._id.toString());

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            plan: user.plan,
        },
        token
    }
}
