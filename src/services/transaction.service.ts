import mongoose from "mongoose";
import Transaction from "../model/transaction.model";
import Book from "../model/book.model";
import { TransactionDTO } from "../dto/transaction.dto";
import { sendEmail } from "./email.service";
import User from "../model/user.model";
import BorrowingList from "../model/borrowingList.model";

export const createBorrowTransaction = async (userId: string, bookIds: string[]): Promise<TransactionDTO[]> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
    }
    const transactions: TransactionDTO[] = [];
    const user = await User.findById(userId);
    if (!user) {
        throw new Error("User not found");
    }

    for (const bookId of bookIds) {
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw new Error(`Invalid book ID format: ${bookId}`);
        }
        const book = await Book.findById(bookId);
        if (!book) {
            throw new Error(`Book not found: ${bookId}`);
        }
        if (!book.availability) {
            console.log(`Book not available: ${book.title} (ID: ${bookId})`);
            throw new Error(`Book is not available: ${book.title}`);
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const transaction = await Transaction.create({
            userId,
            bookId,
            dueDate,
        });

        await Book.findByIdAndUpdate(bookId, { availability: false });
        console.log(`Borrowed book: ${book.title} (ID: ${bookId}) for userId: ${userId}`);

        await sendEmail(
            user.email,
            "Book Borrowed",
            `Hi ${user.name},\n\nYou have successfully borrowed "${book.title}" by ${book.author}. It is due on ${dueDate.toDateString()}.\n\nBest,\nThe Library Team`
        );

        transactions.push(transaction.toObject() as TransactionDTO);
    }

    await BorrowingList.findOneAndUpdate({ userId }, { books: [], updatedAt: new Date() });
    console.log(`Cleared borrowing list for userId: ${userId}`);

    return transactions;
};

export const returnBookTransaction = async (transactionId: string, userId: string): Promise<TransactionDTO> => {
    if (!mongoose.Types.ObjectId.isValid(transactionId)) {
        throw new Error("Invalid transaction ID format");
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid user ID format");
    }
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
        throw new Error("Transaction not found");
    }
    if (transaction.status === 'returned') {
        throw new Error("Book already returned");
    }
    if (transaction.userId.toString() !== userId) {
        throw new Error("Unauthorized to return this book");
    }
    const book = await Book.findById(transaction.bookId);
    if (!book) {
        throw new Error(`Book not found: ${transaction.bookId}`);
    }
    transaction.status = 'returned';
    transaction.returnDate = new Date();
    await transaction.save();
    await Book.findByIdAndUpdate(transaction.bookId, { availability: true });
    console.log(`Returned book: ${book.title} (ID: ${transaction.bookId}) for userId: ${userId}`);
    const user = await User.findById(userId);
    if (user) {
        await sendEmail(
            user.email,
            "Book Returned",
            `Hi ${user.name},\n\nYou have successfully returned "${book.title}" by ${book.author}.\n\nBest,\nThe Library Team`
        );
    }
    return transaction.toObject() as TransactionDTO;
};

export const validateTransaction = (transaction: TransactionDTO): string | null => {
    if (!transaction.userId || !transaction.bookId || !transaction.dueDate) {
        return 'User ID, Book ID, and due date are required';
    }
    return null;
};