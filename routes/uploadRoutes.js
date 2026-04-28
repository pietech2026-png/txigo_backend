import express from 'express';
const router = express.Router();
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import { uploadDocument } from '../controllers/uploadController.js';

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "txigo_uploads",
        allowed_formats: ["jpg", "png", "jpeg", "webp", "pdf"],
    },
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

router.post('/', upload.single('file'), uploadDocument);

export default router;
