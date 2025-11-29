import { Book, Prisma } from "../generated/prisma/client";
import { BookResponse, booksPagingResponse } from "../responseDtos/book.dto";
import { MetaPaging } from "../responseDtos/meta.dto";

const booksPagingMapper = (books: any, meta: MetaPaging) => {
    return new booksPagingResponse({
        books,
        meta
    });
}

type BookWithAuthorsWithGenres = Prisma.BookGetPayload<{
    include: {
        authors: {
            select: {
                id: true;
                name: true;
                photoUrl: true;
            };
        };
        genres: {
            select: {
                id: true;
                genresName: true;
            };
        };
    };
}>;

const bookWithAuthorAndGenresMapper = (book: BookWithAuthorsWithGenres) => {
    const {
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
    } = book;

    return new BookResponse({
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
    });
}

export {
    booksPagingMapper,
    bookWithAuthorAndGenresMapper
}