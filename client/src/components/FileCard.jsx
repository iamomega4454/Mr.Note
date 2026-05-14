import { Download, FileText, Image, Music4, Pencil, Trash2, Video } from "lucide-react";

function iconForType(mimetype = "") {
  if (mimetype.startsWith("image/")) return Image;
  if (mimetype.startsWith("audio/")) return Music4;
  if (mimetype.startsWith("video/")) return Video;
  return FileText;
}

function formatBytes(size = 0) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FileCard({ file, onRename, onDelete, onDownload, isActive }) {
  const Icon = iconForType(file.mimetype);

  return (
    <article className={`file-card glass-card rounded-[24px] p-5 ${isActive ? "border-blue-300/40 bg-blue-300/10" : ""}`}>
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/8 text-white">
        <Icon size={24} />
      </div>
      <h3 className="min-h-14 font-heading text-lg text-white">{file.name}</h3>
      <p className="mt-2 text-sm text-white/50">{formatBytes(file.size)}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" onClick={() => onDownload(file._id)} className="liquid-button rounded-full px-3 py-2 text-white/75">
          <Download size={15} />
        </button>
        <button type="button" onClick={() => onRename(file)} className="liquid-button rounded-full px-3 py-2 text-white/75">
          <Pencil size={15} />
        </button>
        <button type="button" onClick={() => onDelete(file._id)} className="liquid-button rounded-full px-3 py-2 text-white/75">
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
