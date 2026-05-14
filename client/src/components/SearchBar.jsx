import { Search } from "lucide-react";
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

  return (
    <div className="search-shell relative">
      <label className="search-bar flex items-center gap-3 px-4 py-3">
        <Search size={18} className="text-white/45" />
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
              setQuery("");
              setResults([]);
              setActiveIndex(-1);
            }
          }}
          placeholder="Search files and folders"
          className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
        />
      </label>

      <SearchDropdown results={results} loading={loading} activeIndex={activeIndex} onPick={handlePick} />
    </div>
  );
}

