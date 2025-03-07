
import { useState, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AnimeGrid from '@/components/AnimeGrid';
import Footer from '@/components/Footer';
import { 
  getTrendingAnime, 
  getPopularAnime, 
  getRecentlyUpdatedAnime, 
  getSeasonalAnime 
} from '@/lib/data';

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const prefersColorScheme = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  // Initialize theme based on user preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
      setIsDarkMode(prefersColorScheme);
    }
  }, [prefersColorScheme]);

  // Update document classes when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // Get anime data
  const trendingAnime = getTrendingAnime();
  const popularAnime = getPopularAnime();
  const recentlyUpdatedAnime = getRecentlyUpdatedAnime();
  const seasonalAnime = getSeasonalAnime();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      
      <main className="flex-grow">
        <HeroSection trendingAnime={trendingAnime} />
        
        <div className="py-6">
          <AnimeGrid 
            title="Popular Anime" 
            animeList={popularAnime} 
            viewAllLink="#"
          />
          
          <AnimeGrid 
            title="Recently Updated" 
            animeList={recentlyUpdatedAnime} 
            viewAllLink="#"
          />
          
          <AnimeGrid 
            title="Seasonal Picks" 
            animeList={seasonalAnime} 
            viewAllLink="#"
            cardVariant="small"
          />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
