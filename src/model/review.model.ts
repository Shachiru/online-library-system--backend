import mongoose, {Schema} from "mongoose";

const ReviewModel = new mongoose.Schema(
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
        rating: {
            required: true,
            type: Number,
            min: 1,
            max: 5,
        },
        comment: {
            required: true,
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

const Review = mongoose.model('Review', ReviewModel);

export default Review;