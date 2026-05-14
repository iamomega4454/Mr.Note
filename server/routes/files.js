import { Router } from "express";
import ownerPin from "../middleware/ownerPin.js";
import upload from "../middleware/upload.js";
import {
  deleteFile,
  downloadFile,
  getFile,
  listRecentFiles,
  renameFile,
  uploadFile,
} from "../controllers/fileController.js";

const router = Router();

router.get("/recent", listRecentFiles);
router.post("/upload", ownerPin, upload.single("file"), uploadFile);
router.get("/:id", getFile);
router.get("/:id/download", downloadFile);
router.put("/:id/rename", ownerPin, renameFile);
router.delete("/:id", ownerPin, deleteFile);

export default router;
