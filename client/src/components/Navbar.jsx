import { Plus, Upload } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar({ onCreateFolder, onUpload, onSearchNavigate }) {
  return (
    <header className="glass-card glass-panel sticky top-4 z-20 rounded-3xl px-6 py-5 shadow-soft-lg animate-slide-down">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        {/* Brand Section */}
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-chalk-yellow/20 to-chalk-orange/20 shadow-glow">
            <span className="text-2xl">📝</span>
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
              Mr.Note
            </p>
            <h1 className="font-heading text-3xl font-bold text-text-primary">
              Notes
            </h1>
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col gap-4 xl:items-end">
          <SearchBar onNavigate={onSearchNavigate} />
          
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onCreateFolder}
              className="liquid-button group rounded-full px-5 py-2.5 text-sm font-medium text-text-primary hover:text-chalk-yellow"
            >
              <span className="inline-flex items-center gap-2">
                <Plus size={18} className="transition-transform group-hover:rotate-90" />
                Add folder
              </span>
            </button>
            
            <button
              type="button"
              onClick={onUpload}
              className="liquid-button group rounded-full px-5 py-2.5 text-sm font-medium text-text-primary hover:text-chalk-blue"
            >
              <span className="inline-flex items-center gap-2">
                <Upload size={18} className="transition-transform group-hover:-translate-y-0.5" />
                Add file
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}