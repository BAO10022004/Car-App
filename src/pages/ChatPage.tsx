import React, { useState } from 'react';
import { 
  Plus, 
  MessageSquare, 
  Users, 
  Settings, 
  Code, 
  Grid3x3,
  Paperclip,
  List,
  Clock,
  Send
} from 'lucide-react';
import '../assets/styles/ChatPage.css'
export default function ChatInterface() {
  const [message, setMessage] = useState('');
  const [selectedModel, setSelectedModel] = useState('Sonnet 4.5');

  const handleSend = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="chat-interface">
      {/* Sidebar */}
      <div className="sidebar">
        <button className="sidebar-btn">
          <Grid3x3 size={18} />
        </button>
        
        <button className="sidebar-btn new-chat">
          <Plus size={18} />
        </button>

        <button className="sidebar-btn">
          <MessageSquare size={18} />
        </button>

        <button className="sidebar-btn">
          <Users size={18} />
        </button>

        <button className="sidebar-btn">
          <Settings size={18} />
        </button>

        <button className="sidebar-btn">
          <Code size={18} />
        </button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header Badge */}
        <div className="header-badge">
          <span>Free plan</span>
          <span>·</span>
          <span>Upgrade</span>
        </div>

        {/* Welcome Section */}
        <div className="welcome-container">
          <div className="welcome-icon">✱</div>
          <h1 className="welcome-title">Back at it, Ôn Gia</h1>
        </div>

        {/* Chat Input */}
        <div className="chat-input-container">
          <textarea 
            className="chat-input" 
            placeholder="How can I help you today?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />

          <div className="input-controls">
            <div className="input-left">
              <button className="control-btn" title="Attach file">
                <Paperclip size={18} />
              </button>

              <button className="control-btn" title="Options">
                <List size={18} />
              </button>

              <button className="control-btn" title="Recent">
                <Clock size={18} />
              </button>
            </div>

            <div className="input-right">
              <select 
                className="model-selector"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option>Sonnet 4.5</option>
                <option>Opus 4</option>
                <option>Haiku 4</option>
              </select>

              <button 
                className="send-btn" 
                onClick={handleSend}
                disabled={!message.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}