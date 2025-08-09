import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { searchTracks } from "../lib/itunes";

interface SearchBarProps {
  onResults: (tracks: any[]) => void;
  onLoading: (loading: boolean) => void;
  onError: (error: string | null) => void;
}

const SearchBar = ({ onResults, onLoading, onError }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController>();

  // Improved debounce with cleanup
  const debouncedSetQuery = useCallback((value: string) => {
    // Clear previous timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const trimmedValue = value.trim();

    // If query is too short, clear results immediately
    if (trimmedValue.length < 2) {
      setDebouncedQuery("");
      return;
    }

    // Set new timeout for debouncing
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(trimmedValue);
    }, 500); // Increased to 500ms for better UX
  }, []);

  // Handle query changes with debouncing
  useEffect(() => {
    debouncedSetQuery(query);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [query, debouncedSetQuery]);

  // Enhanced query with proper abort signal
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async ({ signal }) => {
      abortControllerRef.current = new AbortController();

      try {
        const results = await searchTracks(debouncedQuery);
        return results;
      } catch (err) {
        if (signal?.aborted) {
          throw new Error("Search cancelled");
        }
        throw err;
      }
    },
    enabled: debouncedQuery.length >= 2, // Only search if 2+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry if it's an abort error
      if (error.message === "Search cancelled") return false;
      return failureCount < 2;
    },
    retryDelay: 1000,
  });

  useEffect(() => {
    onResults(data || []);
  }, [data, onResults]);

  useEffect(() => {
    onLoading(isLoading || isFetching);
  }, [isLoading, isFetching, onLoading]);

  useEffect(() => {
    if (error && error.message !== "Search cancelled") {
      onError("ไม่สามารถค้นหาได้ในขณะนี้ กรุณาลองใหม่อีกครั้ง");
    } else if (!error) {
      onError(null);
    }
  }, [error, onError]);

  const handleClearSearch = () => {
    setQuery("");
    setDebouncedQuery("");
    onResults([]);
    onError(null);

    // Cancel any ongoing requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const getPlaceholderText = () => {
    if (isFocused) {
      return "พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อเริ่มค้นหา...";
    }
    return 'ค้นหาเพลงหรือศิลปิน (เช่น "Taylor Swift" หรือ "Shape of You")';
  };

  return (
    <div className="relative mb-6">
      <div className="relative">
        {/* Search Icon */}
        <Search
          className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
            isFocused
              ? "text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text"
              : "text-slate-400"
          }`}
          data-testid="search-icon"
        />

        {/* Search Input */}
        <input
          id="search-input"
          data-testid="search-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={getPlaceholderText()}
          className={`w-full pl-12 pr-16 py-4 bg-slate-800 border-2 rounded-xl 
                     text-white placeholder-slate-400 shadow-xl
                     focus:outline-none transition-all duration-300 backdrop-blur-sm
                     ${
                       isFocused
                         ? "transform scale-[1.02] shadow-2xl border-transparent bg-gradient-to-r from-slate-800/90 via-slate-700/90 to-slate-800/90 focus:ring-2 focus:ring-purple-500/50"
                         : "border-slate-600 hover:border-slate-500"
                     } ${
            error && error.message !== "Search cancelled"
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/50"
              : ""
          }`}
          style={
            isFocused
              ? {
                  boxShadow:
                    "0 0 0 1px rgba(168, 85, 247, 0.5), 0 0 20px rgba(168, 85, 247, 0.2)",
                }
              : {}
          }
          aria-label="ค้นหาเพลงหรือศิลปิน"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={handleClearSearch}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 
                     text-slate-400 hover:text-white transition-all duration-200
                     focus:outline-none focus:text-purple-400 p-1 rounded-full
                     hover:bg-slate-700/50"
            aria-label="ล้างการค้นหา"
            data-testid="clear-search"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Loading indicator */}
        {(isLoading || isFetching) && (
          <div className="absolute right-12 top-1/2 transform -translate-y-1/2 z-10">
            <div className="w-5 h-5 border-2 border-slate-600 border-t-purple-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {/* Search hints */}
      {query.length > 0 && query.length < 2 && (
        <div className="mt-3 text-sm text-slate-400 flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 backdrop-blur-sm">
          <span className="text-purple-400">💡</span>
          พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อเริ่มค้นหา
        </div>
      )}

      {/* Search status */}
      {debouncedQuery && data && (
        <div className="mt-3 text-sm text-slate-300 flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-purple-500/20">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
          พบ <span className="font-semibold text-white">{data.length}</span>{" "}
          เพลงสำหรับ
          <span className="font-semibold text-transparent bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text">
            "{debouncedQuery}"
          </span>
        </div>
      )}

      {/* No results message */}
      {debouncedQuery &&
        data &&
        data.length === 0 &&
        !isLoading &&
        !isFetching && (
          <div className="mt-3 text-sm text-slate-400 flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 backdrop-blur-sm border border-slate-700">
            <span className="text-slate-500">🔍</span>
            ไม่พบเพลงที่ตรงกับ
            <span className="font-semibold text-slate-300">
              "{debouncedQuery}"
            </span>
            <span className="text-slate-500">ลองใช้คำค้นหาอื่น</span>
          </div>
        )}

      {/* Error message */}
      {error && error.message !== "Search cancelled" && (
        <div className="mt-3 text-sm text-red-400 flex items-center gap-2 bg-red-500/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-red-500/20">
          <span className="text-red-500">⚠️</span>
          {error.message}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
