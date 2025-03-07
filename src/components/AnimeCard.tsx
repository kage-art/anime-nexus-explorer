
import React from 'react';
import { Anime } from '@/lib/types';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  anime: Anime;
  variant?: 'default' | 'trending' | 'small';
}

const AnimeCard = ({ anime, variant = 'default' }: AnimeCardProps) => {
  if (variant === 'small') {
    return (
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative rounded-lg overflow-hidden card-hover">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="w-full h-auto aspect-[3/4] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-2">
            <h3 className="text-white text-sm font-medium line-clamp-1">{anime.title}</h3>
            <div className="flex items-center mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs ml-1">{anime.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'trending') {
    return (
      <Link to={`/anime/${anime.id}`} className="block">
        <div className="relative rounded-lg overflow-hidden card-hover">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="w-full h-auto aspect-video object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h2 className="text-white text-lg md:text-xl font-bold mb-1">{anime.title}</h2>
            <div className="flex items-center mb-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm ml-1">{anime.rating.toFixed(1)}</span>
              <span className="text-white text-sm ml-2">{anime.episodes} Episodes</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {anime.genres.slice(0, 3).map((genre, index) => (
                <span key={index} className="text-xs px-2 py-0.5 bg-white/20 rounded-full text-white">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default variant
  return (
    <Link to={`/anime/${anime.id}`} className="block">
      <div className="rounded-lg overflow-hidden card-hover">
        <div className="relative">
          <img 
            src={anime.image} 
            alt={anime.title} 
            className="w-full h-auto aspect-[3/4] object-cover"
          />
          {anime.trending && (
            <span className="absolute top-2 left-2 text-xs px-2 py-0.5 bg-primary rounded-full text-white">
              Trending
            </span>
          )}
          <div className="absolute bottom-0 left-0 right-0 flex items-center p-2 bg-black/60">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-sm ml-1">{anime.rating.toFixed(1)}</span>
          </div>
        </div>
        <div className="p-2">
          <h3 className="font-medium line-clamp-2">{anime.title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{anime.episodes} Episodes</p>
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
