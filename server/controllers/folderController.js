import mongoose from "mongoose";
import Folder from "../models/Folder.js";
import File from "../models/File.js";
import { getFolderOrThrow } from "../utils/access.js";

function buildPathNames(pathDocs) {
  return ["Root", ...pathDocs.map((item) => item.name)].join(" / ");
}

function normalizeName(name) {
  return name?.trim();
}

function ensureName(name, label) {
  if (!name) {
    const error = new Error(`${label} name is required`);
    error.status = 400;
    throw error;
  }
}

async function rebuildDescendantPaths(folder) {
  const children = await Folder.find({ parent: folder._id });
  const currentPath = [...folder.path, folder._id];

  await Promise.all(
    children.map(async (child) => {
      child.path = currentPath;
      await child.save();
      await rebuildDescendantPaths(child);
    }),
  );
}

async function deleteFolderRecursive(folderId) {
  const childFolders = await Folder.find({ parent: folderId }).select("_id");
  await Promise.all(childFolders.map((folder) => deleteFolderRecursive(folder._id)));
  await File.deleteMany({ folder: folderId });
  await Folder.deleteOne({ _id: folderId });
}

export async function getRootFolders(req, res, next) {
  try {
    const folders = await Folder.find({ parent: null }).sort({ updatedAt: -1 });

    const files = await File.find({ folder: null }).sort({ createdAt: -1 });

    res.json({
      currentFolder: null,
      breadcrumb: [{ id: null, name: "Root" }],
      folders,
      files,
    });
  } catch (error) {
    next(error);
  }
}

export async function getFolderContents(req, res, next) {
  try {
    const folder = await getFolderOrThrow(req.params.id);

    const [folders, files] = await Promise.all([
      Folder.find({ parent: folder._id }).sort({ updatedAt: -1 }),
      File.find({ folder: folder._id }).sort({ createdAt: -1 }),
    ]);

    res.json({
      currentFolder: folder,
      breadcrumb: [
        { id: null, name: "Root" },
        ...folder.path.map((item) => ({ id: item._id, name: item.name })),
        { id: folder._id, name: folder.name },
      ],
      folders,
      files,
    });
  } catch (error) {
    next(error);
  }
}

export async function createFolder(req, res, next) {
  try {
    const name = normalizeName(req.body.name);
    const { parentId = null } = req.body;
    ensureName(name, "Folder");

    let parent = null;
    let path = [];

    if (parentId) {
      parent = await getFolderOrThrow(parentId);
      path = [...parent.path.map((item) => item._id), parent._id];
    }

    const folder = await Folder.create({
      name,
      parent: parent?._id || null,
      path,
    });

    res.status(201).json(folder);
  } catch (error) {
    next(error);
  }
}

export async function renameFolder(req, res, next) {
  try {
    const name = normalizeName(req.body.name);
    ensureName(name, "Folder");
    const folder = await getFolderOrThrow(req.params.id);

    folder.name = name;
    folder.updatedAt = new Date();
    await folder.save();

    res.json(folder);
  } catch (error) {
    next(error);
  }
}

export async function deleteFolder(req, res, next) {
  try {
    const folder = await getFolderOrThrow(req.params.id);

    await deleteFolderRecursive(folder._id);
    res.json({ message: "Folder deleted" });
  } catch (error) {
    next(error);
  }
}

export async function getSidebarTree(req, res, next) {
  try {
    const folders = await Folder.find()
      .sort({ name: 1 })
      .select("_id name parent");

    res.json({ folders });
  } catch (error) {
    next(error);
  }
}

export async function moveFolder(req, res, next) {
  try {
    const { parentId = null } = req.body;
    const folder = await getFolderOrThrow(req.params.id);

    let path = [];
    let parent = null;

    if (parentId) {
      if (!mongoose.Types.ObjectId.isValid(parentId)) {
        return res.status(400).json({ message: "Invalid parent folder id" });
      }

      parent = await getFolderOrThrow(parentId);
      if (String(parent._id) === String(folder._id)) {
        return res.status(400).json({ message: "A folder cannot be moved into itself" });
      }
      if (parent.path.some((item) => String(item._id) === String(folder._id))) {
        return res.status(400).json({ message: "A folder cannot be moved into its own subfolder" });
      }
      path = [...parent.path.map((item) => item._id), parent._id];
    }

    folder.parent = parent?._id || null;
    folder.path = path;
    await folder.save();
    await rebuildDescendantPaths(folder);

    res.json(folder);
  } catch (error) {
    next(error);
  }
}

export async function folderPathLabel(folderId) {
  if (!folderId) {
    return "Root";
  }

  const folder = await Folder.findById(folderId).populate("path", "name");
  if (!folder) {
    return "Root";
  }

  return `${buildPathNames(folder.path)} / ${folder.name}`;
}
