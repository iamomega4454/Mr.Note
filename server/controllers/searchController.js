import Folder from "../models/Folder.js";
import File from "../models/File.js";
import { folderPathLabel } from "./folderController.js";

function scoreName(name, query) {
  const value = name.toLowerCase();
  const term = query.toLowerCase();
  if (value === term) {
    return 3;
  }
  if (value.startsWith(term)) {
    return 2;
  }
  return 1;
}

export async function search(req, res, next) {
  try {
    const q = req.query.q?.trim();
    if (!q) {
      return res.json({ results: [] });
    }

    const matcher = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [folders, files] = await Promise.all([
      Folder.find({
        name: matcher,
      })
        .populate("path", "name")
        .limit(10),
      File.find({
        name: matcher,
      })
        .populate({
          path: "folder",
          select: "name path",
          populate: { path: "path", select: "name" },
        })
        .limit(10),
    ]);

    const folderResults = folders.map((folder) => ({
      id: folder._id,
      name: folder.name,
      type: "folder",
      path: `${folder.path.length ? `Root / ${folder.path.map((item) => item.name).join(" / ")}` : "Root"}`,
      parentId: folder.parent,
      score: scoreName(folder.name, q),
    }));

    const fileResults = await Promise.all(
      files.map(async (file) => ({
        id: file._id,
        name: file.name,
        type: "file",
        mimetype: file.mimetype,
        path: await folderPathLabel(file.folder?._id || null),
        folderId: file.folder?._id || null,
        score: scoreName(file.name, q),
      })),
    );

    const results = [...folderResults, ...fileResults]
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name))
      .slice(0, 10)
      .map(({ score, ...item }) => item);

    res.json({ results });
  } catch (error) {
    next(error);
  }
}
