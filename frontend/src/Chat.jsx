import React, { useState, useEffect, useRef } from 'react';

const ChatComponent = ({ roomName, username }) => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Connect to WebSocket when component mounts
   useEffect(() => {
    // Properly interpolate roomName
    const socketUrl = `ws://localhost:8000/ws/chat/${roomName}/`;
    socketRef.current = new WebSocket(socketUrl);

    socketRef.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    };

    socketRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setMessages(prev => [...prev, {
        text: data.message,
        sender: data.username || 'Anonymous',
        timestamp: new Date().toLocaleTimeString()
      }]);
    };

    socketRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [roomName]); 
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (messageInput.trim() && socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        message: messageInput,
        username: username
      }));
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>Chat Room: {roomName}</h3>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>
      
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <div className="message-header">
              <span className="sender">{msg.sender}</span>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
            <div className="message-text">{msg.text}</div>
          </div>
        ))}
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
        <button onClick={sendMessage} disabled={!isConnected || !messageInput.trim()}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatComponent;