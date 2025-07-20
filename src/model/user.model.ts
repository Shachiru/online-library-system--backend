import mongoose from "mongoose";

const UserModel = new mongoose.Schema(
    {
        name: {
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
            unique: true,
            index: true,
        },
        password: {
            required: true,
            type: String,
        },
        role: {
            required: true,
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        lastLoginAt: {
            type: Date,
        }
    }
);

const User = mongoose.model('User', UserModel);

export default User;