import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const LeaderboardTable = ({ players, currentUserId, onPlayerClick }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return { name: 'Crown', color: 'var(--color-warning)' };
    if (rank === 2) return { name: 'Medal', color: 'var(--color-muted-foreground)' };
    if (rank === 3) return { name: 'Award', color: 'var(--color-warning)' };
    return null;
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return { name: 'TrendingUp', color: 'var(--color-success)' };
    if (trend < 0) return { name: 'TrendingDown', color: 'var(--color-error)' };
    return { name: 'Minus', color: 'var(--color-muted-foreground)' };
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Posição</th>
              <th className="text-left p-4 text-sm font-medium text-muted-foreground">Jogador</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Ganhos Totais</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Jogos</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Taxa de Vitória</th>
              <th className="text-right p-4 text-sm font-medium text-muted-foreground">Tendência</th>
            </tr>
          </thead>
          <tbody>
            {players?.map((player) => {
              const isCurrentUser = player?.id === currentUserId;
              const rankIcon = getRankIcon(player?.rank);
              const trendIcon = getTrendIcon(player?.trend);
              
              return (
                <tr
                  key={player?.id}
                  onClick={() => onPlayerClick(player)}
                  className={`
                    border-b border-border cursor-pointer gaming-transition hover:bg-muted/50
                    ${isCurrentUser ? 'bg-primary/10 border-primary/20' : ''}
                  `}
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <span className={`
                        font-bold text-lg
                        ${isCurrentUser ? 'text-primary' : 'text-card-foreground'}
                      `}>
                        #{player?.rank}
                      </span>
                      {rankIcon && (
                        <Icon name={rankIcon?.name} size={16} color={rankIcon?.color} />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-border">
                        <Image
                          src={player?.avatar}
                          alt={player?.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className={`
                          font-medium
                          ${isCurrentUser ? 'text-primary' : 'text-card-foreground'}
                        `}>
                          {player?.username}
                          {isCurrentUser && (
                            <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                              Você
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Steam ID: {player?.steamId}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-mono font-medium text-success">
                      {formatCurrency(player?.totalWinnings)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="text-card-foreground">
                      {player?.gamesPlayed?.toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-medium text-card-foreground">
                      {formatPercentage(player?.winRate)}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Icon name={trendIcon?.name} size={16} color={trendIcon?.color} />
                      <span className="text-sm text-muted-foreground">
                        {Math.abs(player?.trend)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Mobile Cards */}
      <div className="md:hidden space-y-3 p-4">
        {players?.map((player) => {
          const isCurrentUser = player?.id === currentUserId;
          const rankIcon = getRankIcon(player?.rank);
          const trendIcon = getTrendIcon(player?.trend);
          
          return (
            <div
              key={player?.id}
              onClick={() => onPlayerClick(player)}
              className={`
                p-4 rounded-lg border gaming-transition cursor-pointer
                ${isCurrentUser 
                  ? 'bg-primary/10 border-primary/20 gaming-glow' :'bg-background border-border hover:bg-muted/50'
                }
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <span className={`
                      font-bold text-lg
                      ${isCurrentUser ? 'text-primary' : 'text-foreground'}
                    `}>
                      #{player?.rank}
                    </span>
                    {rankIcon && (
                      <Icon name={rankIcon?.name} size={16} color={rankIcon?.color} />
                    )}
                  </div>
                  
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
                    <Image
                      src={player?.avatar}
                      alt={player?.username}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <div className={`
                      font-medium
                      ${isCurrentUser ? 'text-primary' : 'text-foreground'}
                    `}>
                      {player?.username}
                    </div>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                        Você
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Icon name={trendIcon?.name} size={16} color={trendIcon?.color} />
                  <span className="text-sm text-muted-foreground">
                    {Math.abs(player?.trend)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Ganhos</div>
                  <div className="font-mono text-sm font-medium text-success">
                    {formatCurrency(player?.totalWinnings)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Jogos</div>
                  <div className="text-sm font-medium text-foreground">
                    {player?.gamesPlayed?.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Taxa</div>
                  <div className="text-sm font-medium text-foreground">
                    {formatPercentage(player?.winRate)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardTable;