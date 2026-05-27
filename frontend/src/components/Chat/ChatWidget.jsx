import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './ChatWidget.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getInitials = (user) => {
  const name = user?.fullname || user?.name || '';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
};

const ChatWidget = ({ currentUser, contactUser, isFloating = true, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser || !currentUser.id) return;

    socketRef.current = io(API_URL);

    socketRef.current.on('connect', () => {
      socketRef.current.emit('join', currentUser.id);
    });

    socketRef.current.on('receive_message', (msg) => {
      if (contactUser && (
        (msg.senderId === contactUser.id && msg.receiverId === currentUser.id) ||
        (msg.senderId === currentUser.id && msg.receiverId === contactUser.id)
      )) {
        setMessages((prev) => [...prev, msg]);
        if (!isOpen && msg.senderId !== currentUser.id) {
          setUnreadCount((prev) => prev + 1);
        }
      } else if (msg.senderId !== currentUser.id) {
        setUnreadCount((prev) => prev + 1);
      }
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [currentUser, contactUser, isOpen]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!currentUser || !contactUser) return;
      try {
        const res = await fetch(`${API_URL}/api/chat/history/${currentUser.id}/${contactUser.id}`);
        const data = await res.json();
        setMessages(data);
        if (isOpen) {
          await fetch(`${API_URL}/api/chat/read/${contactUser.id}/${currentUser.id}`, { method: 'PUT' });
          setUnreadCount(0);
        }
      } catch (err) {
        console.error('Failed to fetch chat history', err);
      }
    };

    if (isOpen || !isFloating) fetchHistory();
  }, [currentUser, contactUser, isOpen, isFloating]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim() || !contactUser) return;
    socketRef.current.emit('send_message', {
      senderId: currentUser.id,
      receiverId: contactUser.id,
      content: inputValue
    });
    setInputValue('');
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen) setUnreadCount(0);
  };

  const contactName = contactUser?.fullname || contactUser?.name || 'User';
  const contactInitials = getInitials(contactUser);

  const renderMessages = () => (
    <div className="cw-messages">
      {messages.length === 0 ? (
        <div className="cw-empty">
          <div className="cw-empty-avatar">{contactInitials}</div>
          <p>เริ่มการสนทนากับ {contactName}</p>
        </div>
      ) : (
        messages.map((msg, idx) => {
          const isSent = msg.senderId === currentUser.id;
          return (
            <div key={idx} className={`cw-msg ${isSent ? 'cw-msg--sent' : 'cw-msg--received'}`}>
              {!isSent && (
                <div className="cw-avatar cw-avatar--sm">{contactInitials}</div>
              )}
              <div className="cw-msg-body">
                <div className="cw-bubble">{msg.content}</div>
                <div className="cw-time">
                  {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );

  const renderInput = () => (
    <form className="cw-input-area" onSubmit={handleSend}>
      <input
        type="text"
        className="cw-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="พิมพ์ข้อความ..."
        autoComplete="off"
      />
      <button type="submit" className="cw-send-btn" disabled={!inputValue.trim()}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </button>
    </form>
  );

  if (!isFloating) {
    return (
      <div className="cw-embedded">
        <div className="cw-header">
          <div className="cw-header-info">
            <div className="cw-avatar">{contactInitials}</div>
            <div>
              <div className="cw-header-name">{contactName}</div>
              <div className="cw-header-status">
                <span className="cw-status-dot"></span>
                ออนไลน์
              </div>
            </div>
          </div>
          {onClose && (
            <button className="cw-icon-btn" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
        </div>
        {renderMessages()}
        {renderInput()}
      </div>
    );
  }

  return (
    <div className="cw-fab-wrapper">
      {isOpen && (
        <div className="cw-window">
          <div className="cw-header">
            <div className="cw-header-info">
              <div className="cw-avatar">{contactInitials}</div>
              <div>
                <div className="cw-header-name">{contactName}</div>
                <div className="cw-header-status">
                  <span className="cw-status-dot"></span>
                  ออนไลน์
                </div>
              </div>
            </div>
            <button className="cw-icon-btn" onClick={toggleOpen}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
          </div>
          {renderMessages()}
          {renderInput()}
        </div>
      )}

      <button className="cw-fab" onClick={toggleOpen}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        {unreadCount > 0 && <span className="cw-badge">{unreadCount}</span>}
      </button>
    </div>
  );
};

export default ChatWidget;
