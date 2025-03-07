
import React, { useState } from 'react';
import { Episode } from '@/lib/types';
import { ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EpisodeListProps {
  episodes: Episode[];
  currentEpisodeId?: number;
  onEpisodeSelect: (episode: Episode) => void;
}

const EpisodeList: React.FC<EpisodeListProps> = ({ 
  episodes, 
  currentEpisodeId,
  onEpisodeSelect 
}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="bg-card rounded-lg shadow-sm">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-semibold">Episodes ({episodes.length})</h3>
        <Button variant="ghost" size="icon" aria-label={expanded ? "Collapse" : "Expand"}>
          {expanded ? <ChevronUp /> : <ChevronDown />}
        </Button>
      </div>
      
      {expanded && (
        <div className="px-2 pb-4 max-h-[400px] overflow-y-auto">
          {episodes.map((episode) => (
            <div 
              key={episode.id}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-accent/50 mb-1 cursor-pointer ${
                currentEpisodeId === episode.id ? 'bg-accent/70' : ''
              }`}
              onClick={() => onEpisodeSelect(episode)}
            >
              <div className="relative w-24 md:w-32 flex-shrink-0">
                <img 
                  src={episode.thumbnail || '/placeholder.svg'} 
                  alt={`Episode ${episode.number}`}
                  className="rounded w-full h-auto aspect-video object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <Play className="text-white" />
                </div>
              </div>
              <div className="flex-grow min-w-0">
                <p className="font-medium truncate">
                  Episode {episode.number}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {episode.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpisodeList;
