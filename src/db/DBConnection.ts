import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI as string; // Changed from MONDO_DB_URI to MONGO_DB_URI

const DBConnection = async () => {
    try {
        const connection = await mongoose.connect(MONGO_DB_URI);
        return `Successfully connected to MongoDB: ${connection.connection.host}`;
    } catch (error) {
        return "MongoDB connection Error: " + error;
    }
};

export default DBConnection;