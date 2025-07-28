import {Request, Response} from 'express';
import * as bookService from '../services/book.service';

export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const books = await bookService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({message: 'Error fetching books', error});
    }
};

export const saveBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationError = bookService.validateBook(req.body);
        if (validationError) {
            res.status(400).json({message: validationError});
            return;
        }
        const book = await bookService.saveBook(req.body);
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({message: 'Error saving book', error});
    }
};

export const getBookById = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await bookService.getBookById(req.params.isbn);
        if (!book) {
            res.status(404).json({message: 'Book not found'});
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message: 'Error fetching book', error});
    }
};

export const updateBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const validationError = bookService.validateBook(req.body);
        if (validationError) {
            res.status(400).json({message: validationError});
            return;
        }
        const book = await bookService.updateBook(req.params.isbn, req.body);
        if (!book) {
            res.status(404).json({message: 'Book not found'});
            return;
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(400).json({message: 'Error updating book', error});
    }
};

export const deleteBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const book = await bookService.deleteBook(req.params.isbn);
        if (!book) {
            res.status(404).json({message: 'Book not found'});
            return;
        }
        res.status(200).json({message: 'Book deleted'});
    } catch (error) {
        res.status(500).json({message: 'Error deleting book', error});
    }
};

export const searchBooksByTitle = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.query;
        if (!title || typeof title !== 'string') {
            res.status(400).json({ message: 'Title query parameter is required' });
            return;
        }
        const books = await bookService.searchBooksByTitle(title);
        res.status(200).json(books); // Return books or empty array
    } catch (error) {
        res.status(500).json({ message: 'Error searching books', error });
    }
};

export const searchBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre } = req.query;
        if (!genre || typeof genre !== 'string') {
            res.status(400).json({ message: 'Genre query parameter is required' });
            return;
        }
        const books = await bookService.searchBooksByGenre(genre);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error searching books by genre', error });
    }
};

export const filterBooksByPublicationYear = async (req: Request, res: Response): Promise<void> => {
    try {
        const { year } = req.query;
        if (!year || typeof year !== 'string' || isNaN(parseInt(year))) {
            res.status(400).json({ message: 'Valid year query parameter is required' });
            return;
        }
        const books = await bookService.filterBooksByPublicationYear(parseInt(year));
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering books by publication year', error });
    }
};

export const filterBooksByAuthor = async (req: Request, res: Response): Promise<void> => {
    try {
        const { author } = req.query;
        if (!author || typeof author !== 'string') {
            res.status(400).json({ message: 'Author query parameter is required' });
            return;
        }
        const books = await bookService.filterBooksByAuthor(author);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering books by author', error });
    }
};

export const filterBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, genre, year, author } = req.query;
        if (!title && !genre && !year && !author) {
            res.status(400).json({ message: 'At least one filter parameter is required' });
            return;
        }
        const filters: {
            title?: string;
            genre?: string;
            publicationYear?: number;
            author?: string;
        } = {};
        if (title && typeof title === 'string') filters.title = title;
        if (genre && typeof genre === 'string') filters.genre = genre;
        if (year && typeof year === 'string' && !isNaN(parseInt(year))) filters.publicationYear = parseInt(year);
        if (author && typeof author === 'string') filters.author = author;
        const books = await bookService.filterBooks(filters);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: 'Error filtering books', error });
    }
};