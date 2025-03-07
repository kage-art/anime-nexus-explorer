
import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { animeData } from '@/lib/data';
import { Anime } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  onClose: () => void;
}

const SearchBar = ({ onClose }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const filteredResults = animeData.filter(anime =>
        anime.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        anime.genres.some(genre => genre.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(filteredResults.slice(0, 5));
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for anime, genres..."
            className="pl-10 pr-4 py-2 w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
        <Button 
          variant="ghost" 
          className="ml-2" 
          onClick={onClose}
          aria-label="Close search"
        >
          Cancel
        </Button>
      </div>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg overflow-hidden z-50 animate-in slide-in-from-left duration-300">
          <ul className="py-1">
            {searchResults.map((anime) => (
              <li key={anime.id}>
                <a
                  href="#"
                  className="flex items-center px-4 py-2 hover:bg-muted transition-colors duration-200"
                >
                  <div className="h-12 w-8 overflow-hidden rounded mr-3 flex-shrink-0">
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{anime.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {anime.genres.slice(0, 3).join(' • ')}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {searchTerm.length >= 2 && (
            <div className="px-4 py-2 border-t border-border">
              <a
                href="#"
                className="text-sm text-primary hover:underline"
              >
                View all results for "{searchTerm}"
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
