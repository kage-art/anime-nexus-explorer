
export interface Anime {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  episodes: number;
  genres: string[];
  season?: string;
  year?: number;
  trending?: boolean;
  popular?: boolean;
  recentlyUpdated?: boolean;
  seasonal?: boolean;
}

export interface Episode {
  id: number;
  animeId: number;
  number: number;
  title: string;
  thumbnail: string;
  url: string;
  subtitles?: Subtitle[];
}

export interface Subtitle {
  language: string;
  url: string;
}

export interface WatchlistItem {
  animeId: number;
  addedAt: Date;
}
