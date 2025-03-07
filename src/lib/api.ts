
import axios from 'axios';

// Create axios instance with base URL and default configs
const jikanApi = axios.create({
  baseURL: 'https://api.jikan.moe/v4',
  timeout: 10000,
});

// In-memory cache for API responses
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Helper function to check if cache is valid
const isCacheValid = (key: string): boolean => {
  if (!cache[key]) return false;
  const now = Date.now();
  return now - cache[key].timestamp < CACHE_DURATION;
};

// Generic cached fetch function
const cachedFetch = async (url: string) => {
  if (isCacheValid(url)) {
    return cache[url].data;
  }

  try {
    const response = await jikanApi.get(url);
    cache[url] = {
      data: response.data,
      timestamp: Date.now(),
    };
    return response.data;
  } catch (error) {
    console.error(`Error fetching from Jikan API: ${url}`, error);
    throw error;
  }
};

// Fetch anime details
export const fetchAnimeDetails = async (id: number) => {
  const url = `/anime/${id}`;
  const data = await cachedFetch(url);
  return data.data;
};

// Fetch anime episodes
export const fetchAnimeEpisodes = async (id: number) => {
  const url = `/anime/${id}/episodes`;
  const data = await cachedFetch(url);
  return data.data;
};

// Fetch anime recommendations
export const fetchAnimeRecommendations = async (id: number) => {
  const url = `/anime/${id}/recommendations`;
  const data = await cachedFetch(url);
  return data.data.map((item: any) => item.entry);
};

// Map Jikan API anime data to our Anime type
export const mapJikanAnimeToAnime = (jikanAnime: any): any => {
  return {
    id: jikanAnime.mal_id,
    title: jikanAnime.title,
    description: jikanAnime.synopsis || '',
    image: jikanAnime.images.jpg.large_image_url,
    rating: jikanAnime.score || 0,
    episodes: jikanAnime.episodes || 0,
    genres: jikanAnime.genres?.map((g: any) => g.name) || [],
    season: jikanAnime.season,
    year: jikanAnime.year,
  };
};

// Map Jikan API episode data to our Episode type
export const mapJikanEpisodeToEpisode = (jikanEpisode: any, animeId: number): any => {
  return {
    id: jikanEpisode.mal_id,
    animeId: animeId,
    number: jikanEpisode.mal_id,
    title: jikanEpisode.title || `Episode ${jikanEpisode.mal_id}`,
    thumbnail: jikanEpisode.images?.jpg?.image_url || '',
    url: 'https://example.com/placeholder-video.mp4', // Since Jikan doesn't provide video URLs
    subtitles: [],
  };
};
