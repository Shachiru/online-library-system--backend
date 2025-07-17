import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from "../model/user.model";
import Book from "../model/book.model";
import Transaction from "../model/transaction.model";
import Review from "../model/review.model";

dotenv.config();

const MONGO_DB_URI = process.env.MONGO_DB_URI as string; // Changed from MONDO_DB_URI to MONGO_DB_URI

const DBConnection = async () => {
    try {
        mongoose.model('User', User.schema);
        mongoose.model('Book', Book.schema);
        mongoose.model('Transaction', Transaction.schema);
        mongoose.model('Review', Review.schema);

        const connection = await mongoose.connect(MONGO_DB_URI);
        return `Successfully connected to MongoDB: ${connection.connection.host}`;
    } catch (error) {
        return "MongoDB connection Error: " + error;
    }
};

export default DBConnection;