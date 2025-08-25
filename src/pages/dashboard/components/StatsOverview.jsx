import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsOverview = ({ 
  stats = {}
}) => {
  const mockStats = {
    totalQuizzes: 47,
    winRate: 68.5,
    totalEarnings: 12450,
    currentStreak: 5,
    bestStreak: 12,
    averageScore: 8.2,
    rank: 156,
    totalPlayers: 2847,
    ...stats
  };

  const statCards = [
    {
      id: 'quizzes',
      title: 'Quizzes Jogados',
      value: mockStats?.totalQuizzes,
      icon: 'Target',
      color: 'var(--color-primary)',
      suffix: ''
    },
    {
      id: 'winrate',
      title: 'Taxa de Vitória',
      value: mockStats?.winRate,
      icon: 'TrendingUp',
      color: 'var(--color-success)',
      suffix: '%'
    },
    {
      id: 'earnings',
      title: 'Ganhos Totais',
      value: mockStats?.totalEarnings,
      icon: 'Coins',
      color: 'var(--color-warning)',
      suffix: '',
      format: 'currency'
    },
    {
      id: 'streak',
      title: 'Sequência Atual',
      value: mockStats?.currentStreak,
      icon: 'Flame',
      color: 'var(--color-error)',
      suffix: '',
      subtitle: `Melhor: ${mockStats?.bestStreak}`
    },
    {
      id: 'average',
      title: 'Pontuação Média',
      value: mockStats?.averageScore,
      icon: 'Star',
      color: 'var(--color-accent)',
      suffix: '/10'
    },
    {
      id: 'rank',
      title: 'Classificação',
      value: mockStats?.rank,
      icon: 'Trophy',
      color: 'var(--color-primary)',
      suffix: '',
      subtitle: `de ${mockStats?.totalPlayers?.toLocaleString('pt-BR')}`
    }
  ];

  const formatValue = (value, format) => {
    if (format === 'currency') {
      return value?.toLocaleString('pt-BR');
    }
    return value?.toLocaleString('pt-BR');
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Estatísticas
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statCards?.map((stat) => (
          <div 
            key={stat?.id}
            className="bg-muted rounded-lg p-4 gaming-transition gaming-hover"
          >
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={stat?.icon} size={16} color={stat?.color} />
              <span className="text-xs font-medium text-muted-foreground">
                {stat?.title}
              </span>
            </div>
            
            <div className="flex items-baseline space-x-1">
              <span className="text-xl font-bold text-card-foreground font-mono">
                {formatValue(stat?.value, stat?.format)}
              </span>
              {stat?.suffix && (
                <span className="text-sm text-muted-foreground">
                  {stat?.suffix}
                </span>
              )}
            </div>

            {stat?.subtitle && (
              <div className="text-xs text-muted-foreground mt-1">
                {stat?.subtitle}
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Performance Indicator */}
      <div className="mt-4 p-3 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-card-foreground">
            Performance Geral
          </span>
          <span className="text-sm font-bold text-success">
            Excelente
          </span>
        </div>
        
        <div className="w-full bg-background rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-success to-accent h-2 rounded-full gaming-transition"
            style={{ width: `${mockStats?.winRate}%` }}
          />
        </div>
        
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Iniciante</span>
          <span>Profissional</span>
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;