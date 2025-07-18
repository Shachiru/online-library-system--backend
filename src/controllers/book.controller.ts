import { Request, Response } from 'express';
import * as BookService from '../services/book.service';

// Get all books
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await BookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books', error });
    }
};

// Save a new book
export const saveBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await BookService.saveBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error saving book', error });
    }
};

// Get book by ISBN
export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await BookService.getBookById(req.params.isbn);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book', error });
    }
};

// Update book by ISBN
export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await BookService.updateBook(req.params.isbn, req.body);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({ message: 'Error updating book', error });
    }
};

// Delete book by ISBN
export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await BookService.deleteBook(req.params.isbn);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting book', error });
    }
};