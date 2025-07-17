export interface TransactionDTO {
    userId: string;
    bookId: string;
    borrowDate: Date;
    returnDate?: Date;
    dueDate: Date;
    status: 'borrowed' | 'returned' | 'overdue';
    createdAt: Date;
}