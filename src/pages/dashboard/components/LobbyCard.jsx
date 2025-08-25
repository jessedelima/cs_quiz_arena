import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LobbyCard = ({ 
  lobby = {},
  onJoin = () => {},
  isJoining = false
}) => {
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

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'fácil':
        return 'Circle';
      case 'médio':
        return 'CircleDot';
      case 'difícil':
        return 'Zap';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 gaming-transition gaming-hover">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-1">
            {lobby?.name}
          </h3>
          <div className="flex items-center space-x-2">
            <Icon 
              name={getDifficultyIcon(lobby?.difficulty)} 
              size={14} 
              color={`var(--color-${lobby?.difficulty?.toLowerCase() === 'fácil' ? 'success' : lobby?.difficulty?.toLowerCase() === 'médio' ? 'warning' : 'error'})`}
            />
            <span className={`text-sm font-medium ${getDifficultyColor(lobby?.difficulty)}`}>
              {lobby?.difficulty}
            </span>
          </div>
        </div>
        
        {lobby?.isHot && (
          <div className="bg-error/20 text-error px-2 py-1 rounded-full text-xs font-medium">
            🔥 Popular
          </div>
        )}
      </div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Coins" size={16} color="var(--color-warning)" />
            <span className="text-sm font-medium text-muted-foreground">Taxa</span>
          </div>
          <div className="text-lg font-bold text-warning font-mono">
            {lobby?.entryFee?.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="flex items-center justify-center space-x-1 mb-1">
            <Icon name="Trophy" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium text-muted-foreground">Prêmio</span>
          </div>
          <div className="text-lg font-bold text-accent font-mono">
            {lobby?.prizePool?.toLocaleString('pt-BR')}
          </div>
        </div>
      </div>
      {/* Players */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} color="var(--color-muted-foreground)" />
          <span className="text-sm text-muted-foreground">
            {lobby?.currentPlayers}/{lobby?.maxPlayers} jogadores
          </span>
        </div>
        
        <div className="flex items-center space-x-1">
          {Array.from({ length: Math.min(lobby?.currentPlayers || 0, 5) })?.map((_, index) => (
            <div 
              key={index}
              className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
            >
              <Icon name="User" size={12} color="white" />
            </div>
          ))}
          {(lobby?.currentPlayers || 0) > 5 && (
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-muted-foreground">
                +{(lobby?.currentPlayers || 0) - 5}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full gaming-transition"
            style={{ 
              width: `${((lobby?.currentPlayers || 0) / (lobby?.maxPlayers || 1)) * 100}%` 
            }}
          />
        </div>
      </div>
      {/* Action Button */}
      <Button
        variant="default"
        size="sm"
        fullWidth
        loading={isJoining}
        disabled={lobby?.currentPlayers >= lobby?.maxPlayers}
        onClick={() => onJoin(lobby?.id)}
        iconName={lobby?.currentPlayers >= lobby?.maxPlayers ? "Lock" : "Play"}
        iconPosition="left"
      >
        {lobby?.currentPlayers >= lobby?.maxPlayers ? 'Lobby Cheio' : 'Entrar no Quiz'}
      </Button>
      {/* Timing Info */}
      {lobby?.startTime && (
        <div className="mt-2 text-xs text-muted-foreground text-center">
          <Icon name="Clock" size={12} className="inline mr-1" />
          Inicia em {lobby?.startTime}
        </div>
      )}
    </div>
  );
};

export default LobbyCard;