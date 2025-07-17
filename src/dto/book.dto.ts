export interface BookDTO {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    publicationYear: number;
    availability: boolean;
    reviews: string[];
    averageRating: number;
    createdAt: Date;
}