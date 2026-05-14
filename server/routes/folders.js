import { Router } from "express";
import ownerPin from "../middleware/ownerPin.js";
import {
  createFolder,
  deleteFolder,
  getFolderContents,
  getRootFolders,
  getSidebarTree,
  moveFolder,
  renameFolder,
} from "../controllers/folderController.js";

const router = Router();

router.get("/", getRootFolders);
router.get("/tree", getSidebarTree);
router.get("/:id/contents", getFolderContents);
router.post("/", ownerPin, createFolder);
router.put("/:id/rename", ownerPin, renameFolder);
router.put("/:id/move", ownerPin, moveFolder);
router.delete("/:id", ownerPin, deleteFolder);

export default router;
