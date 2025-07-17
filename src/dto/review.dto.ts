export interface ReviewDTO {
    userId: string;
    bookId: string;
    rating: number;
    comment: string;
    createdAt: Date;
}