
import { Anime, Episode, Subtitle } from '@/lib/types';
import { animeData } from './data';

// Mock data for episodes
const mockEpisodes: Episode[] = [
  {
    id: 101,
    animeId: 1,
    number: 1,
    title: "Beginnings",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+1",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8", // HLS test stream
    subtitles: [
      { language: "English", url: "https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt" },
      { language: "Japanese", url: "https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt" }
    ]
  },
  {
    id: 102,
    animeId: 1,
    number: 2,
    title: "The Journey",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+2",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    subtitles: [
      { language: "English", url: "https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt" }
    ]
  },
  {
    id: 103,
    animeId: 1,
    number: 3,
    title: "Rivals",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+3",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  {
    id: 104,
    animeId: 1,
    number: 4,
    title: "The Tournament",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+4",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  {
    id: 105,
    animeId: 1,
    number: 5,
    title: "Final Battle",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+5",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  // More episodes for anime 2
  {
    id: 201,
    animeId: 2,
    number: 1,
    title: "New World",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+1",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  },
  {
    id: 202,
    animeId: 2,
    number: 2,
    title: "The Challenge",
    thumbnail: "https://via.placeholder.com/640x360?text=Episode+2",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
  }
];

// Get anime by ID
export const getAnimeById = (id: number): Anime | undefined => {
  // Find the anime with the matching ID directly from the imported animeData
  return animeData.find(anime => anime.id === id);
};

// Get episodes by anime ID
export const getEpisodesByAnimeId = (animeId: number): Episode[] => {
  return mockEpisodes.filter(episode => episode.animeId === animeId);
};

// Get recommended anime based on the current anime ID
export const getRecommendedAnime = (currentAnimeId: number): Anime[] => {
  // For simplicity, we'll just return other anime
  // In a real app, this would use an algorithm or API to get related anime
  return animeData
    .filter(anime => anime.id !== currentAnimeId)
    .slice(0, 6); // Return at most 6 recommendations
};
