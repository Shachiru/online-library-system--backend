import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../model/user.model";
import { UserDTO } from "../dto/user.dto";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET as string;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET as string;

const refreshTokens = new Set<string>();

export const authenticateUser = async (email: string, password: string) => {
    try {
        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return {
                success: false,
                message: "Authentication failed. User not found.",
                status: 404
            };
        }

        const isValidPassword = bcrypt.compareSync(password, existingUser.password);

        if (!isValidPassword) {
            return {
                success: false,
                message: "Authentication failed. Invalid password.",
                status: 401
            };
        }

        const accessToken = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
            },
            JWT_SECRET,
            { expiresIn: "5m" }
        );

        const refreshToken = jwt.sign(
            { email: existingUser.email },
            REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        refreshTokens.add(refreshToken);

        // Format user data to exclude sensitive information
        const userData = {
            id: existingUser._id,
            name: existingUser.name,
            email: existingUser.email,
            role: existingUser.role,
            createdAt: existingUser.createdAt
        };

        return {
            success: true,
            message: "Authentication successful",
            status: 200,
            data: {
                user: userData,
                accessToken,
                refreshToken
            }
        };
    } catch (error) {
        return {
            success: false,
            message: "Authentication failed due to server error",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};

export const createUser = async (userDTO: UserDTO) => {
    try {
        const existingUser = await User.findOne({ email: userDTO.email });

        if (existingUser) {
            return {
                success: false,
                message: "User with this email already exists",
                status: 409
            };
        }

        const hashedPassword = bcrypt.hashSync(userDTO.password, 10);
        const newUser = new User({
            name: userDTO.name,
            email: userDTO.email,
            password: hashedPassword,
            role: userDTO.role || "user",
            createdAt: userDTO.createdAt || new Date(),
        });

        await newUser.save();

        // Format user data to exclude sensitive information
        const userData = {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            createdAt: newUser.createdAt
        };

        return {
            success: true,
            message: "User created successfully",
            status: 201,
            data: {
                user: userData
            }
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to create user",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        if (!refreshToken) {
            return {
                success: false,
                message: "Refresh token is required",
                status: 400
            };
        }

        if (!refreshTokens.has(refreshToken)) {
            return {
                success: false,
                message: "Invalid refresh token",
                status: 401
            };
        }

        const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET) as { email: string };
        const user = await User.findOne({ email: decoded.email });

        if (!user) {
            return {
                success: false,
                message: "User not found",
                status: 404
            };
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: "5m" }
        );

        return {
            success: true,
            message: "Access token refreshed successfully",
            status: 200,
            data: {
                accessToken
            }
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to refresh token",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};

export const revokeRefreshToken = (refreshToken: string) => {
    try {
        if (!refreshToken) {
            return {
                success: false,
                message: "Refresh token is required",
                status: 400
            };
        }

        const wasPresent = refreshTokens.has(refreshToken);
        refreshTokens.delete(refreshToken);

        return {
            success: true,
            message: wasPresent ? "Refresh token revoked successfully" : "Token was already revoked or invalid",
            status: 200
        };
    } catch (error) {
        return {
            success: false,
            message: "Failed to revoke token",
            status: 500,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
};