import Driver from "../models/Driver.js";

// @desc    Upload file (PDF/Image)
// @route   POST /api/upload
// @access  Public
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { driverId, type } = req.body;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!driverId || !type) {
      return res.status(400).json({
        message: "driverId and type are required",
      });
    }

    let driver;
    // Check if driverId is a valid ObjectId, otherwise treat it as a mobile number.
    if (driverId.length === 24) {
        driver = await Driver.findById(driverId).catch(() => null);
    } 
    if (!driver) {
        driver = await Driver.findOne({ mobile: driverId });
    }

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    const url = file.path;

    driver.documents = driver.documents || {};
    driver.documents[type] = {
      url,
      status: "pending",
      reason: "",
    };

    await driver.save();

    res.status(200).json({
      message: "Uploaded & saved successfully",
      url,
      driver,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message,
    });
  }
};
