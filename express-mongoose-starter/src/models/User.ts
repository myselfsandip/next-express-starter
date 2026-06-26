import mongoose, { Document, Schema } from "mongoose"

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    plan: "free" | "pro";
    analysisCount: number;
    analysisDate?: Date | null;
}

const userSchema: Schema<IUser> = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please use a valid email"],
    },
    password: {
        type: String,
        required: true,
    },
    plan: {
        type: String,
        enum: ["free", "pro"],
        default: "free"
    },
    analysisCount: {
        type: Number,
        default: 0,
    },
    analysisDate: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export const User = mongoose.model<IUser>("User", userSchema);