import {Request, Response} from "express";
import {
    getBorrowingListByUserId,
    addBookToBorrowingList,
    removeBookFromBorrowingList,
    clearBorrowingList as clearBorrowingListService,
    validateBorrowingList
} from "../services/borrowingList.service";
import {BorrowingListDTO} from "../dto/borrowingList.dto";
import {Types} from "mongoose";
import Book from "../model/book.model";

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
        if (!list) {
            return res.status(404).json({message: "Borrowing list not found"});
        }
        res.json(list);
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
        // Fetch book to get ObjectId
        const book = await Book.findOne({isbn});
        if (!book) {
            return res.status(404).json({message: "Book not found"});
        }
        // Create BorrowingListDTO with ObjectId
        const listDTO: BorrowingListDTO = {
            userId: new Types.ObjectId(userId),
            books: [book._id],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const validationError = validateBorrowingList(listDTO);
        if (validationError) {
            return res.status(400).json({message: validationError});
        }
        const list = await addBookToBorrowingList(userId, isbn);
        if (!list) {
            return res.status(404).json({message: "Book or borrowing list not found"});
        }
        res.json(list);
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
        // Fetch book to get ObjectId
        const book = await Book.findOne({isbn});
        if (!book) {
            return res.status(404).json({message: "Book not found"});
        }
        // Create BorrowingListDTO for validation
        const listDTO: BorrowingListDTO = {
            userId: new Types.ObjectId(userId),
            books: [book._id],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        const validationError = validateBorrowingList(listDTO);
        if (validationError) {
            return res.status(400).json({message: validationError});
        }
        const list = await removeBookFromBorrowingList(userId, isbn);
        if (!list) {
            return res.status(404).json({message: "Book or borrowing list not found"});
        }
        res.json(list);
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
            return res.status(404).json({message: "Borrowing list not found"});
        }
        res.json({message: "Borrowing list cleared successfully"});
    } catch (error) {
        console.error("Error in clearBorrowingList:", error);
        res.status(500).json({message: "Internal server error"});
    }
};