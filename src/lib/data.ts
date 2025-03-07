
import { Anime } from './types';

export const animeData: Anime[] = [
  {
    id: 1,
    title: "Demon Slayer",
    description: "A boy discovers his family slaughtered and his sister turned into a demon. He joins the Demon Slayer Corps to find a cure and avenge his family.",
    image: "https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    episodes: 26,
    genres: ["Action", "Fantasy", "Historical"],
    year: 2019,
    trending: true,
    popular: true,
    seasonal: true
  },
  {
    id: 2,
    title: "Attack on Titan",
    description: "Humanity lives inside cities surrounded by enormous walls due to the Titans, gigantic humanoid creatures who devour humans seemingly without reason.",
    image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    episodes: 75,
    genres: ["Action", "Drama", "Dark Fantasy"],
    year: 2013,
    trending: true,
    popular: true
  },
  {
    id: 3,
    title: "My Hero Academia",
    description: "A boy without superpowers in a world where they have become commonplace dreams of becoming a hero.",
    image: "https://images.unsplash.com/photo-1560972550-aba3456b5564?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    episodes: 113,
    genres: ["Action", "Superhero"],
    year: 2016,
    popular: true,
    recentlyUpdated: true
  },
  {
    id: 4,
    title: "Jujutsu Kaisen",
    description: "A boy eats a powerful Curse, gaining the ability to see and combat Curses, monsters formed from negative human emotions.",
    image: "https://images.unsplash.com/photo-1612887726773-e64e20cf15a1?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    episodes: 24,
    genres: ["Action", "Supernatural"],
    year: 2020,
    trending: true,
    popular: true,
    recentlyUpdated: true
  },
  {
    id: 5,
    title: "One Punch Man",
    description: "A superhero who can defeat any opponent with a single punch but seeks a worthy opponent after growing bored.",
    image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    episodes: 24,
    genres: ["Action", "Comedy"],
    year: 2015,
    popular: true
  },
  {
    id: 6,
    title: "Spy x Family",
    description: "A spy on an undercover mission gets married and adopts a child without knowing she's a telepath and his wife is a skilled assassin.",
    image: "https://images.unsplash.com/photo-1614583224978-f05ce51ef5fa?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    episodes: 25,
    genres: ["Action", "Comedy"],
    year: 2022,
    trending: true,
    recentlyUpdated: true,
    seasonal: true
  },
  {
    id: 7,
    title: "Chainsaw Man",
    description: "A young man with the ability to transform parts of his body into chainsaws makes a contract with a devil to survive.",
    image: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1000&auto=format&fit=crop",
    rating: 4.6,
    episodes: 12,
    genres: ["Action", "Dark Fantasy"],
    year: 2022,
    trending: true,
    seasonal: true,
    recentlyUpdated: true
  },
  {
    id: 8,
    title: "Fullmetal Alchemist: Brotherhood",
    description: "Two brothers search for the Philosopher's Stone to restore their bodies after a failed attempt to bring their mother back to life.",
    image: "https://images.unsplash.com/photo-1551316679-9c6ae9dec224?q=80&w=1000&auto=format&fit=crop",
    rating: 4.9,
    episodes: 64,
    genres: ["Action", "Adventure", "Fantasy"],
    year: 2009,
    popular: true
  },
  {
    id: 9,
    title: "Death Note",
    description: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it.",
    image: "https://images.unsplash.com/photo-1513001900722-370f803f498d?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    episodes: 37,
    genres: ["Thriller", "Psychological"],
    year: 2006,
    popular: true
  },
  {
    id: 10,
    title: "Violet Evergarden",
    description: "A former soldier becomes a ghostwriter and explores the meaning of 'I love you' words told to her by her former superior.",
    image: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    episodes: 13,
    genres: ["Drama", "Fantasy"],
    year: 2018,
    seasonal: true
  },
  {
    id: 11,
    title: "Tokyo Revengers",
    description: "A man travels back in time to save his girlfriend from being killed by a criminal organization.",
    image: "https://images.unsplash.com/photo-1553949345-eb786d49c0bb?q=80&w=1000&auto=format&fit=crop",
    rating: 4.4,
    episodes: 24,
    genres: ["Action", "Science Fiction"],
    year: 2021,
    trending: true,
    recentlyUpdated: true
  },
  {
    id: 12,
    title: "Your Lie in April",
    description: "A piano prodigy who lost his ability to play meets a free-spirited violinist who helps him return to the music world.",
    image: "https://images.unsplash.com/photo-1517722014278-c256a91a6fba?q=80&w=1000&auto=format&fit=crop",
    rating: 4.7,
    episodes: 22,
    genres: ["Romance", "Drama", "Music"],
    year: 2014,
    seasonal: true
  },
  {
    id: 13,
    title: "Haikyuu!!",
    description: "A determined high school student joins the volleyball club to follow in the footsteps of his idol.",
    image: "https://images.unsplash.com/photo-1564226803380-77d7c50d7018?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    episodes: 85,
    genres: ["Sports", "Comedy", "Drama"],
    year: 2014,
    recentlyUpdated: true
  },
  {
    id: 14,
    title: "Erased",
    description: "A man who has the ability to travel back in time to prevent deaths is sent back 18 years to prevent a kidnapping that took the life of his classmate.",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1000&auto=format&fit=crop",
    rating: 4.5,
    episodes: 12,
    genres: ["Mystery", "Thriller"],
    year: 2016,
    seasonal: true
  },
  {
    id: 15,
    title: "Vinland Saga",
    description: "A young Viking seeks revenge against his father's killer while questioning his warrior lifestyle.",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop",
    rating: 4.8,
    episodes: 24,
    genres: ["Action", "Adventure", "Historical"],
    year: 2019,
    recentlyUpdated: true,
    seasonal: true
  }
];

export const getTrendingAnime = () => animeData.filter(anime => anime.trending);
export const getPopularAnime = () => animeData.filter(anime => anime.popular);
export const getRecentlyUpdatedAnime = () => animeData.filter(anime => anime.recentlyUpdated);
export const getSeasonalAnime = () => animeData.filter(anime => anime.seasonal);
