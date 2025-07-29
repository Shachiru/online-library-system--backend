import { Types } from 'mongoose';

export interface TransactionDTO {
    userId: Types.ObjectId;
    bookId: Types.ObjectId;
    borrowDate: Date;
    dueDate: Date;
    returnDate?: Date | null;
    status: 'borrowed' | 'returned';
}