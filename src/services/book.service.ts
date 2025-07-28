import Book from "../model/book.model";
import {BookDTO} from "../dto/book.dto";

export const getAllBooks = async (): Promise<BookDTO[]> => {
    return Book.find().populate('reviews');
};

export const saveBook = async (book: BookDTO): Promise<BookDTO> => {
    return Book.create(book);
};

export const getBookById = async (isbn: string): Promise<BookDTO | null> => {
    return Book.findOne({isbn}).populate('reviews');
};

export const updateBook = async (isbn: string, data: Partial<BookDTO>): Promise<BookDTO | null> => {
    const book = await Book.findOneAndUpdate({isbn}, data, {new: true});
    if (!book) {
        return null;
    }
    return book;
};

export const deleteBook = async (isbn: string): Promise<boolean> => {
    await Book.deleteOne({isbn});
    return true;
};

export const validateBook = (book: BookDTO): string | null => {
    if (!book.title || !book.author || !book.isbn || !book.genre || !book.publicationYear) {
        return 'All required fields must be provided';
    }
    return null;
};

export const searchBooksByTitle = async (title: string): Promise<BookDTO[]> => {
    return Book.find({
        title: { $eq: title }
    }).collation({ locale: 'en', strength: 2 }).populate('reviews');
};

export const searchBooksByGenre = async (genre: string): Promise<BookDTO[]> => {
    return Book.find({
        genre: { $eq: genre }
    }).collation({ locale: 'en', strength: 2 }).populate('reviews');
};