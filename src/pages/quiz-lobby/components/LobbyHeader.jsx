import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LobbyHeader = ({ 
  lobbyData = {},
  timeRemaining = 0,
  onLeaveLobby = () => {},
  isHost = false 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
        return 'text-success';
      case 'médio':
        return 'text-warning';
      case 'difícil':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border-b border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onLeaveLobby}
            className="text-muted-foreground hover:text-foreground"
          >
            <Icon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {lobbyData?.name || 'Lobby CS Quiz'}
            </h1>
            {isHost && (
              <span className="text-xs text-primary font-medium">
                Você é o host
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-success">Ao vivo</span>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Coins" size={16} color="var(--color-warning)" />
            <span className="text-xs text-muted-foreground">Taxa de Entrada</span>
          </div>
          <span className="text-lg font-bold text-warning font-mono">
            {lobbyData?.entryFee?.toLocaleString('pt-BR') || '0'} coins
          </span>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Trophy" size={16} color="var(--color-accent)" />
            <span className="text-xs text-muted-foreground">Prêmio Total</span>
          </div>
          <span className="text-lg font-bold text-accent font-mono">
            {lobbyData?.prizePool?.toLocaleString('pt-BR') || '0'} coins
          </span>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Target" size={16} color="var(--color-primary)" />
            <span className="text-xs text-muted-foreground">Dificuldade</span>
          </div>
          <span className={`text-lg font-bold ${getDifficultyColor(lobbyData?.difficulty)}`}>
            {lobbyData?.difficulty || 'Médio'}
          </span>
        </div>

        <div className="bg-background rounded-lg p-3 border border-border">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Clock" size={16} color="var(--color-error)" />
            <span className="text-xs text-muted-foreground">Início em</span>
          </div>
          <span className="text-lg font-bold text-error font-mono">
            {formatTime(timeRemaining)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LobbyHeader;