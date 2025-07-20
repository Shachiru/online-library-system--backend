import { Request, Response } from "express";
import { authenticateUser, createUser, refreshAccessToken, revokeRefreshToken } from "../services/auth.service";
import { UserDTO } from "../dto/user.dto";

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const userDTO: UserDTO = {
            name,
            email,
            password,
            role: role || "user",
            createdAt: new Date()
        };

        const result = await createUser(userDTO);

        // Return the response with status code from the service
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during registration",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const result = await authenticateUser(email, password);

        // Return the response with status code from the service
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during login",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const refresh = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const result = await refreshAccessToken(refreshToken);

        // Return the response with status code from the service
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error while refreshing token",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: "Refresh token is required"
            });
        }

        const result = revokeRefreshToken(refreshToken);

        // Return the response with status code from the service
        return res.status(result.status).json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error during logout",
            error: error instanceof Error ? error.message : "Unknown error"
        });
    }
};