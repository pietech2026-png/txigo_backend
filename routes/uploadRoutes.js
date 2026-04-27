import express from 'express';
const router = express.Router();
import multer from 'multer';
import path from 'path';
import { uploadFile } from '../controllers/uploadController.js';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExts = /jpeg|jpg|png|pdf|webp|heic|heif/;
    const allowedMime = /image\/jpeg|image\/jpg|image\/png|application\/pdf|image\/webp|image\/heic|image\/heif/;
    
    const extname = allowedExts.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMime.test(file.mimetype);

    if (extname || mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only images (jpg, jpeg, png, webp) and PDFs are allowed!'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
});

router.post('/', upload.single('file'), uploadFile);

export default router;
