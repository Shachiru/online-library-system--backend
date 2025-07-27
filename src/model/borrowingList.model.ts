import mongoose, { Schema } from "mongoose";

const BorrowingListModel = new mongoose.Schema({
    userId: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    books: [{
        type: Schema.Types.ObjectId,
        ref: 'Book',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const BorrowingList = mongoose.model('BorrowingList', BorrowingListModel);

export default BorrowingList;