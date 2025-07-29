import { Request, Response } from "express";
import { createBorrowTransaction, returnBookTransaction } from "../services/transaction.service";
import { Types } from "mongoose";

type AuthRequest = Request & { user?: { id: string; role: string } };

export const borrowBooks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { userId, bookId } = req.body;
        if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: "Invalid user ID or book ID" });
        }
        const transactions = await createBorrowTransaction(userId, [bookId]);
        res.status(200).json({ message: "Book borrowed successfully", transactions });
    } catch (error: any) {
        console.error("Error in borrowBooks:", error);
        res.status(400).json({ error: error.message || "Failed to borrow book" });
    }
};

export const returnBooks = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const { transactionId } = req.body;
        if (!Types.ObjectId.isValid(transactionId)) {
            return res.status(400).json({ error: "Invalid transaction ID" });
        }
        const transaction = await returnBookTransaction(transactionId, req.user.id);
        res.status(200).json({ message: "Book returned successfully", transaction });
    } catch (error: any) {
        console.error("Error in returnBooks:", error);
        res.status(400).json({ error: error.message || "Failed to return book" });
    }
};