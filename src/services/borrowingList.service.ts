import {Types} from "mongoose";
import BorrowingList from "../model/borrowingList.model";
import Book from "../model/book.model";
import {BorrowingListDTO} from "../dto/borrowingList.dto";

export const getBorrowingListByUserId = async (userId: string) => {
    console.log(`Fetching borrowing list for userId: ${userId}`);
    const list = await BorrowingList.findOne({userId}).populate('books');
    if (!list || list.books.length === 0) {
        console.log(`No borrowing list found or list is empty for userId: ${userId}`);
        return null;
    }
    return list;
};

export const addBookToBorrowingList = async (userId: string, isbn: string) => {
    const book = await Book.findOne({isbn});
    if (!book) {
        console.log(`Book with ISBN ${isbn} not found`);
        return null;
    }
    console.log(`Adding book ${book.title} (ISBN: ${isbn}, Availability: ${book.availability}) to borrowing list for userId: ${userId}`);
    let list = await BorrowingList.findOne({userId});
    if (!list) {
        list = new BorrowingList({userId, books: []});
    }
    if (!list.books.includes(book._id)) {
        list.books.push(book._id);
        await list.save();
    }
    return list.populate('books');
};

export const removeBookFromBorrowingList = async (userId: string, isbn: string) => {
    const book = await Book.findOne({isbn});
    if (!book) {
        console.log(`Book with ISBN ${isbn} not found`);
        return null;
    }
    console.log(`Removing book ${book.title} (ISBN: ${isbn}) from borrowing list for userId: ${userId}`);
    const list = await BorrowingList.findOne({userId});
    if (!list) {
        console.log(`Borrowing list not found for userId: ${userId}`);
        return null;
    }
    list.books = list.books.filter((bookId) => bookId.toString() !== book._id.toString());
    await list.save();
    return list.populate('books');
};

export const clearBorrowingListService = async (userId: string) => {
    console.log(`Clearing borrowing list for userId: ${userId}`);
    const list = await BorrowingList.findOne({userId});
    if (!list) {
        console.log(`Borrowing list not found for userId: ${userId}`);
        return false;
    }
    list.books = [];
    await list.save();
    return true;
};

export const validateBorrowingList = (listDTO: BorrowingListDTO): string | null => {
    if (!Types.ObjectId.isValid(listDTO.userId)) {
        return "Invalid user ID format";
    }
    if (!listDTO.books.every((bookId) => Types.ObjectId.isValid(bookId))) {
        return "Invalid book ID format";
    }
    return null;
};