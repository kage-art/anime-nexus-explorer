
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import Peer from 'peerjs';
import { GiftedChat } from 'react-gifted-chat';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import VideoPlayer from '@/components/VideoPlayer';
import { useToast } from '@/hooks/use-toast';
import { getEpisodesByAnimeId } from '@/lib/data-detail';
import type { Episode } from '@/lib/types';
import VideoChat from '@/components/VideoChat';
import ChatPanel from '@/components/ChatPanel';
import ControlPanel from '@/components/ControlPanel';
import { X, Copy, UserPlus, Lock, Unlock, Video, VideoOff, Mic, MicOff, TheatreMode, Monitor } from 'lucide-react';

interface WatchPartyProps {}

const WatchParty: React.FC<WatchPartyProps> = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const socketRef = useRef<Socket | null>(null);
  const peerRef = useRef<Peer | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [isCreator, setIsCreator] = useState(false);
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [animeId, setAnimeId] = useState<number | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isTheaterMode, setIsTheaterMode] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [participants, setParticipants] = useState<Array<{id: string, name: string}>>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [userId] = useState(`user-${Math.floor(Math.random() * 1000000)}`);
  const [userName, setUserName] = useState(`Guest ${Math.floor(Math.random() * 1000)}`);
  
  useEffect(() => {
    // For demo purposes, load the first episode of anime with ID 1
    const tempAnimeId = 1;
    setAnimeId(tempAnimeId);
    const episodes = getEpisodesByAnimeId(tempAnimeId);
    if (episodes.length > 0) {
      setEpisode(episodes[0]);
    }
    
    // If roomId is provided, join the room
    if (roomId) {
      joinRoom(roomId);
    } else {
      // If no roomId, create a new room
      createRoom();
    }
    
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
      if (peerRef.current) {
        peerRef.current.destroy();
      }
    };
  }, [roomId]);
  
  const createRoom = () => {
    // Generate a random room ID
    const newRoomId = Math.random().toString(36).substring(2, 8);
    
    // Initialize socket connection
    initializeSocketConnection(newRoomId);
    
    // Set as room creator
    setIsCreator(true);
    
    // Navigate to the new room URL
    navigate(`/watch-party/${newRoomId}`);
    
    toast({
      title: "Room Created",
      description: `Room ID: ${newRoomId}`,
    });
  };
  
  const joinRoom = (roomId: string) => {
    // Initialize socket connection
    initializeSocketConnection(roomId);
    
    toast({
      title: "Joining Room",
      description: `Connecting to room ${roomId}...`,
    });
  };
  
  const initializeSocketConnection = (roomId: string) => {
    // In a real app, this would be your backend server URL
    const socket = io('https://your-socket-server.com', {
      query: {
        roomId,
        userId,
        userName
      }
    });
    
    socketRef.current = socket;
    
    socket.on('connect', () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Successfully connected to the room",
      });
    });
    
    socket.on('disconnect', () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Lost connection to the room",
        variant: "destructive"
      });
    });
    
    socket.on('error', (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    });
    
    socket.on('roomPasswordRequired', () => {
      setIsPasswordProtected(true);
    });
    
    socket.on('roomPasswordIncorrect', () => {
      setEnteredPassword('');
      toast({
        title: "Incorrect Password",
        description: "The password you entered is incorrect",
        variant: "destructive"
      });
    });
    
    socket.on('userJoined', (user) => {
      setParticipants(prev => [...prev, user]);
      toast({
        title: "User Joined",
        description: `${user.name} joined the room`,
      });
    });
    
    socket.on('userLeft', (userId) => {
      setParticipants(prev => prev.filter(p => p.id !== userId));
    });
    
    socket.on('chatMessage', (message) => {
      setMessages(prev => [message, ...prev]);
    });
    
    socket.on('videoControl', (data) => {
      // Video control events (play, pause, seek, etc.)
      console.log('Received video control', data);
      // In a real implementation, this would update the VideoPlayer component
    });
    
    // Initialize peer connection for WebRTC
    const peer = new Peer(userId, {
      host: 'your-peerjs-server.com',
      port: 443,
      path: '/peerjs',
      secure: true
    });
    
    peerRef.current = peer;
    
    peer.on('open', (id) => {
      console.log('My peer ID is: ' + id);
    });
    
    peer.on('error', (error) => {
      console.error('PeerJS error:', error);
      toast({
        title: "Video Connection Error",
        description: "Failed to establish video connection",
        variant: "destructive"
      });
    });
  };
  
  const sendChatMessage = (text: string) => {
    if (!socketRef.current || !text.trim()) return;
    
    const message = {
      _id: Math.random().toString(36),
      text,
      createdAt: new Date(),
      user: {
        _id: userId,
        name: userName,
      },
    };
    
    socketRef.current.emit('chatMessage', message);
    setMessages(prev => [message, ...prev]);
  };
  
  const togglePassword = () => {
    if (isCreator) {
      setIsPasswordProtected(!isPasswordProtected);
      if (!isPasswordProtected) {
        // Generate random password if enabling protection
        const newPassword = Math.random().toString(36).substring(2, 8);
        setPassword(newPassword);
        socketRef.current?.emit('setRoomPassword', newPassword);
        toast({
          title: "Password Protection Enabled",
          description: `Room password: ${newPassword}`,
        });
      } else {
        // Remove password if disabling protection
        setPassword('');
        socketRef.current?.emit('removeRoomPassword');
        toast({
          title: "Password Protection Disabled",
          description: "Anyone can join the room now",
        });
      }
    }
  };
  
  const submitPassword = () => {
    if (!socketRef.current) return;
    socketRef.current.emit('checkRoomPassword', enteredPassword);
  };
  
  const copyRoomLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Watch party link copied to clipboard",
    });
  };
  
  const toggleMic = () => {
    setIsMicEnabled(!isMicEnabled);
    // In a real implementation, this would enable/disable the user's microphone
  };
  
  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    // In a real implementation, this would enable/disable the user's camera
  };
  
  const toggleTheaterMode = () => {
    setIsTheaterMode(!isTheaterMode);
  };
  
  const changePlaybackSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    socketRef.current?.emit('videoControl', { action: 'speed', value: speed });
  };
  
  if (isPasswordProtected && !isCreator && !password) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="w-full max-w-md p-6 space-y-4 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-center">Password Protected Room</h2>
          <p className="text-center text-muted-foreground">This watch party is password protected</p>
          <Input
            type="password"
            placeholder="Enter room password"
            value={enteredPassword}
            onChange={(e) => setEnteredPassword(e.target.value)}
          />
          <Button onClick={submitPassword} className="w-full">Join Room</Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className={`flex flex-col min-h-screen ${isTheaterMode ? 'bg-black' : 'bg-background'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Watch Party</h1>
          <span className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded-full">
            Room: {roomId}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={copyRoomLink}>
            <Copy className="mr-2 h-4 w-4" />
            Share
          </Button>
          {isCreator && (
            <Button 
              variant={isPasswordProtected ? "default" : "outline"} 
              size="sm" 
              onClick={togglePassword}
            >
              {isPasswordProtected ? <Lock className="mr-2 h-4 w-4" /> : <Unlock className="mr-2 h-4 w-4" />}
              {isPasswordProtected ? 'Protected' : 'Add Password'}
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => navigate('/')}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Main content */}
      <div className={`flex flex-col md:flex-row flex-1 ${isTheaterMode ? 'p-0' : 'p-4'}`}>
        {/* Video player area */}
        <div className={`flex flex-col ${isTheaterMode ? 'w-full' : 'md:w-3/4'}`}>
          {/* Video player */}
          <div className="relative bg-black rounded-lg overflow-hidden">
            {episode ? (
              <VideoPlayer episode={episode} autoplay={false} />
            ) : (
              <div className="flex items-center justify-center h-48 md:h-96 bg-muted">
                <p className="text-muted-foreground">Loading video...</p>
              </div>
            )}
          </div>
          
          {/* Control panel */}
          <div className="flex flex-wrap items-center justify-between p-2 mt-2 bg-card rounded-lg">
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleMic}
              >
                {isMicEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleVideo}
              >
                {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                <span className="text-sm mr-2">Speed:</span>
                <select 
                  className="bg-background border rounded px-2 py-1 text-sm"
                  value={playbackSpeed}
                  onChange={(e) => changePlaybackSpeed(parseFloat(e.target.value))}
                >
                  <option value={0.5}>0.5x</option>
                  <option value={1}>1x</option>
                  <option value={1.5}>1.5x</option>
                  <option value={2}>2x</option>
                </select>
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleTheaterMode}
              >
                {isTheaterMode ? <Monitor className="h-4 w-4" /> : <TheatreMode className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          
          {/* Participant videos */}
          {!isTheaterMode && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
              {participants.map((participant) => (
                <div key={participant.id} className="bg-card rounded-lg overflow-hidden aspect-video">
                  <div className="w-full h-full flex items-center justify-center bg-muted">
                    <p className="text-xs text-muted-foreground">{participant.name}</p>
                  </div>
                </div>
              ))}
              <div className="bg-card rounded-lg overflow-hidden aspect-video">
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <p className="text-xs text-muted-foreground">You ({userName})</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Chat panel */}
        {!isTheaterMode && (
          <div className="md:w-1/4 md:ml-4 mt-4 md:mt-0 flex flex-col bg-card rounded-lg overflow-hidden">
            <div className="p-3 border-b">
              <h2 className="font-bold">Chat</h2>
            </div>
            
            <div className="flex-1 p-2 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">No messages yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {messages.map((message) => (
                    <div 
                      key={message._id} 
                      className={`p-2 rounded-lg ${
                        message.user._id === userId 
                          ? 'bg-primary text-primary-foreground ml-4' 
                          : 'bg-muted mr-4'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold">{message.user.name}</span>
                        <span className="text-xs opacity-70">
                          {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                      <p className="text-sm">{message.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-2 border-t">
              <form 
                className="flex items-center space-x-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const input = e.currentTarget.elements.namedItem('message') as HTMLInputElement;
                  if (input.value.trim()) {
                    sendChatMessage(input.value);
                    input.value = '';
                  }
                }}
              >
                <Input
                  name="message"
                  placeholder="Type a message..."
                  className="flex-1"
                />
                <Button type="submit">Send</Button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchParty;
