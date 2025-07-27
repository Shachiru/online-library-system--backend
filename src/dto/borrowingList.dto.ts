import { Types } from 'mongoose';

export interface BorrowingListDTO {
    userId: Types.ObjectId;
    books: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}