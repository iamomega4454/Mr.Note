import { Search, X } from "lucide-react";
import { useState } from "react";
import useSearch from "../hooks/useSearch";
import SearchDropdown from "./SearchDropdown";

export default function SearchBar({ onNavigate }) {
  const { query, setQuery, results, setResults, loading } = useSearch();
  const [activeIndex, setActiveIndex] = useState(-1);

  const handlePick = (item) => {
    onNavigate(item);
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setActiveIndex(-1);
  };

  return (
    <div className="search-shell relative">
      <label className="search-bar flex items-center gap-3 px-5 py-3.5">
        <Search size={18} className="text-text-secondary transition-colors group-focus-within:text-chalk-yellow" />
        
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setActiveIndex((value) => Math.min(value + 1, results.length - 1));
            }
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setActiveIndex((value) => Math.max(value - 1, 0));
            }
            if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              handlePick(results[activeIndex]);
            }
            if (event.key === "Escape") {
              handleClear();
            }
          }}
          placeholder="Search files and folders..."
          className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-secondary/60"
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1 text-text-secondary transition-all hover:bg-blackboard-card hover:text-text-primary"
            title="Clear search"
          >
            <X size={16} />
          </button>
        )}
      </label>

      <SearchDropdown results={results} loading={loading} activeIndex={activeIndex} onPick={handlePick} />
    </div>
  );
}