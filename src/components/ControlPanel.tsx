
import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Play, Pause, SkipBack, SkipForward, Volume, Volume2, VolumeX, Maximize, 
  Minimize, Monitor, TheatreMode } from 'lucide-react';

interface ControlPanelProps {
  isPlaying: boolean;
  volume: number;
  playbackSpeed: number;
  isTheaterMode: boolean;
  onPlayPause: () => void;
  onVolumeChange: (volume: number) => void;
  onMute: () => void;
  onSeek: (seconds: number) => void;
  onPlaybackSpeedChange: (speed: number) => void;
  onToggleTheaterMode: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isPlaying,
  volume,
  playbackSpeed,
  isTheaterMode,
  onPlayPause,
  onVolumeChange,
  onMute,
  onSeek,
  onPlaybackSpeedChange,
  onToggleTheaterMode
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between p-2 mt-2 bg-card rounded-lg">
      <div className="flex items-center space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSeek(-10)}
        >
          <SkipBack className="h-4 w-4" />
          <span className="ml-1">10s</span>
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onPlayPause}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onSeek(10)}
        >
          <span className="mr-1">10s</span>
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMute}
            className="px-1"
          >
            {volume === 0 ? (
              <VolumeX className="h-4 w-4" />
            ) : volume < 0.5 ? (
              <Volume className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="w-20"
          />
        </div>
        
        <Separator orientation="vertical" className="h-6" />
        
        <div className="flex items-center">
          <span className="text-sm mr-2">Speed:</span>
          <select 
            className="bg-background border rounded px-2 py-1 text-sm"
            value={playbackSpeed}
            onChange={(e) => onPlaybackSpeedChange(parseFloat(e.target.value))}
          >
            <option value={0.5}>0.5x</option>
            <option value={0.75}>0.75x</option>
            <option value={1}>1x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={1.75}>1.75x</option>
            <option value={2}>2x</option>
          </select>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onToggleTheaterMode}
        >
          {isTheaterMode ? <Monitor className="h-4 w-4" /> : <TheatreMode className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default ControlPanel;
