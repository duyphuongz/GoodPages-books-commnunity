import express from 'express';
import { createBookController, getBooksHomepage, getBooksPagingController } from '../controllers/book.controller';
import { upload } from '../configs/multer.config';
import passport from 'passport';

const bookRoute = express.Router();

bookRoute.get("/homepage", getBooksHomepage);
bookRoute.get("", getBooksPagingController);
bookRoute.post("", passport.authenticate("jwt", { session: false }), upload.single("picture"), createBookController);

export default bookRoute;