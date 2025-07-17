import mongoose, {Schema} from "mongoose";

const BookModel = new mongoose.Schema(
    {
        title: {
            required: true,
            type: String,
        },
        author: {
            required: true,
            type: String,
        },
        isbn: {
            required: true,
            type: String,
            unique: true,
            index: true,
        },
        genre: {
            required: true,
            type: String,
        },
        publicationYear: {
            required: true,
            type: Number,
        },
        availability: {
            type: Boolean,
            default: true,
        },
        reviews: [{
            type: Schema.Types.ObjectId,
            ref: 'Review',
        }],
        averageRating: {
            type: Number,
            default: 0,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }
);

const Book = mongoose.model('Book', BookModel);

export default Book;