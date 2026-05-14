import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    folder: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

FileSchema.index({ name: "text" });

export default mongoose.model("File", FileSchema);
