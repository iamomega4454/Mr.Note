import { Plus, Upload } from "lucide-react";
import SearchBar from "./SearchBar";

export default function Navbar({ onCreateFolder, onUpload, onSearchNavigate }) {
  return (
    <header className="glass-card glass-panel sticky top-4 z-20 rounded-[28px] px-5 py-4">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-white/35">Mr.Note</p>
          <h1 className="font-heading text-3xl text-white">Notes</h1>
        </div>

        <div className="flex flex-col gap-3 xl:items-end">
          <SearchBar onNavigate={onSearchNavigate} />
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={onCreateFolder} className="liquid-button rounded-full px-4 py-2 text-sm text-white">
              <span className="inline-flex items-center gap-2"><Plus size={16} /> Add folder</span>
            </button>
            <button type="button" onClick={onUpload} className="liquid-button rounded-full px-4 py-2 text-sm text-white">
              <span className="inline-flex items-center gap-2"><Upload size={16} /> Add file</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
