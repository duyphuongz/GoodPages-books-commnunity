import { Book, BookFormat } from "../generated/prisma/client";
import { MetaPaging } from "../type";
import { MetaPagingDTO } from "./meta.dto";

class booksPagingResponse {
    books: Book[] | any;
    meta: MetaPaging;

    constructor({
        books,
        meta
    }: {
        books: any,
        meta: MetaPaging
    }) {
        this.books = books;
        this.meta = meta;
    }
}

class BookResponse {
    id: number;
    title: string;
    description: string | null;
    publishDate: Date | null;
    language: string;
    pageCount: number | null;
    isbn10: string | null;
    isbn13: string | null;
    publisher: string | null;
    format: BookFormat | null;
    averageRating: number;
    ratingsCount: number;
    reviewsCount: number;
    coverImageUrl: string | null;
    authors: { name: string; id: number; photoUrl: string | null; }[];
    genres: { id: number; genresName: string; }[];
    createdAt: Date;
    updatedAt: Date;

    constructor({
        id,
        title,
        description,
        publishDate,
        language,
        pageCount,
        isbn10,
        isbn13,
        publisher,
        format,
        averageRating,
        ratingsCount,
        reviewsCount,
        coverImageUrl,
        authors,
        genres,
        createdAt,
        updatedAt
    }: {
        id: number,
        title: string,
        description: string | null,
        publishDate: Date | null,
        language: string,
        pageCount: number | null,
        isbn10: string | null,
        isbn13: string | null,
        publisher: string | null,
        format: BookFormat | null,
        averageRating: number,
        ratingsCount: number,
        reviewsCount: number,
        coverImageUrl: string | null,
        authors: { name: string; id: number; photoUrl: string | null; }[],
        genres: { id: number; genresName: string; }[],
        createdAt: Date,
        updatedAt: Date
    }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.publishDate = publishDate;
        this.language = language;
        this.pageCount = pageCount;
        this.isbn10 = isbn10;
        this.isbn13 = isbn13;
        this.publisher = publisher;
        this.format = format;
        this.averageRating = averageRating;
        this.ratingsCount = ratingsCount;
        this.reviewsCount = reviewsCount;
        this.coverImageUrl = coverImageUrl;
        this.authors = authors;
        this.genres = genres;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}

export {
    booksPagingResponse,
    BookResponse
}



