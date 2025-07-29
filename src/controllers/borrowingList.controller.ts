import {Request, Response} from "express";
import {
    getBorrowingListByUserId,
    addBookToBorrowingList,
    removeBookFromBorrowingList,
    validateBorrowingList, clearBorrowingListService,
} from "../services/borrowingList.service";
import {BorrowingListDTO} from "../dto/borrowingList.dto";
import {Types} from "mongoose";
import Book from "../model/book.model";
import {sendEmail} from "../services/email.service";
import User from "../model/user.model";

type AuthRequest = Request & { user?: { id: string; role: string } };

export const getBorrowingList = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: "User not authenticated"});
        }
        const userId = req.user.id;
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: "Invalid user ID format"});
        }
        const list = await getBorrowingListByUserId(userId);
        if (!list || list.books.length === 0) {
            return res.status(404).json({message: "No borrowing list found"});
        }
        res.status(200).json(list);
    } catch (error) {
        console.error("Error in getBorrowingList:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const addToBorrowingList = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: "User not authenticated"});
        }
        const userId = req.user.id;
        const {isbn} = req.body;
        if (!isbn) {
            return res.status(400).json({message: "ISBN is required"});
        }
        const book = await Book.findOne({isbn});
        if (!book) {
            console.log(`Book with ISBN ${isbn} not found`);
            return res.status(404).json({message: "Book not found"});
        }
        console.log(`Book found: ${book.title}, ISBN: ${isbn}, Availability: ${book.availability}`);
        if (!book.availability) {
            console.log(`Book ${book.title} is not available`);
            return res.status(400).json({message: "Book is not available"});
        }
        const existingList = await getBorrowingListByUserId(userId);
        if (existingList && existingList.books.some((b: any) => b.isbn === isbn)) {
            console.log(`Book ${book.title} already in borrowing list for userId: ${userId}`);
            return res.status(400).json({message: "Book already in borrowing list"});
        }
        const listDTO: BorrowingListDTO = {
            userId: new Types.ObjectId(userId),
            books: [book._id],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const validationError = validateBorrowingList(listDTO);
        if (validationError) {
            console.log(`Validation error: ${validationError}`);
            return res.status(400).json({message: validationError});
        }
        const list = await addBookToBorrowingList(userId, isbn);
        if (!list) {
            console.log(`Failed to add book ${isbn} to borrowing list for userId: ${userId}`);
            return res.status(404).json({message: "Book or borrowing list not found"});
        }
        const user = await User.findById(userId);
        if (user) {
            await sendEmail(
                user.email,
                "Book Added to Your Borrowing List",
                `Hi ${user.name},\n\nYou’ve added "${book.title}" by ${book.author} to your borrowing list. Enjoy your reading!\n\nBest,\nThe Library Team`
            );
        }
        res.status(200).json(list);
    } catch (error) {
        console.error("Error in addToBorrowingList:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const removeFromBorrowingList = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: "User not authenticated"});
        }
        const userId = req.user.id;
        const {isbn} = req.params;
        if (!isbn) {
            return res.status(400).json({message: "ISBN is required"});
        }
        const book = await Book.findOne({isbn});
        if (!book) {
            console.log(`Book with ISBN ${isbn} not found`);
            return res.status(404).json({message: "Book not found"});
        }
        const listDTO: BorrowingListDTO = {
            userId: new Types.ObjectId(userId),
            books: [book._id],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        const validationError = validateBorrowingList(listDTO);
        if (validationError) {
            console.log(`Validation error: ${validationError}`);
            return res.status(400).json({message: validationError});
        }
        const list = await removeBookFromBorrowingList(userId, isbn);
        if (!list) {
            console.log(`Book ${isbn} or borrowing list not found for userId: ${userId}`);
            return res.status(404).json({message: "Book or borrowing list not found"});
        }
        res.status(200).json(list);
    } catch (error) {
        console.error("Error in removeFromBorrowingList:", error);
        res.status(500).json({message: "Internal server error"});
    }
};

export const clearBorrowingList = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({message: "User not authenticated"});
        }
        const userId = req.user.id;
        if (!Types.ObjectId.isValid(userId)) {
            return res.status(400).json({message: "Invalid user ID format"});
        }
        const success = await clearBorrowingListService(userId);
        if (!success) {
            console.log(`Borrowing list not found for userId: ${userId}`);
            return res.status(404).json({message: "Borrowing list not found"});
        }
        res.status(200).json({message: "Borrowing list cleared successfully"});
    } catch (error) {
        console.error("Error in clearBorrowingList:", error);
        res.status(500).json({message: "Internal server error"});
    }
};