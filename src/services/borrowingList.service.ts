import mongoose from "mongoose";
import BorrowingList from "../model/borrowingList.model";
import Book from "../model/book.model";
import {BorrowingListDTO} from "../dto/borrowingList.dto";

export const getBorrowingListByUserId = async (userId: string): Promise<BorrowingListDTO | null> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }
    return BorrowingList.findOne({userId}).populate('books');
};

export const addBookToBorrowingList = async (userId: string, isbn: string): Promise<BorrowingListDTO | null> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }
    const book = await Book.findOne({isbn});
    if (!book) {
        return null;
    }
    let list = await BorrowingList.findOne({userId});
    if (!list) {
        list = new BorrowingList({userId, books: [book._id]});
    } else {
        if (!list.books.some(id => id.toString() === book._id.toString())) {
            list.books.push(book._id);
        }
    }
    list.updatedAt = new Date();
    return list.save();
};

export const removeBookFromBorrowingList = async (userId: string, isbn: string): Promise<BorrowingListDTO | null> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return null;
    }
    const book = await Book.findOne({isbn});
    if (!book) {
        return null;
    }
    const list = await BorrowingList.findOne({userId});
    if (list) {
        list.books = list.books.filter(id => id.toString() !== book._id.toString());
        list.updatedAt = new Date();
        return list.save();
    }
    return null;
};

export const clearBorrowingList = async (userId: string): Promise<boolean> => {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return false;
    }
    const list = await BorrowingList.findOne({userId});
    if (list) {
        list.books = [];
        list.updatedAt = new Date();
        await list.save();
        return true;
    }
    return false;
};

export const validateBorrowingList = (list: BorrowingListDTO): string | null => {
    if (!list.userId || !list.books) {
        return 'User ID and books are required';
    }
    return null;
};