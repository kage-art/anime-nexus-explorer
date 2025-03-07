
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Check, Moon, Sun, Upload } from 'lucide-react';
import { Anime, WatchlistItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import WatchlistGrid from '@/components/WatchlistGrid';
import ProgressTracker from '@/components/ProgressTracker';

// Mock data - replace with Supabase fetch later
const mockWatchlist: WatchlistItem[] = [
  { animeId: 1, addedAt: new Date() },
  { animeId: 2, addedAt: new Date() },
  { animeId: 3, addedAt: new Date() }
];

const mockAnimeData: Anime[] = [
  {
    id: 1,
    title: "Attack on Titan",
    description: "In a world where humanity lives inside cities surrounded by enormous walls due to the Titans.",
    image: "https://picsum.photos/id/237/300/400",
    rating: 4.8,
    episodes: 75,
    genres: ["Action", "Drama", "Fantasy"],
    year: 2013
  },
  {
    id: 2,
    title: "Demon Slayer",
    description: "A boy who sells charcoal to support his family finds his life changed forever when his family is slaughtered.",
    image: "https://picsum.photos/id/238/300/400",
    rating: 4.7,
    episodes: 44,
    genres: ["Action", "Fantasy", "Historical"],
    year: 2019
  },
  {
    id: 3,
    title: "My Hero Academia",
    description: "In a world where people with superpowers known as 'Quirks' are the norm, a boy without powers dreams of becoming a hero.",
    image: "https://picsum.photos/id/239/300/400",
    rating: 4.6,
    episodes: 113,
    genres: ["Action", "Comedy", "Superhero"],
    year: 2016
  }
];

// Types for our user profile
interface UserProfile {
  username: string;
  bio: string;
  avatarUrl: string;
  theme: 'light' | 'dark';
}

// Types for episode progress tracking
interface ProgressData {
  [animeId: number]: {
    watchedEpisodes: number;
    totalEpisodes: number;
  };
}

const UserProfile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // User profile state
  const [profile, setProfile] = useState<UserProfile>({
    username: 'AnimeUser',
    bio: 'I love watching anime in my free time!',
    avatarUrl: '',
    theme: 'light'
  });
  
  // Edit states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedUsername, setEditedUsername] = useState(profile.username);
  const [editedBio, setEditedBio] = useState(profile.bio);
  
  // Watchlist and progress state
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(mockWatchlist);
  const [animeList, setAnimeList] = useState<Anime[]>(mockAnimeData);
  const [progress, setProgress] = useState<ProgressData>({
    1: { watchedEpisodes: 45, totalEpisodes: 75 },
    2: { watchedEpisodes: 20, totalEpisodes: 44 },
    3: { watchedEpisodes: 60, totalEpisodes: 113 }
  });

  // Load saved profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    const savedProgress = localStorage.getItem('animeProgress');
    
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    }
    
    if (savedProgress) {
      setProgress(JSON.parse(savedProgress));
    }
    
    // Apply saved theme
    document.documentElement.classList.toggle('dark', profile.theme === 'dark');
  }, []);
  
  // Save profile changes to localStorage
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
    
    // Apply theme change
    document.documentElement.classList.toggle('dark', profile.theme === 'dark');
  }, [profile]);
  
  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem('animeProgress', JSON.stringify(progress));
  }, [progress]);

  // Handle avatar upload
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({
          ...profile,
          avatarUrl: reader.result as string
        });
        
        toast({
          title: "Avatar updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle username edit
  const handleUsernameSubmit = () => {
    if (editedUsername.trim()) {
      setProfile({
        ...profile,
        username: editedUsername
      });
      setIsEditingUsername(false);
      
      toast({
        title: "Username updated",
        description: "Your username has been updated successfully.",
      });
    }
  };

  // Handle bio edit
  const handleBioSubmit = () => {
    setProfile({
      ...profile,
      bio: editedBio
    });
    setIsEditingBio(false);
    
    toast({
      title: "Bio updated",
      description: "Your bio has been updated successfully.",
    });
  };

  // Handle theme toggle
  const toggleTheme = () => {
    setProfile({
      ...profile,
      theme: profile.theme === 'light' ? 'dark' : 'light'
    });
    
    toast({
      title: "Theme changed",
      description: `Switched to ${profile.theme === 'light' ? 'dark' : 'light'} mode.`,
    });
  };

  // Handle progress update
  const updateProgress = (animeId: number, watchedEpisodes: number) => {
    setProgress({
      ...progress,
      [animeId]: {
        ...progress[animeId],
        watchedEpisodes
      }
    });
    
    toast({
      title: "Progress updated",
      description: "Your watching progress has been saved.",
    });
  };

  return (
    <div className="container mx-auto px-4 py-10 pb-20 animate-fade-in">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="flex flex-col items-center">
              <div className="relative mb-4 group">
                <Avatar className="w-32 h-32 border-4 border-primary/20">
                  <AvatarImage src={profile.avatarUrl} alt={profile.username} />
                  <AvatarFallback className="text-2xl bg-primary/10">
                    {profile.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <label htmlFor="avatar-upload" className="bg-black/50 rounded-full p-2 cursor-pointer">
                    <Upload className="h-6 w-6 text-white" />
                    <input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden" 
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                {isEditingUsername ? (
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editedUsername}
                      onChange={(e) => setEditedUsername(e.target.value)}
                      className="text-lg font-bold"
                      autoFocus
                    />
                    <Button size="icon" variant="ghost" onClick={handleUsernameSubmit}>
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle>{profile.username}</CardTitle>
                    <Button size="icon" variant="ghost" onClick={() => setIsEditingUsername(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="mb-4" 
                onClick={toggleTheme}
              >
                {profile.theme === 'light' ? 
                  <><Moon className="mr-2 h-4 w-4" /> Dark Mode</> : 
                  <><Sun className="mr-2 h-4 w-4" /> Light Mode</>
                }
              </Button>
              
              <div className="w-full">
                <CardDescription className="text-left mb-2 flex justify-between">
                  <span>Bio</span>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditingBio(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </CardDescription>
                
                {isEditingBio ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedBio}
                      onChange={(e) => setEditedBio(e.target.value)}
                      className="min-h-[100px]"
                      autoFocus
                    />
                    <Button onClick={handleBioSubmit}>Save Bio</Button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                )}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Stats</h3>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-2xl font-bold">{watchlist.length}</p>
                      <p className="text-xs text-muted-foreground">Watchlist</p>
                    </div>
                    <div className="bg-secondary rounded-lg p-3">
                      <p className="text-2xl font-bold">
                        {Object.values(progress).reduce((sum, item) => sum + item.watchedEpisodes, 0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Episodes Watched</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Favorite Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Action</Badge>
                    <Badge>Fantasy</Badge>
                    <Badge>Drama</Badge>
                    <Badge>Comedy</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for Watchlist and Progress */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="watchlist" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="watchlist">My Watchlist</TabsTrigger>
              <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="watchlist">
              <WatchlistGrid 
                watchlist={watchlist} 
                animeList={animeList} 
              />
            </TabsContent>
            
            <TabsContent value="progress">
              <ProgressTracker 
                progress={progress}
                animeList={animeList}
                updateProgress={updateProgress}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
