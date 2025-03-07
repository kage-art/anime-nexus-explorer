
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
