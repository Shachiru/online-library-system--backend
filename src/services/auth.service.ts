import User from "../model/user.model";
import { UserDTO } from "../dto/user.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Blacklist from "../model/blacklist.model";

export const registerUser = async (user: UserDTO): Promise<UserDTO> => {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const newUser = await User.create({
        ...user,
        password: hashedPassword,
    });
    return newUser.toObject() as UserDTO;
};

export const loginUser = async (email: string, password: string): Promise<{ user: UserDTO; accessToken: string; refreshToken: string } | null> => {
    const user = await User.findOne({ email });
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    await User.findOneAndUpdate({ email }, { lastLoginAt: new Date() });

    const accessToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, role: user.role },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
    );

    return { user: user.toObject() as UserDTO, accessToken, refreshToken };
};

export const refreshToken = async (refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> => {
    const blacklisted = await Blacklist.findOne({ token: refreshToken });
    if (blacklisted) return null;

    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string; role: string }; // Changed roleVerify to role
        const user = await User.findById(payload.id);
        if (!user) return null;

        const accessToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET as string,
            { expiresIn: "1h" }
        );

        const newRefreshToken = jwt.sign(
            { id: user._id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: "7d" }
        );

        return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
        return null;
    }
};

export const getUserById = async (id: string): Promise<UserDTO | null> => {
    const user = await User.findById(id);
    return user ? user.toObject() as UserDTO : null;
};

export const updateUser = async (id: string, data: Partial<UserDTO>): Promise<UserDTO | null> => {
    const { role, ...updateData } = data;

    if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true });
    return user ? user.toObject() as UserDTO : null;
};

export const deleteUser = async (id: string): Promise<boolean> => {
    await User.deleteOne({ _id: id });
    return true;
};

export const validateUser = (user: UserDTO): string | null => {
    if (!user.name || !user.email || !user.password) {
        return "All required fields must be provided";
    }
    return null;
};

export const logoutUser = async (refreshToken: string): Promise<boolean> => {
    try {
        const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as { id: string };
        const decoded = jwt.decode(refreshToken) as { exp?: number };
        const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await Blacklist.create({ token: refreshToken, expiresAt });
        return true;
    } catch (error) {
        return false;
    }
};