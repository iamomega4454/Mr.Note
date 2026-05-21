import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumb({ items, onNavigate }) {
  return (
    <nav className="glass-card glass-panel flex flex-wrap items-center gap-2 rounded-2xl px-5 py-3.5 text-sm shadow-soft animate-fade-in">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isRoot = index === 0;
        
        return (
          <div key={`${item.id ?? "root"}-${index}`} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`group flex items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                isLast
                  ? "bg-chalk-yellow/10 text-chalk-yellow font-medium"
                  : "text-text-secondary hover:bg-blackboard-card hover:text-text-primary"
              }`}
            >
              {isRoot && <Home size={14} className="transition-transform group-hover:scale-110" />}
              <span className="transition-colors">{item.name}</span>
            </button>
            
            {!isLast && (
              <ChevronRight size={14} className="text-text-secondary/40" />
            )}
          </div>
        );
      })}
    </nav>
  );
}