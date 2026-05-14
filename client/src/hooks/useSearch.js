import { useEffect, useState } from "react";
import api from "../utils/api";

export default function useSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data.results || []);
      } catch (_error) {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return { query, setQuery, results, setResults, loading };
}

