
import React from 'react';
import { Anime } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, Minus } from 'lucide-react';

interface ProgressTrackerProps {
  progress: {
    [animeId: number]: {
      watchedEpisodes: number;
      totalEpisodes: number;
    };
  };
  animeList: Anime[];
  updateProgress: (animeId: number, watchedEpisodes: number) => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  progress, 
  animeList,
  updateProgress
}) => {
  const animeWithProgress = Object.entries(progress).map(([animeId, data]) => {
    const anime = animeList.find(a => a.id === Number(animeId));
    if (!anime) return null;
    
    return {
      ...anime,
      ...data
    };
  }).filter(Boolean);

  if (animeWithProgress.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CardContent className="pt-6">
          <h3 className="text-xl font-bold mb-4">No progress tracked yet</h3>
          <p className="text-muted-foreground mb-6">Start watching anime to track your progress.</p>
          <Link to="/">
            <Button>Browse Anime</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {animeWithProgress.map((anime) => (
        <Card key={anime!.id}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              <Link to={`/anime/${anime!.id}`} className="hover:text-primary transition-colors">
                {anime!.title}
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2">
              <div className="text-sm">
                <span className="font-medium">{anime!.watchedEpisodes}</span>
                <span className="text-muted-foreground">/{anime!.totalEpisodes} episodes</span>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => updateProgress(anime!.id, Math.max(0, anime!.watchedEpisodes - 1))}
                  disabled={anime!.watchedEpisodes <= 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={() => updateProgress(anime!.id, Math.min(anime!.totalEpisodes, anime!.watchedEpisodes + 1))}
                  disabled={anime!.watchedEpisodes >= anime!.totalEpisodes}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Progress 
              value={(anime!.watchedEpisodes / anime!.totalEpisodes) * 100} 
              className="h-2" 
            />
            
            <div className="mt-2 text-xs text-right text-muted-foreground">
              {anime!.watchedEpisodes === anime!.totalEpisodes ? (
                <span className="text-primary font-medium">Completed</span>
              ) : (
                <span>{Math.round((anime!.watchedEpisodes / anime!.totalEpisodes) * 100)}% complete</span>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ProgressTracker;
