
import React from 'react';
import { Anime, WatchlistItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface WatchlistGridProps {
  watchlist: WatchlistItem[];
  animeList: Anime[];
}

const WatchlistGrid: React.FC<WatchlistGridProps> = ({ watchlist, animeList }) => {
  // Get the anime details for each watchlist item
  const watchlistAnime = watchlist
    .map(item => {
      const anime = animeList.find(anime => anime.id === item.animeId);
      return anime ? { ...anime, addedAt: item.addedAt } : null;
    })
    .filter((item): item is Anime & { addedAt: Date } => item !== null);

  if (watchlistAnime.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">Your watchlist is empty</h3>
          <p className="text-muted-foreground mb-6">Start adding anime to your watchlist to keep track of what you want to watch.</p>
          <Link to="/">
            <Button>Browse Anime</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {watchlistAnime.map((anime) => (
        <Card key={anime.id} className="overflow-hidden card-hover">
          <div className="relative">
            <Link to={`/anime/${anime.id}`}>
              <img 
                src={anime.image} 
                alt={anime.title} 
                className="w-full h-48 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 flex items-center p-2 bg-black/60">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <span className="text-white text-sm ml-1">{anime.rating.toFixed(1)}</span>
              </div>
            </Link>
            <Button 
              variant="destructive" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6"
              // In a real app, this would remove the item from watchlist
              onClick={() => {}}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <CardContent className="p-3">
            <Link to={`/anime/${anime.id}`}>
              <h3 className="font-medium line-clamp-1">{anime.title}</h3>
            </Link>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-muted-foreground">{anime.episodes} Episodes</p>
              <p className="text-xs text-muted-foreground">
                Added {formatDate(anime.addedAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Helper function to format date
function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const day = 24 * 60 * 60 * 1000;
  
  if (diff < day) {
    return 'Today';
  } else if (diff < 2 * day) {
    return 'Yesterday';
  } else {
    return new Date(date).toLocaleDateString();
  }
}

export default WatchlistGrid;
