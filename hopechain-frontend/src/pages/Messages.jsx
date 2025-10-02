import { useState } from 'react';
import './Messages.css';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      name: 'Sarah Johnson',
      lastMessage: 'Thank you so much for offering to help with the medical bills!',
      timestamp: '2 min ago',
      unread: 2,
      avatar: null,
      type: 'recipient'
    },
    {
      id: 2,
      name: 'Michael Chen',
      lastMessage: 'I can help with the tutoring sessions. When would be good?',
      timestamp: '1 hour ago',
      unread: 0,
      avatar: null,
      type: 'donor'
    },
    {
      id: 3,
      name: 'Aisha Okafor',
      lastMessage: 'The blood donation drive was successful. Thank you!',
      timestamp: '3 hours ago',
      unread: 1,
      avatar: null,
      type: 'recipient'
    }
  ];

  // Mock messages for selected conversation
  const messages = selectedConversation ? [
    {
      id: 1,
      senderId: selectedConversation.id,
      senderName: selectedConversation.name,
      content: 'Hi! I saw your post about needing help with medical expenses.',
      timestamp: '10:30 AM',
      isOwn: false
    },
    {
      id: 2,
      senderId: 'me',
      senderName: 'You',
      content: 'Yes, thank you for reaching out! Any help would be greatly appreciated.',
      timestamp: '10:32 AM',
      isOwn: true
    },
    {
      id: 3,
      senderId: selectedConversation.id,
      senderName: selectedConversation.name,
      content: selectedConversation.lastMessage,
      timestamp: '10:35 AM',
      isOwn: false
    }
  ] : [];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedConversation) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        <p>Connect and communicate with your community</p>
      </div>

      <div className="messages-content">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h3>Conversations</h3>
            <button className="new-message-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2H5a2 2 0 0 0-2-2z"></path>
                <path d="M3 7l9 6 9-6"></path>
              </svg>
            </button>
          </div>
          
          <div className="conversations-list">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`conversation-item ${selectedConversation?.id === conversation.id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conversation)}
              >
                <div className="conversation-avatar">
                  {conversation.avatar ? (
                    <img src={conversation.avatar} alt={conversation.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {conversation.name.charAt(0)}
                    </div>
                  )}
                  <div className={`user-type-indicator ${conversation.type}`}></div>
                </div>
                
                <div className="conversation-info">
                  <div className="conversation-header">
                    <h4>{conversation.name}</h4>
                    <span className="timestamp">{conversation.timestamp}</span>
                  </div>
                  <p className="last-message">{conversation.lastMessage}</p>
                </div>
                
                {conversation.unread > 0 && (
                  <div className="unread-badge">{conversation.unread}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="chat-user-info">
                  <div className="chat-avatar">
                    {selectedConversation.avatar ? (
                      <img src={selectedConversation.avatar} alt={selectedConversation.name} />
                    ) : (
                      <div className="avatar-placeholder">
                        {selectedConversation.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div>
                    <h3>{selectedConversation.name}</h3>
                    <span className={`user-type ${selectedConversation.type}`}>
                      {selectedConversation.type === 'donor' ? 'Helper' : 'Seeker'}
                    </span>
                  </div>
                </div>
                
                <div className="chat-actions">
                  <button className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                    </svg>
                  </button>
                  <button className="chat-action-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="3"></circle>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.isOwn ? 'own' : 'other'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <form className="message-input-form" onSubmit={handleSendMessage}>
                <div className="message-input-container">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="message-input"
                  />
                  <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="22" y1="2" x2="11" y2="13"></line>
                      <polygon points="22,2 15,22 11,13 2,9"></polygon>
                    </svg>
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="no-conversation-selected">
              <div className="no-conversation-content">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <h3>Select a conversation</h3>
                <p>Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
