// @desc    Upload file (PDF/Image)
// @route   POST /api/upload
// @access  Public (Can be restricted later)
const uploadFile = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    // Construct the public URL
    const protocol = req.protocol;
    const host = req.get('host');
    const fileUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

    res.status(200).json({
        message: 'File uploaded successfully',
        url: fileUrl,
        filename: req.file.filename,
        mimetype: req.file.mimetype,
        size: req.file.size
    });
};

module.exports = {
    uploadFile
};
