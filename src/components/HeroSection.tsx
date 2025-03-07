
import { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Anime } from '@/lib/types';

interface HeroSectionProps {
  trendingAnime: Anime[];
}

const HeroSection = ({ trendingAnime }: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % trendingAnime.length);
    
    // Reset transitioning state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? trendingAnime.length - 1 : prevIndex - 1
    );
    
    // Reset transitioning state after animation completes
    setTimeout(() => setIsTransitioning(false), 600);
  };

  // Auto-advance slides
  useEffect(() => {
    const startTimeout = () => {
      timeoutRef.current = setTimeout(nextSlide, 6000);
    };
    
    startTimeout();
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, trendingAnime.length]);

  // Reset the timeout when user manually changes slides
  const handleManualNavigation = (callback: () => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    callback();
    timeoutRef.current = setTimeout(nextSlide, 6000);
  };

  if (trendingAnime.length === 0) return null;

  const currentAnime = trendingAnime[currentIndex];

  return (
    <section className="relative pt-16 h-[70vh] min-h-[500px] max-h-[700px] overflow-hidden">
      {/* Background Image */}
      {trendingAnime.map((anime, index) => (
        <div
          key={anime.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000",
            index === currentIndex ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={index !== currentIndex}
        >
          <img
            src={anime.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent dark:from-background dark:via-background/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-background to-transparent w-2/3 dark:from-background" />
        </div>
      ))}

      {/* Content */}
      <div className="container relative h-full mx-auto px-4 flex items-center">
        <div className="max-w-2xl">
          {trendingAnime.map((anime, index) => (
            <div
              key={anime.id}
              className={cn(
                "transition-all duration-500",
                index === currentIndex 
                  ? "opacity-100 translate-y-0" 
                  : "opacity-0 translate-y-8 absolute pointer-events-none"
              )}
              aria-hidden={index !== currentIndex}
            >
              <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-primary bg-primary/10 rounded-full">
                #{index + 1} Trending
              </div>
              <h1 className="text-3xl md:text-5xl font-bold mb-3">{anime.title}</h1>
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <span className="mr-3">{anime.year}</span>
                <span className="mr-3">{anime.episodes} Episodes</span>
                <span>{anime.genres.join(', ')}</span>
              </div>
              <p className="text-sm md:text-base text-foreground/80 mb-6 max-w-lg">
                {anime.description}
              </p>
              <div className="flex space-x-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Now
                </Button>
                <Button variant="outline">
                  Add to List
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {trendingAnime.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-2.5 h-2.5 rounded-full transition-all duration-300",
              index === currentIndex
                ? "bg-primary w-6"
                : "bg-white/30 hover:bg-white/50"
            )}
            onClick={() => {
              setCurrentIndex(index);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = setTimeout(nextSlide, 6000);
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white rounded-full p-2 md:p-3"
        onClick={() => handleManualNavigation(prevSlide)}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/30 text-white rounded-full p-2 md:p-3"
        onClick={() => handleManualNavigation(nextSlide)}
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </section>
  );
};

export default HeroSection;
