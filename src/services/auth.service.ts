import User from "../model/user.model";
import { UserDTO } from "../dto/user.dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
        { id: user._id, roleVerify: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
        { id: user._id, roleVerify: user.role },
        process.env.REFRESH_TOKEN_SECRET as string,
        { expiresIn: "7d" }
    );

    return { user: user.toObject() as UserDTO, accessToken, refreshToken };
};

export const getUserById = async (id: string): Promise<UserDTO | null> => {
    const user = await User.findById(id);
    return user ? user.toObject() as UserDTO : null;
};

export const updateUser = async (id: string, data: Partial<UserDTO>): Promise<UserDTO | null> => {
    if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, data, { new: true });
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