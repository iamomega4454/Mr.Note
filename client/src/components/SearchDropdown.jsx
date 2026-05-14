import { FileText, FolderClosed, LoaderCircle } from "lucide-react";

export default function SearchDropdown({ results, loading, activeIndex, onPick }) {
  if (!loading && !results.length) {
    return null;
  }

  return (
    <div className="search-dropdown glass-card absolute top-[calc(100%+10px)] z-30 w-full overflow-hidden rounded-[24px]">
      {loading ? (
        <div className="flex items-center gap-3 px-4 py-4 text-sm text-white/60">
          <LoaderCircle size={16} className="animate-spin" />
          Searching vault...
        </div>
      ) : (
        <div className="divide-y divide-white/6">
          {results.map((item, index) => (
            <button
              key={`${item.type}-${item.id}`}
              type="button"
              onClick={() => onPick(item)}
              className={`dropdown-item flex w-full items-start gap-3 px-4 py-3 text-left ${activeIndex === index ? "is-active" : ""}`}
            >
              <div className="rounded-2xl bg-white/8 p-2 text-white/80">
                {item.type === "folder" ? <FolderClosed size={16} /> : <FileText size={16} />}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">{item.name}</p>
                <p className="truncate text-xs text-white/45">{item.path}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

