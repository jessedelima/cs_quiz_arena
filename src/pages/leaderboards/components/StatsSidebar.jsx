import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';

const StatsSidebar = ({ performanceData, comparisonData }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(value);
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-modal">
          <p className="text-sm text-popover-foreground font-medium">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry?.color }}>
              {entry?.name}: {entry?.name?.includes('Ganhos') ? formatCurrency(entry?.value) : entry?.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Performance Graph */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} color="var(--color-primary)" />
          <span>Performance Semanal</span>
        </h3>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="week" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="ganhos" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                name="Ganhos"
              />
              <Line 
                type="monotone" 
                dataKey="jogos" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                name="Jogos"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Achievement Gallery */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Award" size={20} color="var(--color-warning)" />
          <span>Galeria de Conquistas</span>
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: 'Crown', title: 'Primeiro Lugar', earned: true },
            { icon: 'Target', title: '100% Precisão', earned: true },
            { icon: 'Zap', title: 'Streak de 10', earned: true },
            { icon: 'Trophy', title: 'Campeão Mensal', earned: false },
            { icon: 'Star', title: 'Lenda', earned: false },
            { icon: 'Flame', title: 'Em Chamas', earned: true }
          ]?.map((achievement, index) => (
            <div
              key={index}
              className={`
                aspect-square rounded-lg border flex flex-col items-center justify-center p-2
                ${achievement?.earned 
                  ? 'bg-warning/20 border-warning/40' :'bg-muted border-border opacity-50'
                }
              `}
            >
              <Icon 
                name={achievement?.icon} 
                size={24} 
                color={achievement?.earned ? 'var(--color-warning)' : 'var(--color-muted-foreground)'} 
              />
              <span className={`
                text-xs text-center mt-1 font-medium
                ${achievement?.earned ? 'text-warning' : 'text-muted-foreground'}
              `}>
                {achievement?.title}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Comparison Tools */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-accent)" />
          <span>Comparação com Top 10</span>
        </h3>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis 
                dataKey="metric" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="voce" 
                fill="var(--color-primary)" 
                name="Você"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="top10" 
                fill="var(--color-muted)" 
                name="Média Top 10"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Compare seu desempenho com a média dos 10 melhores jogadores</p>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Activity" size={20} color="var(--color-success)" />
          <span>Estatísticas Rápidas</span>
        </h3>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Jogadores Ativos</span>
            <span className="text-sm font-medium text-card-foreground">2.847</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Jogos Hoje</span>
            <span className="text-sm font-medium text-card-foreground">1.234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Prêmio Total</span>
            <span className="text-sm font-medium text-success">{formatCurrency(45678.90)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Média de Precisão</span>
            <span className="text-sm font-medium text-card-foreground">73.2%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSidebar;