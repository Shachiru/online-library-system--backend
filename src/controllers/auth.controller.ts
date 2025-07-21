import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationError = authService.validateUser(req.body);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const user = await authService.registerUser(req.body);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error registering user", error });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const result = await authService.loginUser(email, password);
        if (!result) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        res.status(200).json({ user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await authService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error fetching user", error });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role, ...updateData } = req.body;
        if (role !== undefined) {
            res.status(400).json({ message: "Updating the role is not allowed" });
            return;
        }
        const validationError = authService.validateUser(updateData);
        if (validationError) {
            res.status(400).json({ message: validationError });
            return;
        }
        const user = await authService.updateUser(req.params.id, updateData);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "Error updating user", error });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const success = await authService.deleteUser(req.params.id);
        if (!success) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ message: "User deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.status(400).json({ message: "Refresh token is required" });
            return;
        }
        const success = await authService.logoutUser(refreshToken);
        if (!success) {
            res.status(400).json({ message: "Invalid or expired refresh token" });
            return;
        }
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error logging out", error });
    }
};