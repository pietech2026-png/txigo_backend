import Driver from "../models/Driver.js";

// @desc    Upload file (PDF/Image)
// @route   POST /api/upload
// @access  Public
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const driverId = req.body.driverId || req.body.mobile || req.body.id;
    const type = req.body.type || req.body.documentType || req.body.docType;
    
    console.log("=== INCOMING UPLOAD REQUEST ===");
    console.log("file:", !!file);
    console.log("body:", req.body);
    console.log("driverId detected:", driverId);
    console.log("type detected:", type);

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = file.path;

    // If driverId and type are provided, attempt to update the driver DB directly
    let driver = null;
    if (driverId && type) {
        if (driverId.length === 24) {
            driver = await Driver.findById(driverId).catch(() => null);
        } 
        if (!driver) {
            driver = await Driver.findOne({ mobile: driverId }).catch(() => null);
        }

        if (driver) {
            driver.documents = driver.documents || {};
            driver.documents[type] = {
                url,
                status: "pending",
                reason: "",
            };
            await driver.save();
        }
    }

    // Always respond with the Cloudinary URL so the frontend can securely handle it!
    res.status(200).json({
      message: "File uploaded successfully",
      url,
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      driver: driver || undefined
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
