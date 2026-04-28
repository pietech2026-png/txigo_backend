// @desc    Upload file (PDF/Image)
// @route   POST /api/upload
// @access  Public
export const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    res.status(200).json({
        message: 'File uploaded successfully',
        url: req.file.path, // Automatically contains Cloudinary direct URL
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
};
