import { Search, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { bibleService } from "@/services/bibleService";

interface SearchResult {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

const SearchBar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Check if query looks like a reference (e.g., "John 3:16" or "Genesis 1:1-5")
  const isReferenceQuery = (query: string): boolean => {
    // Matches patterns like: "John 3:16", "Genesis 1:1-5", "1 John 2:1"
    const referencePattern = /^(\d?\s?[a-z]+)\s+\d+:\d+(-\d+)?$/i;
    return referencePattern.test(query.trim());
  };

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        // If it looks like a reference, try to load it directly
        if (isReferenceQuery(searchQuery)) {
          // Navigate directly to the passage
          navigate(`/passage?ref=${encodeURIComponent(searchQuery.trim())}`);
          setSearchQuery("");
          setShowResults(false);
          setIsSearching(false);
          return;
        }

        // Otherwise, do text search
        const searchResults = await bibleService.searchPassages(searchQuery, 10);
        setResults(searchResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300); // Wait 300ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleResultClick = (result: SearchResult) => {
    // Expand to show 5 verses: 2 before + the verse + 2 after
    const contextStart = Math.max(1, result.verse - 2);
    const contextEnd = result.verse + 2;
    
    // Create reference with context (e.g., "Genesis 22:1-5" instead of just "Genesis 22:2")
    const expandedReference = `${result.book} ${result.chapter}:${contextStart}-${contextEnd}`;
    
    navigate(`/passage?ref=${encodeURIComponent(expandedReference)}`);
    setSearchQuery("");
    setShowResults(false);
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="bg-accent/30 font-semibold">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        {isSearching && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-accent animate-spin" />
        )}
        <Input
          type="text"
          placeholder="Search the Bible... (try 'love' or 'John 3:16')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
          className="pl-12 pr-12 py-6 text-base rounded-2xl shadow-card 
                     focus-visible:ring-accent focus-visible:shadow-card-hover
                     transition-all duration-300"
        />
      </div>
      
      {showResults && searchQuery && !isReferenceQuery(searchQuery) && (
        <div className="absolute z-10 w-full mt-2 bg-card rounded-xl shadow-card-hover 
                        overflow-hidden animate-fade-in max-h-[400px] overflow-y-auto">
          {isSearching ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p>Searching the Bible...</p>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-muted-foreground">
              <p>No passages found for "{searchQuery}"</p>
              <p className="text-sm mt-1">Try a different word or phrase</p>
              <p className="text-sm mt-2 text-accent">💡 Tip: You can also search by reference (e.g., "John 3:16")</p>
            </div>
          ) : (
            <>
              <div className="px-4 py-2 bg-secondary/50 text-xs font-semibold text-muted-foreground">
                {results.length} result{results.length === 1 ? '' : 's'} found • Click to view with context
              </div>
              {results.map((result, index) => (
                <button
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 text-left hover:bg-secondary 
                             transition-colors duration-200 border-b border-border/50 
                             last:border-b-0 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-accent mb-1 group-hover:underline">
                        {result.reference}
                      </div>
                      <div className="text-sm text-foreground/80 line-clamp-2">
                        {highlightText(result.text, searchQuery)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        View with surrounding verses for context
                      </div>
                    </div>
                    <Search className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
