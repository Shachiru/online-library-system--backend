import {Request, Response, NextFunction} from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('Token:', token); // Log the token
    if (!token) {
        res.status(401).json({ error: 'Auth token is not present in request headers!' });
        return;
    }
    jwt.verify(token, JWT_SECRET, (error, user) => {
        if (error) {
            console.log('JWT Error:', error); // Log the error
            res.status(403).json({ error: 'Invalid or expired token!' });
            return;
        }
        console.log('Decoded User:', user); // Log the decoded user
        (req as Request & { user?: any }).user = user;
        next();
    });
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = (req as Request & { user?: any }).user;
        console.log('User Role:', user?.role); // Log the user role
        if (!user || !roles.includes(user.role)) {
            res.status(403).json({
                error: 'Access denied! User does not have permission to perform this operation.'
            });
            return;
        }
        next();
    };
};