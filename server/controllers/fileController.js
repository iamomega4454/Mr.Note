import path from "node:path";
import fs from "node:fs/promises";
import File from "../models/File.js";
import { getFileOrThrow, getFolderOrThrow } from "../utils/access.js";

export async function uploadFile(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "File is required" });
    }

    const folderId = req.body.folderId || null;

    if (folderId) {
      await getFolderOrThrow(folderId);
    }

    const file = await File.create({
      name: req.body.name?.trim() || req.file.originalname,
      originalName: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      url: `/uploads/${req.file.filename}`,
      folder: folderId,
    });

    res.status(201).json(file);
  } catch (error) {
    next(error);
  }
}

export async function getFile(req, res, next) {
  try {
    const file = await getFileOrThrow(req.params.id);
    res.json(file);
  } catch (error) {
    next(error);
  }
}

export async function downloadFile(req, res, next) {
  try {
    const file = await getFileOrThrow(req.params.id);
    const absolutePath = path.resolve(file.url.replace(/^\//, ""));
    res.download(absolutePath, file.originalName);
  } catch (error) {
    next(error);
  }
}

export async function renameFile(req, res, next) {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    file.name = req.body.name?.trim() || file.name;
    await file.save();

    res.json(file);
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(req, res, next) {
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const absolutePath = path.resolve(file.url.replace(/^\//, ""));
    await fs.unlink(absolutePath).catch(() => null);
    await File.deleteOne({ _id: file._id });

    res.json({ message: "File deleted" });
  } catch (error) {
    next(error);
  }
}

export async function listRecentFiles(req, res, next) {
  try {
    const files = await File.find()
      .sort({ createdAt: -1 })
      .limit(8);

    res.json({ files });
  } catch (error) {
    next(error);
  }
}
