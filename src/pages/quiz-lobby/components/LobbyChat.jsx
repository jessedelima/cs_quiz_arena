import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const LobbyChat = ({ 
  messages = [],
  currentUserId = null,
  onSendMessage = () => {},
  isConnected = true 
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e?.preventDefault();
    if (newMessage?.trim() && isConnected) {
      onSendMessage(newMessage?.trim());
      setNewMessage('');
      inputRef?.current?.focus();
    }
  };

  const formatMessageTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'join':
        return { name: 'UserPlus', color: 'var(--color-success)' };
      case 'leave':
        return { name: 'UserMinus', color: 'var(--color-error)' };
      case 'ready':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      case 'unready':
        return { name: 'Clock', color: 'var(--color-warning)' };
      default:
        return null;
    }
  };

  const MessageItem = ({ message }) => {
    const isCurrentUser = message?.userId === currentUserId;
    const isSystemMessage = message?.type !== 'message';
    const messageIcon = getMessageTypeIcon(message?.type);

    if (isSystemMessage) {
      return (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full">
            {messageIcon && (
              <Icon 
                name={messageIcon?.name} 
                size={12} 
                color={messageIcon?.color}
              />
            )}
            <span className="text-xs text-muted-foreground">
              {message?.content}
            </span>
            <span className="text-xs text-muted-foreground opacity-60">
              {formatMessageTime(message?.timestamp)}
            </span>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className={`flex items-start space-x-2 max-w-xs ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {!isCurrentUser && (
            <Image
              src={message?.avatar}
              alt={message?.username}
              className="w-6 h-6 rounded-full object-cover flex-shrink-0"
            />
          )}
          
          <div className={`${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'} rounded-lg px-3 py-2 border border-border`}>
            {!isCurrentUser && (
              <div className="text-xs font-medium mb-1 opacity-80">
                {message?.username}
              </div>
            )}
            <div className="text-sm break-words">
              {message?.content}
            </div>
            <div className={`text-xs mt-1 opacity-60 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
              {formatMessageTime(message?.timestamp)}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Chat do Lobby
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-error'}`} />
          <span className={`text-xs ${isConnected ? 'text-success' : 'text-error'}`}>
            {isConnected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mb-4 space-y-1 min-h-0">
        {messages?.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <Icon name="MessageCircle" size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhuma mensagem ainda</p>
              <p className="text-xs opacity-60">Seja o primeiro a conversar!</p>
            </div>
          </div>
        ) : (
          messages?.map((message) => (
            <MessageItem key={message?.id} message={message} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex space-x-2">
        <div className="flex-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder={isConnected ? "Digite sua mensagem..." : "Desconectado..."}
            value={newMessage}
            onChange={(e) => setNewMessage(e?.target?.value)}
            disabled={!isConnected}
            className="border-0 bg-background"
          />
        </div>
        <Button
          type="submit"
          variant="default"
          size="icon"
          disabled={!newMessage?.trim() || !isConnected}
          iconName="Send"
        />
      </form>
    </div>
  );
};

export default LobbyChat;