import { NextFunction, Request, Response } from "express";
import { addBook, getBooks, getBooksPaging, searchBook, searchBookSize, updateBook, updateBookImageUrl } from "../services/book.service";
import { booksPagingMapper, bookWithAuthorAndGenresMapper } from "../mappers/book.mapper";
import HTTP_STATUS from "../constants/httpStatus.constanst";
import { responseMapper } from "../mappers/rest-response.mapper";
import fs from 'fs';
import prisma from "../configs/prisma.client.config";
import { BookStatus } from "../generated/prisma/enums";
import { MetaPaging } from "../type";

const getBooksHomepage = async (req: Request, res: Response) => {
    try {

        const safePage = 1;
        const safeLimit = 10;

        const booksPaging = await getBooksPaging(safePage * safeLimit, safeLimit);
        const totalItems = (await getBooks()).length;

        const totalPages = Math.ceil(totalItems / safeLimit);

        const metaPaging: MetaPaging = {
            page: safePage,
            limit: safeLimit,
            totalPages,
            totalItems,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1
        }

        const responseData = booksPagingMapper(booksPaging, metaPaging);

        return res.status(HTTP_STATUS.OK).json(responseMapper({
            statusCode: HTTP_STATUS.OK,
            isSuccess: true,
            message: "GET BOOKS SUCCESSFULLY",
            data: responseData,
            error: null
        }));
    } catch (error) {
        throw error;
    }
}

const getBooksPagingController = async (req: Request, res: Response) => {
    try {
        const { page, limit } = req.query;

        const safePage = Number(page) <= 1 ? 1 : Number(page) - 1;
        const safeLimit = limit == null ? 10 : Number(limit);

        const booksPaging = await getBooksPaging(safePage * safeLimit, safeLimit);
        const totalItems = (await getBooks()).length;

        const totalPages = Math.ceil(totalItems / safeLimit);

        const metaPaging: MetaPaging = {
            page: safePage,
            limit: safeLimit,
            totalPages,
            totalItems,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1
        }

        const responseData = booksPagingMapper(booksPaging, metaPaging);

        return res.status(HTTP_STATUS.OK).json(responseMapper({
            statusCode: HTTP_STATUS.OK,
            isSuccess: true,
            message: "GET BOOKS SUCCESSFULLY",
            data: responseData,
            error: null
        }));
    } catch (error) {
        throw error;
    }
}

const createBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let imageCloudUrl = "Image not found on cloud";

        const {
            title,
            description,
            publishDate,
            language,
            pageCount,
            isbn10,
            isbn13,
            publisher,
            format,
            authorsIdRaw,
            genresIdRaw
        } = req.body;

        let authorsId: number[] = []; //['1','2','3'] || "1,2,3"

        if (Array.isArray(authorsIdRaw)) {
            authorsId = authorsIdRaw.map((item) => {
                return Number(item);
            })
        } else if (typeof authorsIdRaw === "string") {
            authorsId = authorsIdRaw.split(',').map((item) => Number(item.trim()));
        }

        let genresId: number[] = [];

        if (Array.isArray(genresIdRaw)) {
            genresId = genresIdRaw.map((item) => {
                return Number(item);
            })
        } else if (typeof genresIdRaw === "string") {
            genresId = genresIdRaw.split(',').map((item) => Number(item.trim()));
        }

        const newBook = {
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
        };

        const result = await addBook(newBook);

        let filePath = "";
        if (req.file) {
            filePath = req.file.path;

            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting local file:', err);
            });
        };

        const responseData = bookWithAuthorAndGenresMapper(result);

        return res.status(HTTP_STATUS.CREATED).json(responseMapper({
            statusCode: HTTP_STATUS.CREATED,
            isSuccess: true,
            message: "CREATED BOOK SUCCESSFULLY",
            data: responseData,
            error: null
        }))
    } catch (error) {
        throw error;
    }
}

const updateBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookId = req.params.bookId;
        const {
            title,
            description,
            publishDate,
            language,
            pageCount,
            isbn10,
            isbn13,
            publisher,
            format,
            authorsIdRaw,
            genresIdRaw
        } = req.body;

        let authorsId: number[] = []; //['1','2','3'] || "1,2,3"

        if (Array.isArray(authorsIdRaw)) {
            authorsId = authorsIdRaw.map((item) => {
                return Number(item);
            })
        } else if (typeof authorsIdRaw === "string") {
            authorsId = authorsIdRaw.split(',').map((item) => Number(item.trim()));
        }

        let genresId: number[] = [];

        if (Array.isArray(genresIdRaw)) {
            genresId = genresIdRaw.map((item) => {
                return Number(item);
            })
        } else if (typeof genresIdRaw === "string") {
            genresId = genresIdRaw.split(',').map((item) => Number(item.trim()));
        }

        const updatedBook = {
            bookId: Number(bookId),
            title,
            description,
            publishDate,
            language,
            pageCount,
            isbn10,
            isbn13,
            publisher,
            format,
            authorsId,
            genresId
        }

        let result = await updateBook(updatedBook);

        if (req.file) {
            let filePath = "";
            let uploadImageUrl = "";
            filePath = req.file.path;

            fs.unlink(filePath, (err) => {
                if (err) console.error('Error deleting local file:', err);
            });

            result = await updateBookImageUrl(result.id, uploadImageUrl);
        };

        const responseData = bookWithAuthorAndGenresMapper(result);

        return res.status(HTTP_STATUS.CREATED).json(responseMapper({
            statusCode: HTTP_STATUS.CREATED,
            isSuccess: true,
            message: "UPDATED BOOK SUCCESSFULLY",
            data: responseData,
            error: null
        }))
    } catch (error) {
        throw error;
    }
}

const deleteBookController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookId } = req.params;
        const result = await prisma.book.update({
            where: {
                id: Number(bookId)
            },
            data: {
                status: BookStatus.ARCHIVED
            }
        })
        return res.status(HTTP_STATUS.OK).json(responseMapper({
            statusCode: HTTP_STATUS.OK,
            isSuccess: true,
            message: "DELETE BOOK SUCCESSFULLY",
            data: null,
            error: null
        }));
    } catch (error) {
        throw error;
    }
}

const searchBookController = async (req: Request, res: Response) => {
    try {
        console.log(">>> [searchBookController] req.query:", req.query);
        if (req.validatedQuery == undefined) {
            throw new Error("validatedQuery is required, assure middlewares works properly");
        }
        console.log(">>> [searchBookController] req.validatedQuery:", req.validatedQuery);

        const {
            keyword,
            page,
            limit,
            sort,
            searchByTarget,
            sortByTarget,
            bookStatus
        } = req.validatedQuery;

        const safePage = Number(page) <= 1 ? 1 : Number(page);
        const safeLimit = Number(limit) <= 1 ? 10 : Number(limit);

        const searchObject = {
            keyword: (keyword + "").trim(),
            skip: (safePage - 1) * 10,
            limit: safeLimit,
            sort: (sort + "").trim(),
            searchByTarget: (searchByTarget + "").trim(),
            sortByTarget: (sortByTarget + "").trim(),
            bookStatus
        };

        console.log(">>> [searchBookController] searchObject:", searchObject);

        const result = await searchBook(searchObject);

        const totalItems = await searchBookSize(searchObject);
        const totalPages = Math.ceil(totalItems / 10);

        const meta: MetaPaging = {
            page: safePage,
            limit: safeLimit,
            totalPages,
            totalItems,
            hasNextPage: safePage < totalPages,
            hasPreviousPage: safePage > 1
        };

        const responseData = booksPagingMapper(result, meta);

        return res.status(HTTP_STATUS.OK).json(responseMapper({
            statusCode: HTTP_STATUS.OK,
            isSuccess: true,
            message: "SEARCH BOOK SUCCESSFULLY",
            data: responseData,
            error: null
        }))
    } catch (error) {
        throw error;
    }
}

export {
    getBooksHomepage,
    getBooksPagingController,
    createBookController,
    updateBookController,
    deleteBookController,
    searchBookController
}