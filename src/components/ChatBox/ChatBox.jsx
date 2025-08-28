import React, { useState, useRef, useEffect } from 'react';
import './ChatBox.css';

/**
 * Componente ChatBox
 * 
 * Este componente exibe uma caixa de chat com mensagens e permite enviar novas mensagens.
 * 
 * @param {Array} messages - Lista de mensagens do chat
 * @param {Function} onSendMessage - Função chamada ao enviar uma mensagem
 * @param {string} currentUserId - ID do usuário atual
 */
const ChatBox = ({ messages = [], onSendMessage, currentUserId }) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  // Rola para a última mensagem quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Função para rolar para o final da lista de mensagens
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Manipulador para enviar mensagem
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() && onSendMessage) {
      onSendMessage(newMessage);
      setNewMessage('');
    }
  };
  
  // Formata a hora da mensagem
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="chat-box">
      <div className="chat-box__messages">
        {messages.length === 0 ? (
          <div className="chat-box__empty">
            <p>Nenhuma mensagem ainda. Seja o primeiro a dizer olá!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={`${msg.timestamp}-${index}`} 
              className={`chat-box__message ${
                msg.type === 'system' 
                  ? 'chat-box__message--system' 
                  : msg.userId === currentUserId 
                    ? 'chat-box__message--self' 
                    : 'chat-box__message--other'
              }`}
            >
              {msg.type === 'system' ? (
                <div className="chat-box__system-message">
                  <span className="chat-box__message-text">{msg.message}</span>
                  <span className="chat-box__message-time">{formatTime(msg.timestamp)}</span>
                </div>
              ) : (
                <>
                  <div className="chat-box__message-header">
                    <span className="chat-box__message-sender">
                      {msg.userId === currentUserId ? 'Você' : msg.username}
                    </span>
                    <span className="chat-box__message-time">{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="chat-box__message-content">
                    <span className="chat-box__message-text">{msg.message}</span>
                  </div>
                </>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form className="chat-box__input-area" onSubmit={handleSendMessage}>
        <input
          type="text"
          className="chat-box__input"
          placeholder="Digite sua mensagem..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          maxLength={200}
        />
        <button 
          type="submit" 
          className="chat-box__send-button"
          disabled={!newMessage.trim()}
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default ChatBox;