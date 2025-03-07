
import { Anime } from '@/lib/types';
import AnimeCard from './AnimeCard';
import { ChevronRight } from 'lucide-react';

interface AnimeGridProps {
  title: string;
  animeList: Anime[];
  viewAllLink?: string;
  cardVariant?: 'default' | 'trending' | 'small';
}

const AnimeGrid = ({ title, animeList, viewAllLink, cardVariant = 'default' }: AnimeGridProps) => {
  return (
    <section className="py-8">
      <div className="container px-4 mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold">{title}</h2>
          {viewAllLink && (
            <a
              href={viewAllLink}
              className="flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animeList.map((anime) => (
            <AnimeCard 
              key={anime.id} 
              anime={anime} 
              variant={cardVariant}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimeGrid;
