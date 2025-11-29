import prisma from "../configs/prisma.client.config";
import { BookFormat } from "../generated/prisma/enums";

const getBooksPaging = async (skip: number, limit: number) => {
    try {
        const books = prisma.book.findMany({
            skip,
            take: limit,
            orderBy: {
                title: "asc"
            }
        });
        return books;
    } catch (error) {
        throw error;
    }
}

const getBooks = async () => {
    try {
        return prisma.book.findMany();
    } catch (error) {
        throw error;
    }
}

const getBooksWithAuthorsAndGenres = async () => {
    try {
        return prisma.book.findMany({
            include: {
                authors: true,
                genres: true
            }
        });
    } catch (error) {
        throw error;
    }
}

const getBooksWithAuthors = async () => {
    try {
        return prisma.book.findMany({
            include: {
                authors: true
            }
        });
    } catch (error) {
        throw error;
    }
}

const getBooksWithGenres = async () => {
    try {
        return prisma.book.findMany({
            include: {
                genres: true
            }
        });
    } catch (error) {
        throw error;
    }
}

const addBook = async ({
    title,
    description,
    publishDate,
    language,
    pageCount,
    isbn10,
    isbn13,
    publisher,
    format,
    imageCloudUrl,
    authorsId,
    genresId
}: {
    title: string,
    description: string,
    publishDate: string,
    language: string,
    pageCount: string,
    isbn10: string,
    isbn13: string,
    publisher: string,
    format: BookFormat,
    imageCloudUrl: string,
    authorsId: number[],
    genresId: number[]
}) => {
    try {
        const newBook = prisma.book.create({
            data: {
                title,
                description,
                publishDate,
                language,
                pageCount: Number(pageCount),
                isbn10,
                isbn13,
                publisher,
                format,
                coverImageUrl: imageCloudUrl,
                authors: {
                    connect: authorsId.map((id) => {
                        return { id }
                    })
                },
                genres: {
                    connect: genresId.map((id) => ({ id }))
                }
            },
            include: {
                authors: {
                    select: {
                        id: true,
                        name: true,
                        photoUrl: true
                    }
                },
                genres: {
                    select: {
                        id: true,
                        genresName: true
                    }
                }
            }
        });

        return newBook;
    } catch (error) {
        throw error;
    }
}

export {
    getBooksPaging,
    getBooks,
    getBooksWithAuthorsAndGenres,
    getBooksWithAuthors,
    getBooksWithGenres,
    addBook
}