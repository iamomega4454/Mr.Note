import mongoose from "mongoose";
import Folder from "../models/Folder.js";
import File from "../models/File.js";

function ensureObjectId(value, label) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(`Invalid ${label}`);
    error.status = 400;
    throw error;
  }
}

export async function getFolderOrThrow(folderId) {
  ensureObjectId(folderId, "folder id");
  const folder = await Folder.findById(folderId).populate("path", "name");

  if (!folder) {
    const error = new Error("Folder not found");
    error.status = 404;
    throw error;
  }

  return folder;
}

export async function getFileOrThrow(fileId) {
  ensureObjectId(fileId, "file id");
  const file = await File.findById(fileId).populate("folder", "name parent path");

  if (!file) {
    const error = new Error("File not found");
    error.status = 404;
    throw error;
  }

  return file;
}
