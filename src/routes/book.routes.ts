import {Router} from 'express';
import {getAllBooks, saveBook, getBookById, updateBook, deleteBook} from '../controllers/book.controller';

const bookRoutes: Router = Router();

bookRoutes.get('/all', getAllBooks);

bookRoutes.post('/save', saveBook);

bookRoutes.get('/:isbn', getBookById);

bookRoutes.put('/update/:isbn', updateBook);

bookRoutes.delete('/delete/:isbn', deleteBook);

export default bookRoutes;