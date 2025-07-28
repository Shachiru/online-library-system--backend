import {Router} from 'express';
import {
    getAllBooks,
    saveBook,
    getBookById,
    updateBook,
    deleteBook,
    searchBooksByTitle,
    searchBooksByGenre,
    filterBooksByPublicationYear,
    filterBooksByAuthor,
    filterBooks,
    filterBooksByAvailability, filterBooksByRating
} from '../controllers/book.controller';
import {authorizeRoles} from "../middleware/auth.middleware";

const bookRoutes: Router = Router();

bookRoutes.get('/search', searchBooksByTitle);

bookRoutes.get('/search-genre', searchBooksByGenre);

bookRoutes.get('/filter-year', filterBooksByPublicationYear);

bookRoutes.get('/filter-author', filterBooksByAuthor);

bookRoutes.get('/filter', filterBooks);

bookRoutes.get('/filter-availability', filterBooksByAvailability);

bookRoutes.get('/filter-rating', filterBooksByRating);

bookRoutes.get('/all', getAllBooks);

bookRoutes.post('/save', authorizeRoles('admin'), saveBook);

bookRoutes.get('/:isbn', getBookById);

bookRoutes.put('/update/:isbn', authorizeRoles('admin'), updateBook);

bookRoutes.delete('/delete/:isbn', authorizeRoles('admin'), deleteBook);

export default bookRoutes;