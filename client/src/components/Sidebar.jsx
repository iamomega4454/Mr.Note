import { ChevronRight, FolderTree, Home } from "lucide-react";

function buildTree(items, parent = null) {
  return items
    .filter((item) => String(item.parent || "") === String(parent || ""))
    .map((item) => ({
      ...item,
      children: buildTree(items, item._id),
    }));
}

function TreeNode({ node, depth, onSelect, activeId }) {
  const isActive = activeId === node._id;
  
  return (
    <div>
      <button
        type="button"
        onClick={() => onSelect(node._id)}
        className={`group flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm transition-all ${
          isActive
            ? "bg-chalk-yellow/10 text-chalk-yellow shadow-glow border border-chalk-yellow/20"
            : "text-text-secondary hover:bg-blackboard-card hover:text-text-primary border border-transparent"
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <ChevronRight
          size={14}
          className={`transition-transform ${isActive ? "rotate-90 text-chalk-yellow" : "text-text-secondary/50 group-hover:text-text-secondary"}`}
        />
        <span className="truncate font-medium">{node.name}</span>
      </button>
      {node.children.map((child) => (
        <TreeNode key={child._id} node={child} depth={depth + 1} onSelect={onSelect} activeId={activeId} />
      ))}
    </div>
  );
}

export default function Sidebar({ folders, currentFolderId, onSelectRoot, onSelectFolder }) {
  const tree = buildTree(folders);
  const isRootActive = !currentFolderId;

  return (
    <aside className="glass-card glass-panel h-fit rounded-3xl p-5 shadow-soft animate-slide-up">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 pb-5 border-b border-blackboard-border">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-purple/20 to-chalk-pink/20 shadow-glow-purple">
          <FolderTree size={20} className="text-chalk-purple" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-text-primary">Folders</h2>
          <p className="text-xs text-text-secondary">Navigate your vault</p>
        </div>
      </div>

      {/* Root folder button */}
      <button
        type="button"
        onClick={onSelectRoot}
        className={`group mb-3 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm transition-all ${
          isRootActive
            ? "bg-chalk-green/10 text-chalk-green shadow-glow-green border border-chalk-green/20"
            : "text-text-secondary hover:bg-blackboard-card hover:text-text-primary border border-transparent"
        }`}
      >
        <Home
          size={16}
          className={`transition-colors ${isRootActive ? "text-chalk-green" : "text-text-secondary/50 group-hover:text-text-secondary"}`}
        />
        <span className="font-medium">Root</span>
      </button>

      {/* Folder tree */}
      <div className="max-h-[60vh] space-y-1 overflow-auto pr-1 scrollbar-thin">
        {tree.length > 0 ? (
          tree.map((node) => (
            <TreeNode key={node._id} node={node} depth={0} onSelect={onSelectFolder} activeId={currentFolderId} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-blackboard-border bg-blackboard-secondary/50 px-4 py-8 text-center">
            <p className="text-sm text-text-secondary">No folders yet</p>
            <p className="mt-1 text-xs text-text-secondary/60">Create your first folder to get started</p>
          </div>
        )}
      </div>
    </aside>
  );
}