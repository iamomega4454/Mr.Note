import { ChevronRight, FolderTree } from "lucide-react";

function buildTree(items, parent = null) {
  return items
    .filter((item) => String(item.parent || "") === String(parent || ""))
    .map((item) => ({
      ...item,
      children: buildTree(items, item._id),
    }));
}

function TreeNode({ node, depth, onSelect, activeId }) {
  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node._id)}
        className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left transition ${
          activeId === node._id ? "bg-blue-300/12 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
        }`}
        style={{ paddingLeft: `${depth * 14 + 12}px` }}
      >
        <ChevronRight size={15} className="text-white/35" />
        <span className="truncate">{node.name}</span>
      </button>
      {node.children.map((child) => (
        <TreeNode key={child._id} node={child} depth={depth + 1} onSelect={onSelect} activeId={activeId} />
      ))}
    </div>
  );
}

export default function Sidebar({ folders, currentFolderId, onSelectRoot, onSelectFolder }) {
  const tree = buildTree(folders);

  return (
    <aside className="glass-card glass-panel h-fit rounded-[28px] p-4">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-2xl bg-blue-300/10 p-3 text-blue-100">
          <FolderTree size={18} />
        </div>
        <div>
          <h2 className="font-heading text-lg text-white">Folders</h2>
          <p className="text-sm text-white/45">Folder list</p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSelectRoot}
        className={`mb-2 w-full rounded-2xl px-3 py-2 text-left transition ${
          !currentFolderId ? "bg-blue-300/12 text-white" : "text-white/65 hover:bg-white/5 hover:text-white"
        }`}
      >
        Root
      </button>

      <div className="max-h-[60vh] space-y-1 overflow-auto pr-1">
        {tree.map((node) => (
          <TreeNode key={node._id} node={node} depth={0} onSelect={onSelectFolder} activeId={currentFolderId} />
        ))}
      </div>
    </aside>
  );
}
