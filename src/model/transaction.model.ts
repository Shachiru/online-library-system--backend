import mongoose, {Schema} from "mongoose";

const TransactionModel = new mongoose.Schema(
    {
        userId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'User',
            index: true,
        },
        bookId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'Book',
            index: true,
        },
        borrowDate: {
            required: true,
            type: Date,
            default: Date.now,
        },
        returnDate: {
            type: Date,
        },
        dueDate: {
            required: true,
            type: Date,
        },
        status: {
            required: true,
            type: String,
            enum: ['borrowed', 'returned', 'overdue'],
            default: 'borrowed',
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
)

const Transaction = mongoose.model('Transaction', TransactionModel);

export default Transaction;