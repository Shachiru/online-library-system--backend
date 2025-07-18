import { Types } from 'mongoose';

export interface BookDTO {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    availability: boolean;
    reviews: Types.ObjectId[];
    averageRating: number;
    createdAt: Date;
    coverImage?: string | null;
}