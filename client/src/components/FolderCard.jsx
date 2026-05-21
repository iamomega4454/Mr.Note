import { Folder, Pencil, Trash2, ChevronRight } from "lucide-react";

export default function FolderCard({ folder, onOpen, onRename, onDelete }) {
  return (
    <article className="folder-card glass-card rounded-3xl p-6 shadow-soft group">
      {/* Main clickable area */}
      <button
        type="button"
        onClick={() => onOpen(folder._id)}
        className="w-full text-left"
      >
        {/* Icon container with gradient background */}
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-yellow/20 to-chalk-orange/20 shadow-glow transition-all group-hover:scale-110 group-hover:shadow-glow">
          <Folder size={32} className="text-chalk-yellow transition-transform group-hover:scale-110" />
        </div>

        {/* Folder name */}
        <h3 className="mb-2 font-heading text-xl font-semibold text-text-primary transition-colors group-hover:text-chalk-yellow">
          {folder.name}
        </h3>

        {/* Metadata */}
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <span>Updated {new Date(folder.updatedAt).toLocaleDateString()}</span>
          <ChevronRight size={14} className="opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
        </div>
      </button>

      {/* Action buttons */}
      <div className="mt-5 flex gap-2 border-t border-blackboard-border pt-4">
        <button
          type="button"
          onClick={() => onRename(folder)}
          className="liquid-button group/btn flex-1 rounded-xl px-3 py-2 text-text-secondary hover:text-chalk-blue transition-colors"
          title="Rename folder"
        >
          <Pencil size={16} className="mx-auto transition-transform group-hover/btn:scale-110" />
        </button>
        
        <button
          type="button"
          onClick={() => onDelete(folder._id)}
          className="liquid-button group/btn flex-1 rounded-xl px-3 py-2 text-text-secondary hover:text-chalk-pink transition-colors"
          title="Delete folder"
        >
          <Trash2 size={16} className="mx-auto transition-transform group-hover/btn:scale-110" />
        </button>
      </div>
    </article>
  );
}