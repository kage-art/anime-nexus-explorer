
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bookmark, Play, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import EpisodeList from '@/components/EpisodeList';
import AnimeGrid from '@/components/AnimeGrid';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Anime, Episode } from '@/lib/types';
import { fetchAnimeDetails, fetchAnimeEpisodes, fetchAnimeRecommendations, mapJikanAnimeToAnime, mapJikanEpisodeToEpisode } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const AnimeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const animeId = parseInt(id || '1', 10);

  // Check local storage for theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Fetch anime details using React Query
  const { 
    data: anime, 
    isLoading: animeLoading, 
    error: animeError 
  } = useQuery({
    queryKey: ['anime', animeId],
    queryFn: async () => {
      const data = await fetchAnimeDetails(animeId);
      return mapJikanAnimeToAnime(data);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch episodes using React Query
  const { 
    data: episodes = [], 
    isLoading: episodesLoading, 
    error: episodesError 
  } = useQuery({
    queryKey: ['episodes', animeId],
    queryFn: async () => {
      const data = await fetchAnimeEpisodes(animeId);
      return data.map((episode: any) => mapJikanEpisodeToEpisode(episode, animeId));
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Fetch recommended anime using React Query
  const { 
    data: recommendedAnime = [], 
    isLoading: recommendedLoading, 
    error: recommendedError 
  } = useQuery({
    queryKey: ['recommended', animeId],
    queryFn: async () => {
      const recommendations = await fetchAnimeRecommendations(animeId);
      return recommendations.slice(0, 6).map(mapJikanAnimeToAnime);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Set first episode as current when episodes are loaded
  useEffect(() => {
    if (episodes.length > 0 && !currentEpisode) {
      setCurrentEpisode(episodes[0]);
    }
  }, [episodes, currentEpisode]);

  // Check if anime is in watchlist
  useEffect(() => {
    if (!anime) return;
    
    try {
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      setInWatchlist(watchlist.some((item: any) => item.animeId === animeId));
    } catch (err) {
      console.error("Error checking watchlist", err);
    }
  }, [anime, animeId]);

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
    // Scroll to player
    const playerElement = document.getElementById('video-player');
    if (playerElement) {
      playerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddToWatchlist = () => {
    if (!anime) return;
    
    try {
      // This would normally use Supabase, but for now we'll mock it with localStorage
      const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
      
      if (inWatchlist) {
        // Remove from watchlist
        const updatedWatchlist = watchlist.filter((item: any) => item.animeId !== anime.id);
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setInWatchlist(false);
        toast({
          title: "Removed from Watchlist",
          description: `${anime.title} has been removed from your watchlist`,
        });
      } else {
        // Add to watchlist
        const newItem = {
          animeId: anime.id,
          addedAt: new Date().toISOString(),
        };
        const updatedWatchlist = [...watchlist, newItem];
        localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
        setInWatchlist(true);
        toast({
          title: "Added to Watchlist",
          description: `${anime.title} has been added to your watchlist`,
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update watchlist",
        variant: "destructive",
      });
      console.error(err);
    }
  };

  const isLoading = animeLoading || episodesLoading;
  const error = animeError || episodesError || recommendedError;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-32 w-32 bg-muted rounded-full mb-4"></div>
            <div className="h-6 w-48 bg-muted rounded mb-2"></div>
            <div className="h-4 w-64 bg-muted rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="flex-grow container px-4 py-8 mx-auto flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Error</h1>
            <p className="text-muted-foreground mb-6">{error ? (error as Error).message : 'Something went wrong'}</p>
            <Button onClick={() => window.location.href = '/'}>
              Return to Home
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Video and Info */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <div id="video-player" className="mb-6">
                {currentEpisode && (
                  <VideoPlayer episode={currentEpisode} />
                )}
              </div>
              
              <div className="bg-card rounded-lg shadow-sm p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <h1 className="text-2xl md:text-3xl font-bold">{anime.title}</h1>
                  <Button 
                    variant={inWatchlist ? "outline" : "default"}
                    onClick={handleAddToWatchlist}
                  >
                    <Bookmark className={inWatchlist ? "fill-primary" : ""} />
                    <span className="ml-2">{inWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {anime.rating.toFixed(1)}
                  </Badge>
                  {anime.season && anime.year && (
                    <Badge variant="outline">
                      {anime.season} {anime.year}
                    </Badge>
                  )}
                  <Badge variant="outline">
                    {anime.episodes} Episodes
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {anime.genres.map((genre: string) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-muted-foreground mb-6">
                  {anime.description}
                </p>
                
                {currentEpisode && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Currently Playing: Episode {currentEpisode.number} - {currentEpisode.title}
                    </h3>
                    <Button onClick={() => episodes.length > 0 && handleEpisodeSelect(episodes[0])} variant="outline" size="sm">
                      <Play className="mr-2 h-4 w-4" /> Start from Episode 1
                    </Button>
                  </div>
                )}
              </div>
            </ErrorBoundary>
          </div>
          
          {/* Right column - Episodes list */}
          <div className="lg:col-span-1">
            <ErrorBoundary>
              <EpisodeList 
                episodes={episodes} 
                currentEpisodeId={currentEpisode?.id}
                onEpisodeSelect={handleEpisodeSelect} 
              />
            </ErrorBoundary>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* Recommendations */}
        <ErrorBoundary>
          <AnimeGrid 
            title="You May Also Like" 
            animeList={recommendedAnime} 
            viewAllLink="/explore" 
            cardVariant="small"
          />
        </ErrorBoundary>
      </main>
      
      <Footer />
    </div>
  );
};

export default AnimeDetail;
