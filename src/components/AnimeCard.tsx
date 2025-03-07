
import { Anime } from '@/lib/types';
import { Play, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AnimeCardProps {
  anime: Anime;
  variant?: 'default' | 'trending' | 'small';
  className?: string;
}

const AnimeCard = ({ 
  anime, 
  variant = 'default',
  className 
}: AnimeCardProps) => {
  const isDefault = variant === 'default';
  const isTrending = variant === 'trending';
  const isSmall = variant === 'small';

  return (
    <div 
      className={cn(
        'relative group rounded-xl overflow-hidden card-hover', 
        isDefault && 'aspect-[2/3]',
        isTrending && 'aspect-[16/9]',
        isSmall && 'aspect-[1/1]',
        className
      )}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <img 
          src={anime.image} 
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      
      {/* Overlay gradient */}
      <div className={cn(
        'absolute inset-0',
        'bg-gradient-to-t from-black/80 via-black/40 to-transparent',
        'opacity-80 group-hover:opacity-100 transition-opacity duration-300'
      )} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        {/* Title */}
        <h3 className={cn(
          'font-bold text-white mb-1 group-hover:text-primary transition-colors duration-200',
          isDefault && 'text-sm sm:text-base',
          isTrending && 'text-base sm:text-xl',
          isSmall && 'text-xs sm:text-sm'
        )}>
          {anime.title}
        </h3>
        
        {/* Info */}
        <div className="flex items-center text-xs text-white/80 mb-2">
          <div className="flex items-center mr-3">
            <Star className="w-3 h-3 text-yellow-400 mr-1" />
            <span>{anime.rating.toFixed(1)}</span>
          </div>
          <span className="mr-3">{anime.episodes} eps</span>
          <span className="truncate">{anime.genres.slice(0, 2).join(', ')}</span>
        </div>
        
        {/* Description - only visible on larger variants */}
        {!isSmall && (
          <p className={cn(
            "text-white/70 mb-3 line-clamp-2 text-xs",
            isDefault && "hidden sm:block",
            isTrending && "block"
          )}>
            {anime.description}
          </p>
        )}
        
        {/* Play button - only visible on hover */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            size={isSmall ? "sm" : "default"}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Play className="w-4 h-4 mr-2" /> Watch Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
