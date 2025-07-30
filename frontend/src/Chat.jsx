import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { FiSend, FiWifi, FiWifiOff } from 'react-icons/fi';
import { AdminContext } from './AdminProvider';

const ChatComponent = ({ roomName, username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [error, setError] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const {BASE_URL} = useContext(AdminContext);

  // Reconnect logic
  const connectWebSocket = useCallback(() => {
    const socketUrl = `wss://${BASE_URL}/ws/chat/${encodeURIComponent(roomName)}/`;
    setConnectionStatus('Connecting...');
    setError(null);

    try {
      socketRef.current = new WebSocket(socketUrl);

      socketRef.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setConnectionStatus('Connected');
        
        // Send join notification
        socketRef.current.send(JSON.stringify({
          type: 'system',
          message: `${username} has joined the chat`,
          username: 'System'
        }));
      };

      socketRef.current.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);
          setMessages(prev => [...prev, {
            text: data.message,
            sender: data.username || 'Anonymous',
            timestamp: new Date().toLocaleTimeString(),
            type: data.type || 'user'
          }]);
        } catch (err) {
          console.error('Error parsing message:', err);
        }
      };

      socketRef.current.onclose = (e) => {
        console.log('WebSocket disconnected', e);
        setIsConnected(false);
        setConnectionStatus('Disconnected');
        if (!e.wasClean) {
          setError('Connection lost. Reconnecting...');
          setTimeout(connectWebSocket, 3000); // Reconnect after 3 seconds
        }
      };

      socketRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('Connection error. Please try again.');
        setIsConnected(false);
        setConnectionStatus('Error');
      };
    } catch (err) {
      console.error('WebSocket initialization error:', err);
      setError('Failed to connect to chat server');
    }
  }, [roomName, username]);

  // Connect to WebSocket when component mounts
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        // Send leave notification
        socketRef.current.send(JSON.stringify({
          type: 'system',
          message: `${username} has left the chat`,
          username: 'System'
        }));
        socketRef.current.close();
      }
    };
  }, [connectWebSocket, username]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'message',
        message: messageInput,
        username: username,
        timestamp: new Date().toISOString()
      }));
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat Room: {roomName}</h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? (
            <>
              <FiWifi className="status-icon" /> Connected
            </>
          ) : (
            <>
              <FiWifiOff className="status-icon" /> {connectionStatus}
            </>
          )}
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-state">No messages yet. Start the conversation!</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type} ${msg.sender === username ? 'own-message' : ''}`}>
              <div className="message-header">
                <span className="sender">{msg.sender}</span>
                <span className="timestamp">{msg.timestamp}</span>
              </div>
              <div className="message-text">{msg.text}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="message-input-container">
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
          disabled={!isConnected}
        />
        <button 
          onClick={sendMessage} 
          disabled={!isConnected || !messageInput.trim()}
          className="send-button"
        >
          <FiSend className="send-icon" />
        </button>
      </div>
    </div>
  );
};

// CSS Styles
const styles = `
  .chat-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    max-width: 600px;
    margin: 0 auto;
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    overflow: hidden;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background-color: #ffffff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .chat-header {
    padding: 12px 16px;
    background-color: #f6f8fa;
    border-bottom: 1px solid #e1e4e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .chat-header h3 {
    margin: 0;
    font-size: 16px;
    color: #24292e;
  }

  .connection-status {
    display: flex;
    align-items: center;
    font-size: 14px;
    gap: 6px;
  }

  .connection-status.connected {
    color: #2ea44f;
  }

  .connection-status.disconnected {
    color: #cb2431;
  }

  .status-icon {
    font-size: 16px;
  }

  .error-message {
    padding: 8px 16px;
    background-color: #ffebee;
    color: #c62828;
    font-size: 14px;
    text-align: center;
  }

  .messages-container {
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    background-color: #fafbfc;
  }

  .empty-state {
    text-align: center;
    color: #586069;
    padding: 20px;
    font-size: 14px;
  }

  .message {
    margin-bottom: 12px;
    padding: 8px 12px;
    border-radius: 6px;
    max-width: 80%;
    word-wrap: break-word;
  }

  .message.user {
    background-color: #e1f5fe;
    margin-right: auto;
  }

  .message.own-message {
    background-color: #e3f2fd;
    margin-left: auto;
  }

  .message.system {
    background-color: #f5f5f5;
    margin: 8px auto;
    text-align: center;
    font-size: 12px;
    color: #757575;
    max-width: 100%;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
    font-size: 12px;
  }

  .sender {
    font-weight: 600;
    color: #24292e;
  }

  .timestamp {
    color: #586069;
  }

  .message-text {
    font-size: 14px;
    line-height: 1.4;
  }

  .message-input-container {
    display: flex;
    padding: 12px;
    border-top: 1px solid #e1e4e8;
    background-color: #f6f8fa;
  }

  .message-input-container input {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #d1d5da;
    border-radius: 4px;
    font-size: 14px;
    outline: none;
  }

  .message-input-container input:focus {
    border-color: #0366d6;
    box-shadow: 0 0 0 3px rgba(3, 102, 214, 0.3);
  }

  .send-button {
    margin-left: 8px;
    padding: 8px 12px;
    background-color: #2ea44f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .send-button:disabled {
    background-color: #94d3a2;
    cursor: not-allowed;
  }

  .send-button:hover:not(:disabled) {
    background-color: #22863a;
  }

  .send-icon {
    font-size: 16px;
  }
`;

// Inject styles
const styleElement = document.createElement('style');
styleElement.innerHTML = styles;
document.head.appendChild(styleElement);

export default ChatComponent;