import multer from "multer";
import ApiError from "../utils/ApiError.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new ApiError(400, "Only PDF files are allowed for resume upload."));
    }
    cb(null, true);
  },
});

export default upload;
