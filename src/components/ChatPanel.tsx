
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smile } from 'lucide-react';

interface Message {
  id: string;
  sender: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  currentUserId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ 
  messages, 
  onSendMessage, 
  currentUserId 
}) => {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };
  
  return (
    <div className="flex flex-col h-full">
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
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`p-2 rounded-lg ${
                  msg.senderId === currentUserId 
                    ? 'bg-primary text-primary-foreground ml-4' 
                    : 'bg-muted mr-4'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold">{msg.sender}</span>
                  <span className="text-xs opacity-70">
                    {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
                <p className="text-sm">{msg.text}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      <div className="p-2 border-t">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="shrink-0"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
        
        {showEmojiPicker && (
          <div className="mt-2 p-2 bg-card border rounded-lg">
            <div className="grid grid-cols-8 gap-1">
              {['😀', '😂', '😍', '🤔', '😎', '👍', '❤️', '🔥',
                '😊', '😁', '😉', '😘', '🤣', '😋', '🥳', '🙂'].map(emoji => (
                <button
                  key={emoji}
                  className="text-xl p-1 hover:bg-muted rounded"
                  onClick={() => {
                    addEmoji(emoji);
                    setShowEmojiPicker(false);
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPanel;
