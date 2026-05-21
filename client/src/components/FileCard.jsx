import { Download, FileText, Image, Music4, Pencil, Trash2, Video, FileCode, FileArchive } from "lucide-react";

function iconForType(mimetype = "") {
  if (mimetype.startsWith("image/")) return Image;
  if (mimetype.startsWith("audio/")) return Music4;
  if (mimetype.startsWith("video/")) return Video;
  if (mimetype.startsWith("application/zip") || mimetype.startsWith("application/x-")) return FileArchive;
  if (mimetype.includes("javascript") || mimetype.includes("json") || mimetype.includes("xml")) return FileCode;
  return FileText;
}

function formatBytes(size = 0) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileTypeColor(mimetype = "") {
  if (mimetype.startsWith("image/")) return "from-chalk-purple/20 to-chalk-pink/20";
  if (mimetype.startsWith("audio/")) return "from-chalk-green/20 to-chalk-blue/20";
  if (mimetype.startsWith("video/")) return "from-chalk-blue/20 to-chalk-purple/20";
  if (mimetype.includes("javascript") || mimetype.includes("json")) return "from-chalk-yellow/20 to-chalk-orange/20";
  return "from-chalk-blue/20 to-chalk-green/20";
}

function getFileTypeTextColor(mimetype = "") {
  if (mimetype.startsWith("image/")) return "text-chalk-purple";
  if (mimetype.startsWith("audio/")) return "text-chalk-green";
  if (mimetype.startsWith("video/")) return "text-chalk-blue";
  if (mimetype.includes("javascript") || mimetype.includes("json")) return "text-chalk-yellow";
  return "text-chalk-blue";
}

export default function FileCard({ file, onRename, onDelete, onDownload, isActive }) {
  const Icon = iconForType(file.mimetype);
  const gradientClass = getFileTypeColor(file.mimetype);
  const textColorClass = getFileTypeTextColor(file.mimetype);

  return (
    <article
      className={`file-card glass-card rounded-3xl p-6 shadow-soft group transition-all ${
        isActive ? "is-active ring-2 ring-chalk-yellow/40" : ""
      }`}
    >
      {/* Icon container with dynamic gradient */}
      <div className={`mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} shadow-glow-blue transition-all group-hover:scale-110`}>
        <Icon size={28} className={`${textColorClass} transition-transform group-hover:scale-110`} />
      </div>

      {/* File name */}
      <h3 className={`mb-3 min-h-[3.5rem] font-heading text-lg font-semibold leading-tight transition-colors ${
        isActive ? "text-chalk-yellow" : "text-text-primary group-hover:text-chalk-blue"
      }`}>
        {file.name}
      </h3>

      {/* File metadata */}
      <div className="flex items-center justify-between text-sm text-text-secondary">
        <span className="font-medium">{formatBytes(file.size)}</span>
        {isActive && (
          <span className="rounded-full bg-chalk-yellow/20 px-2 py-0.5 text-xs font-medium text-chalk-yellow">
            Active
          </span>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex gap-2 border-t border-blackboard-border pt-4">
        <button
          type="button"
          onClick={() => onDownload(file._id)}
          className="liquid-button group/btn flex-1 rounded-xl px-3 py-2 text-text-secondary hover:text-chalk-green transition-colors"
          title="Download file"
        >
          <Download size={16} className="mx-auto transition-transform group-hover/btn:scale-110 group-hover/btn:-translate-y-0.5" />
        </button>
        
        <button
          type="button"
          onClick={() => onRename(file)}
          className="liquid-button group/btn flex-1 rounded-xl px-3 py-2 text-text-secondary hover:text-chalk-blue transition-colors"
          title="Rename file"
        >
          <Pencil size={16} className="mx-auto transition-transform group-hover/btn:scale-110" />
        </button>
        
        <button
          type="button"
          onClick={() => onDelete(file._id)}
          className="liquid-button group/btn flex-1 rounded-xl px-3 py-2 text-text-secondary hover:text-chalk-pink transition-colors"
          title="Delete file"
        >
          <Trash2 size={16} className="mx-auto transition-transform group-hover/btn:scale-110" />
        </button>
      </div>
    </article>
  );
}