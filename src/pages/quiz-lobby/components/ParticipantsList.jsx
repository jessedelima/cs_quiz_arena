import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ParticipantsList = ({ 
  participants = [],
  currentUserId = null,
  isHost = false,
  maxPlayers = 8,
  onKickPlayer = () => {},
  onToggleReady = () => {}
}) => {
  const currentUser = participants?.find(p => p?.id === currentUserId);
  const isCurrentUserReady = currentUser?.isReady || false;

  const getReadyStatusColor = (isReady) => {
    return isReady ? 'text-success' : 'text-warning';
  };

  const getReadyStatusIcon = (isReady) => {
    return isReady ? 'CheckCircle' : 'Clock';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Participantes
        </h2>
        <div className="flex items-center space-x-2">
          <div className="w-full bg-muted rounded-full h-2 max-w-24">
            <div 
              className="bg-primary h-2 rounded-full gaming-transition"
              style={{ width: `${(participants?.length / maxPlayers) * 100}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground font-mono">
            {participants?.length}/{maxPlayers}
          </span>
        </div>
      </div>
      <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
        {participants?.map((participant) => (
          <div 
            key={participant?.id}
            className="flex items-center justify-between p-3 bg-background rounded-lg border border-border gaming-transition hover:border-primary/30"
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Image
                  src={participant?.avatar}
                  alt={participant?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${participant?.isOnline ? 'bg-success' : 'bg-muted'}`} />
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-foreground">
                    {participant?.username}
                  </span>
                  {participant?.id === currentUserId && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                      Você
                    </span>
                  )}
                  {participant?.isHost && (
                    <Icon name="Crown" size={14} color="var(--color-warning)" />
                  )}
                </div>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>Nível {participant?.level || 1}</span>
                  <span>•</span>
                  <span>{participant?.wins || 0} vitórias</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Icon 
                  name={getReadyStatusIcon(participant?.isReady)} 
                  size={16} 
                  color={`var(--color-${participant?.isReady ? 'success' : 'warning'})`}
                />
                <span className={`text-sm font-medium ${getReadyStatusColor(participant?.isReady)}`}>
                  {participant?.isReady ? 'Pronto' : 'Aguardando'}
                </span>
              </div>

              {isHost && participant?.id !== currentUserId && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onKickPlayer(participant?.id)}
                  className="h-8 w-8 text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="UserX" size={14} />
                </Button>
              )}
            </div>
          </div>
        ))}

        {/* Empty slots */}
        {Array.from({ length: maxPlayers - participants?.length })?.map((_, index) => (
          <div 
            key={`empty-${index}`}
            className="flex items-center justify-center p-3 bg-muted/30 rounded-lg border-2 border-dashed border-muted"
          >
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Icon name="UserPlus" size={16} />
              <span className="text-sm">Aguardando jogador...</span>
            </div>
          </div>
        ))}
      </div>
      {/* Ready Toggle Button */}
      <Button
        variant={isCurrentUserReady ? "outline" : "default"}
        fullWidth
        onClick={onToggleReady}
        iconName={isCurrentUserReady ? "X" : "Check"}
        iconPosition="left"
      >
        {isCurrentUserReady ? 'Cancelar Pronto' : 'Estou Pronto'}
      </Button>
    </div>
  );
};

export default ParticipantsList;