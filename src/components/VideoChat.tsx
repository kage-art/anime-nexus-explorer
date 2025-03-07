
import React, { useEffect, useRef } from 'react';
import Peer from 'peerjs';

interface VideoChatProps {
  peerId: string;
  peers: Array<{id: string, name: string}>;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
}

const VideoChat: React.FC<VideoChatProps> = ({ 
  peerId, 
  peers, 
  isVideoEnabled, 
  isAudioEnabled 
}) => {
  const peerRef = useRef<Peer | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const peerConnectionsRef = useRef<Record<string, any>>({});
  
  useEffect(() => {
    // Initialize peer connection
    const peer = new Peer(peerId, {
      host: 'your-peerjs-server.com',
      port: 443,
      path: '/peerjs',
      secure: true
    });
    
    peerRef.current = peer;
    
    // Get user media
    navigator.mediaDevices.getUserMedia({ 
      video: isVideoEnabled, 
      audio: isAudioEnabled 
    })
    .then(stream => {
      streamRef.current = stream;
      
      // Display local video
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      // Answer incoming calls
      peer.on('call', call => {
        call.answer(stream);
        call.on('stream', remoteStream => {
          // Create a video element for the remote stream
          displayRemoteStream(call.peer, remoteStream);
        });
        
        peerConnectionsRef.current[call.peer] = call;
      });
    })
    .catch(err => {
      console.error('Failed to get local stream', err);
    });
    
    // Clean up
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (peerRef.current) {
        peerRef.current.destroy();
      }
      
      // Close all peer connections
      Object.values(peerConnectionsRef.current).forEach((call: any) => {
        if (call.close) call.close();
      });
    };
  }, [peerId]);
  
  // Call peers when the list changes
  useEffect(() => {
    if (!peerRef.current || !streamRef.current) return;
    
    peers.forEach(peer => {
      // Skip if already connected
      if (peerConnectionsRef.current[peer.id]) return;
      
      // Call the peer
      const call = peerRef.current!.call(peer.id, streamRef.current!);
      call.on('stream', remoteStream => {
        displayRemoteStream(peer.id, remoteStream);
      });
      
      peerConnectionsRef.current[peer.id] = call;
    });
    
    // Clean up connections for peers that left
    Object.keys(peerConnectionsRef.current).forEach(id => {
      if (!peers.some(p => p.id === id)) {
        if (peerConnectionsRef.current[id].close) {
          peerConnectionsRef.current[id].close();
        }
        delete peerConnectionsRef.current[id];
        
        // Remove video element
        const videoEl = document.getElementById(`remote-video-${id}`);
        if (videoEl) videoEl.remove();
      }
    });
  }, [peers]);
  
  // Update video/audio tracks when enabled/disabled
  useEffect(() => {
    if (!streamRef.current) return;
    
    streamRef.current.getVideoTracks().forEach(track => {
      track.enabled = isVideoEnabled;
    });
    
    streamRef.current.getAudioTracks().forEach(track => {
      track.enabled = isAudioEnabled;
    });
  }, [isVideoEnabled, isAudioEnabled]);
  
  const displayRemoteStream = (peerId: string, stream: MediaStream) => {
    // Check if video element already exists
    let videoEl = document.getElementById(`remote-video-${peerId}`) as HTMLVideoElement;
    
    if (!videoEl) {
      // Create new video element
      videoEl = document.createElement('video');
      videoEl.id = `remote-video-${peerId}`;
      videoEl.autoplay = true;
      videoEl.playsInline = true;
      videoEl.className = "w-full h-full object-cover";
      
      const container = document.getElementById('remote-videos-container');
      if (container) {
        const div = document.createElement('div');
        div.id = `remote-video-container-${peerId}`;
        div.className = "relative bg-muted rounded-lg overflow-hidden aspect-video";
        div.appendChild(videoEl);
        container.appendChild(div);
      }
    }
    
    // Set the stream as the source
    videoEl.srcObject = stream;
  };
  
  return (
    <div className="w-full">
      {/* Local video */}
      <div className="relative bg-muted rounded-lg overflow-hidden aspect-video mb-2">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
          You {!isVideoEnabled && '(Video Off)'} {!isAudioEnabled && '(Muted)'}
        </div>
      </div>
      
      {/* Remote videos */}
      <div id="remote-videos-container" className="grid grid-cols-2 gap-2">
        {/* Remote videos will be added here dynamically */}
      </div>
    </div>
  );
};

export default VideoChat;
