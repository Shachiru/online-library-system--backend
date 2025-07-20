import {Router} from 'express';
import {getAllBooks, saveBook, getBookById, updateBook, deleteBook} from '../controllers/book.controller';
import {authorizeRoles} from "../middleware/auth.middleware";

const bookRoutes: Router = Router();

bookRoutes.get('/all', getAllBooks);

bookRoutes.post('/save', authorizeRoles('admin'), saveBook);

bookRoutes.get('/:isbn', getBookById);

bookRoutes.put('/update/:isbn', authorizeRoles('admin'), updateBook);

bookRoutes.delete('/delete/:isbn', authorizeRoles('admin'), deleteBook);

export default bookRoutes;