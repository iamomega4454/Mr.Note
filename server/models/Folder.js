import mongoose from "mongoose";

const FolderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
    path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  },
  { timestamps: true },
);

FolderSchema.index({ name: "text" });

export default mongoose.model("Folder", FolderSchema);
