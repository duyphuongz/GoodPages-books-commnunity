import express from 'express';
import { createBookController, deleteBookController, getBooksHomepage, getBooksPagingController, searchBookController, updateBookController } from '../controllers/book.controller';
import { upload } from '../configs/multer.config';
import { isAdmin, isAuthor, validateToken } from '../middlewares/auth.middleware';
import { createBookMiddleware, deleteBookMiddleware, searchBookMiddleware, updateBookMiddleware } from '../middlewares/book.middleware';

const bookRoute = express.Router();

bookRoute.get("/homepage", getBooksHomepage);
bookRoute.get("/search", searchBookMiddleware, searchBookController);

//CRUD Book for admin
bookRoute.get("", getBooksPagingController);
bookRoute.post("", validateToken(), isAdmin, upload.single("picture"), createBookMiddleware, createBookController);
bookRoute.put("/:bookId", validateToken, isAdmin, upload.single("picture"), updateBookMiddleware, updateBookController);
bookRoute.delete("/:bookId", validateToken, isAdmin, deleteBookMiddleware, deleteBookController);


export default bookRoute;