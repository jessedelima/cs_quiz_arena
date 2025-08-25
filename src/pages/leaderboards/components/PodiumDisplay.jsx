import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PodiumDisplay = ({ topPlayers }) => {
  const podiumPositions = [
    { position: 2, height: 'h-20', bgColor: 'bg-muted', textColor: 'text-muted-foreground' },
    { position: 1, height: 'h-28', bgColor: 'bg-primary', textColor: 'text-primary-foreground' },
    { position: 3, height: 'h-16', bgColor: 'bg-secondary', textColor: 'text-secondary-foreground' }
  ];

  const getPodiumPlayer = (position) => {
    return topPlayers?.find(player => player?.rank === position);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  return (
    <div className="mb-8 bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-bold text-card-foreground mb-6 text-center">
        🏆 Top 3 Jogadores
      </h2>
      <div className="flex items-end justify-center space-x-4 mb-6">
        {podiumPositions?.map((podium) => {
          const player = getPodiumPlayer(podium?.position);
          
          if (!player) return null;
          
          return (
            <div key={podium?.position} className="flex flex-col items-center">
              {/* Player Avatar */}
              <div className="relative mb-3">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border gaming-glow">
                  <Image
                    src={player?.avatar}
                    alt={player?.username}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Position Badge */}
                <div className={`
                  absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center
                  ${podium?.bgColor} ${podium?.textColor} border-2 border-background font-bold text-sm
                `}>
                  {podium?.position}
                </div>
              </div>
              {/* Player Info */}
              <div className="text-center mb-2">
                <h3 className="font-semibold text-card-foreground text-sm truncate max-w-20">
                  {player?.username}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {formatCurrency(player?.totalWinnings)}
                </p>
              </div>
              {/* Podium Base */}
              <div className={`
                w-20 ${podium?.height} ${podium?.bgColor} rounded-t-lg flex items-center justify-center
                border border-border
              `}>
                <Icon 
                  name={podium?.position === 1 ? 'Crown' : 'Award'} 
                  size={24} 
                  color={podium?.position === 1 ? 'var(--color-warning)' : 'var(--color-muted-foreground)'} 
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* Achievement Badges */}
      <div className="flex justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1 text-warning">
          <Icon name="Zap" size={14} />
          <span>Streak Master</span>
        </div>
        <div className="flex items-center space-x-1 text-success">
          <Icon name="Target" size={14} />
          <span>Precisão Perfeita</span>
        </div>
        <div className="flex items-center space-x-1 text-accent">
          <Icon name="TrendingUp" size={14} />
          <span>Em Alta</span>
        </div>
      </div>
    </div>
  );
};

export default PodiumDisplay;