import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const PersonalStatsCard = ({ userStats, achievements }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(amount);
  };

  const formatPercentage = (value) => {
    return `${value?.toFixed(1)}%`;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return 'text-success';
    if (trend < 0) return 'text-error';
    return 'text-muted-foreground';
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) return 'TrendingUp';
    if (trend < 0) return 'TrendingDown';
    return 'Minus';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary gaming-glow">
          <Image
            src={userStats?.avatar}
            alt={userStats?.username}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-card-foreground">
            Suas Estatísticas
          </h2>
          <p className="text-muted-foreground">
            Posição Atual: #{userStats?.currentRank}
          </p>
        </div>
      </div>
      {/* Performance Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Ganhos Totais</span>
            <Icon name="TrendingUp" size={16} color="var(--color-success)" />
          </div>
          <div className="font-mono text-lg font-bold text-success">
            {formatCurrency(userStats?.totalWinnings)}
          </div>
          <div className={`text-xs flex items-center space-x-1 mt-1 ${getTrendColor(userStats?.earningsTrend)}`}>
            <Icon name={getTrendIcon(userStats?.earningsTrend)} size={12} />
            <span>{Math.abs(userStats?.earningsTrend)}% esta semana</span>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Taxa de Vitória</span>
            <Icon name="Target" size={16} color="var(--color-accent)" />
          </div>
          <div className="text-lg font-bold text-card-foreground">
            {formatPercentage(userStats?.winRate)}
          </div>
          <div className={`text-xs flex items-center space-x-1 mt-1 ${getTrendColor(userStats?.winRateTrend)}`}>
            <Icon name={getTrendIcon(userStats?.winRateTrend)} size={12} />
            <span>{Math.abs(userStats?.winRateTrend)}% esta semana</span>
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Jogos Disputados</span>
            <Icon name="Gamepad2" size={16} color="var(--color-warning)" />
          </div>
          <div className="text-lg font-bold text-card-foreground">
            {userStats?.gamesPlayed?.toLocaleString('pt-BR')}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            +{userStats?.recentGames} esta semana
          </div>
        </div>

        <div className="bg-background rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Melhor Streak</span>
            <Icon name="Zap" size={16} color="var(--color-primary)" />
          </div>
          <div className="text-lg font-bold text-card-foreground">
            {userStats?.bestStreak}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Atual: {userStats?.currentStreak}
          </div>
        </div>
      </div>
      {/* Recent Achievements */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-card-foreground mb-3 flex items-center space-x-2">
          <Icon name="Award" size={16} color="var(--color-warning)" />
          <span>Conquistas Recentes</span>
        </h3>
        <div className="space-y-2">
          {achievements?.slice(0, 3)?.map((achievement) => (
            <div key={achievement?.id} className="flex items-center space-x-3 p-2 bg-background rounded-lg border border-border">
              <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                <Icon name={achievement?.icon} size={16} color="var(--color-warning)" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-card-foreground">
                  {achievement?.title}
                </div>
                <div className="text-xs text-muted-foreground">
                  {achievement?.description}
                </div>
              </div>
              <div className="text-xs text-muted-foreground">
                {achievement?.dateEarned}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button className="flex-1 bg-primary text-primary-foreground py-2 px-4 rounded-lg text-sm font-medium gaming-transition hover:bg-primary/90 flex items-center justify-center space-x-2">
          <Icon name="Share" size={16} />
          <span>Compartilhar</span>
        </button>
        <button className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg text-sm font-medium gaming-transition hover:bg-secondary/90 flex items-center justify-center space-x-2">
          <Icon name="BarChart3" size={16} />
          <span>Detalhes</span>
        </button>
      </div>
    </div>
  );
};

export default PersonalStatsCard;