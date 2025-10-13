import { Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    "Genesis 1",
    "John 3:16",
    "Psalm 23",
    "Lord's Prayer",
    "Love your neighbor",
    "Proverbs 3:5-6"
  ];

  const filteredSuggestions = suggestions.filter(s => 
    s.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search passages... (e.g., John 3:16, Psalm 23)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="pl-12 pr-4 py-6 text-base rounded-2xl shadow-card 
                     focus-visible:ring-accent focus-visible:shadow-card-hover
                     transition-all duration-300"
        />
      </div>
      
      {showSuggestions && searchQuery && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-card rounded-xl shadow-card-hover 
                        overflow-hidden animate-fade-in">
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full px-4 py-3 text-left hover:bg-secondary 
                         transition-colors duration-200 text-foreground"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
