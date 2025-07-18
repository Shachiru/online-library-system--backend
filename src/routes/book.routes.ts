import { Router } from 'express';
import { getAllBooks, saveBook, getBookById, updateBook, deleteBook } from '../controllers/book.controller';
import { validateBook } from '../services/book.service';

const bookRoutes: Router = Router();

bookRoutes.get('/all', getAllBooks);

bookRoutes.post('/save', async (req, res, next) => {
    const validationError = validateBook(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    next();
}, saveBook);

bookRoutes.get('/:isbn', getBookById);

bookRoutes.put('/update/:isbn', async (req, res, next) => {
    const validationError = validateBook(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }
    next();
}, updateBook);

bookRoutes.delete('/delete/:isbn', deleteBook);

export default bookRoutes;