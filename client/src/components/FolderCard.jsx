import { Folder, Pencil, Trash2 } from "lucide-react";

export default function FolderCard({ folder, onOpen, onRename, onDelete }) {
  return (
    <article className="folder-card glass-card rounded-[24px] p-5">
      <button type="button" onClick={() => onOpen(folder._id)} className="w-full text-left">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-300/10 text-blue-100">
          <Folder size={28} />
        </div>
        <h3 className="font-heading text-lg text-white">{folder.name}</h3>
        <p className="mt-2 text-sm text-white/50">Updated {new Date(folder.updatedAt).toLocaleDateString()}</p>
      </button>

      <div className="mt-5 flex gap-2">
        <button type="button" onClick={() => onRename(folder)} className="liquid-button rounded-full px-3 py-2 text-white/75">
          <Pencil size={15} />
        </button>
        <button type="button" onClick={() => onDelete(folder._id)} className="liquid-button rounded-full px-3 py-2 text-white/75">
          <Trash2 size={15} />
        </button>
      </div>
    </article>
  );
}
