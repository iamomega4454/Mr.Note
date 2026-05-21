import { FileText, FolderClosed, LoaderCircle } from "lucide-react";

export default function SearchDropdown({ results, loading, activeIndex, onPick }) {
  if (!loading && !results.length) {
    return null;
  }

  return (
    <div className="search-dropdown glass-card absolute top-[calc(100%+12px)] z-30 w-full overflow-hidden rounded-3xl">
      {loading ? (
        <div className="flex items-center gap-3 px-5 py-4 text-sm text-text-secondary">
          <LoaderCircle size={18} className="animate-spin text-chalk-blue" />
          <span>Searching vault...</span>
        </div>
      ) : (
        <div className="divide-y divide-blackboard-border">
          {results.map((item, index) => {
            const isFolder = item.type === "folder";
            const Icon = isFolder ? FolderClosed : FileText;
            const iconColor = isFolder ? "text-chalk-yellow" : "text-chalk-blue";
            const bgColor = isFolder ? "from-chalk-yellow/20 to-chalk-orange/20" : "from-chalk-blue/20 to-chalk-green/20";
            
            return (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                onClick={() => onPick(item)}
                className={`dropdown-item flex w-full items-start gap-3 px-5 py-3.5 text-left transition-all ${
                  activeIndex === index ? "is-active" : ""
                }`}
              >
                <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${bgColor} shadow-sm`}>
                  <Icon size={18} className={iconColor} />
                </div>
                
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {item.name}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-text-secondary">
                    {item.path}
                  </p>
                </div>

                {activeIndex === index && (
                  <div className="flex-shrink-0 rounded-full bg-chalk-yellow/20 px-2 py-0.5 text-xs font-medium text-chalk-yellow">
                    Enter
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}