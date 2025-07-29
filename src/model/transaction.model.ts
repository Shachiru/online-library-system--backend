import mongoose, { Schema } from "mongoose";

const TransactionModel = new mongoose.Schema({
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
    },
    borrowDate: {
        type: Date,
        default: Date.now,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    returnDate: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['borrowed', 'returned'],
        default: 'borrowed',
    },
});

const Transaction = mongoose.model('Transaction', TransactionModel);

export default Transaction;