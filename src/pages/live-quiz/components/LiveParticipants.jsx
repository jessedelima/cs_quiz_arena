import React from 'react';
import Icon from '../../../components/AppIcon';

const LiveParticipants = ({ 
  participants = [],
  currentQuestion = 1,
  showAnswerStatus = false
}) => {
  const getAnswerStatusIcon = (status) => {
    switch (status) {
      case 'answered':
        return { name: 'Check', color: 'var(--color-success)' };
      case 'thinking':
        return { name: 'Clock', color: 'var(--color-warning)' };
      case 'timeout':
        return { name: 'X', color: 'var(--color-error)' };
      default:
        return { name: 'User', color: 'var(--color-muted-foreground)' };
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-card-foreground">
          Participantes Ativos
        </h3>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm text-success font-medium">
            {participants?.length} online
          </span>
        </div>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {participants?.map((participant, index) => {
          const statusIcon = getAnswerStatusIcon(participant?.answerStatus);
          
          return (
            <div 
              key={participant?.id}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="var(--color-muted-foreground)" />
                  </div>
                  {showAnswerStatus && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-card rounded-full border border-border flex items-center justify-center">
                      <Icon 
                        name={statusIcon?.name} 
                        size={10} 
                        color={statusIcon?.color}
                      />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-card-foreground truncate">
                    {participant?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    #{index + 1} • {participant?.score} pts
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {participant?.streak > 0 && (
                  <div className="flex items-center space-x-1 bg-warning/20 px-2 py-1 rounded-full">
                    <Icon name="Flame" size={12} color="var(--color-warning)" />
                    <span className="text-xs font-medium text-warning">
                      {participant?.streak}
                    </span>
                  </div>
                )}
                
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-accent">
                    {participant?.score}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {participant?.correctAnswers}/{currentQuestion - 1}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {participants?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Users" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
          <p className="text-muted-foreground">
            Aguardando participantes...
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveParticipants;