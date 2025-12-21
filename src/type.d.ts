import z from "zod";
import { searchBookSchema } from "./validations/book.schema";
import { BookFormat, Prisma } from "./generated/prisma/client";

declare global {
    namespace Express {
        interface Request {
            validatedQuery?: z.infer<typeof searchBookSchema>;
        }
    }
}

interface JwtPayload {
    username: string,
    role: string
}

interface RestResponse<T = any, E = any> {
    statusCode: number;
    isSuccess: boolean;
    message: string;
    data?: T;
    error?: E;
}

interface MetaPaging {
    page: any;
    limit: any;
    totalItems: any;
    totalPages: any;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

interface SendEmailOption {
    to: string;
    subject: string;
    html?: string;
    text?: string;
}

interface SignInResponse {
    username: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}

interface UpdateBookEntity {
    bookId: number
    title: string,
    description: string,
    publishDate: string,
    language: string,
    pageCount: string,
    isbn10: string,
    isbn13: string,
    publisher: string,
    format: BookFormat,
    authorsId: number[],
    genresId: number[]
}

interface BookResponse {
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
    publicId: string | null,
    authors: { name: string; id: number; photoUrl: string | null; }[],
    genres: { id: number; genresName: string; }[],
    createdAt: Date,
    updatedAt: Date
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

type UserWithRole = Prisma.UserGetPayload<{
    include: {
        role: true
    }
}>

type UserWithRoleOrNull = Prisma.UserGetPayload<{
    include: {
        role: true
    }
}> | null