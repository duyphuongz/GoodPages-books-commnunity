import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

// 👉 Tạo folder nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({
    storage,
    fileFilter: (_req, _file, cb) => {
        _file.mimetype = 
    },
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});
