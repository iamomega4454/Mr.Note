import path from "node:path";
import multer from "multer";

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "text/markdown",
  "application/zip",
  "application/x-rar-compressed",
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/webm",
];

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads/"),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error(`File type not supported: ${path.extname(file.originalname) || file.mimetype}`), false);
};

export default multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 },
});

