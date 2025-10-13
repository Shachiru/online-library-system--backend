import {Request, Response} from "express";
import * as authService from "../services/auth.service";
import {sendEmail} from "../services/email.service";
import User from "../model/user.model"; // Fixed import path

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log('Registration request received:', req.body);

        const validationError = authService.validateUser(req.body);
        if (validationError) {
            console.log('Validation error:', validationError);
            res.status(400).json({message: validationError});
            return;
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            console.log('Email already exists:', req.body.email);
            res.status(400).json({message: "Email is already registered"});
            return;
        }

        const user = await authService.registerUser(req.body);
        console.log('User registered successfully:', user.email);

        try {
            await sendEmail(
                user.email,
                "Welcome to Online Library System",
                `Hello ${user.name},\n\nWelcome to our Online Library System! We're excited to have you on board. Start exploring our collection today.\n\nBest regards,\nThe Library Team`
            );
            console.log('Welcome email sent to:', user.email);
        } catch (emailError) {
            console.error('Failed to send welcome email:', emailError);
            // Continue with registration even if email fails
        }

        res.status(201).json(user);
    } catch (error: any) {
        console.error('Registration error:', error);

        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            res.status(400).json({message: "Email is already registered"});
            return;
        }

        res.status(400).json({
            message: "Error registering user",
            error: error.message || String(error)
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;
        const result = await authService.loginUser(email, password);
        if (!result) {
            res.status(401).json({message: "Invalid credentials"});
            return;
        }
        res.status(200).json({user: result.user, accessToken: result.accessToken, refreshToken: result.refreshToken});
    } catch (error) {
        res.status(500).json({message: "Error logging in", error});
    }
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await authService.getUserById(req.params.id);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message: "Error fetching user", error});
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {role, ...updateData} = req.body;
        if (role !== undefined) {
            res.status(400).json({message: "Updating the role is not allowed"});
            return;
        }

        if (updateData.name && updateData.name.trim().length < 2) {
            res.status(400).json({message: "Name must be at least 2 characters"});
            return;
        }

        const user = await authService.updateUser(req.params.id, updateData);
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({message: "Error updating user", error});
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const success = await authService.deleteUser(req.params.id);
        if (!success) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json({message: "User deleted"});
    } catch (error) {
        res.status(500).json({message: "Error deleting user", error});
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const {refreshToken} = req.body;
        if (!refreshToken) {
            res.status(400).json({message: "Refresh token is required"});
            return;
        }
        const success = await authService.logoutUser(refreshToken);
        if (!success) {
            res.status(400).json({message: "Invalid or expired refresh token"});
            return;
        }
        res.status(200).json({message: "Logged out successfully"});
    } catch (error) {
        res.status(500).json({message: "Error logging out", error});
    }
};