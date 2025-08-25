import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimeline = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'quiz_win':
        return { name: 'Trophy', color: 'var(--color-success)' };
      case 'quiz_loss':
        return { name: 'Target', color: 'var(--color-error)' };
      case 'deposit':
        return { name: 'Plus', color: 'var(--color-accent)' };
      case 'withdrawal':
        return { name: 'Minus', color: 'var(--color-warning)' };
      case 'trade_offer':
        return { name: 'ArrowRightLeft', color: 'var(--color-primary)' };
      case 'skin_deposit':
        return { name: 'Package', color: 'var(--color-success)' };
      default:
        return { name: 'Activity', color: 'var(--color-muted-foreground)' };
    }
  };

  const getActivityTitle = (activity) => {
    switch (activity?.type) {
      case 'quiz_win':
        return 'Vitória no Quiz';
      case 'quiz_loss':
        return 'Quiz Finalizado';
      case 'deposit':
        return 'Depósito Realizado';
      case 'withdrawal':
        return 'Saque Realizado';
      case 'trade_offer':
        return 'Oferta de Troca';
      case 'skin_deposit':
        return 'Skin Depositada';
      default:
        return 'Atividade';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora mesmo';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h atrás`;
    return `${Math.floor(diffInMinutes / 1440)}d atrás`;
  };

  if (activities?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 text-center">
        <Icon name="Activity" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
        <h3 className="text-lg font-medium text-card-foreground mb-2">
          Nenhuma Atividade
        </h3>
        <p className="text-sm text-muted-foreground">
          Suas atividades recentes aparecerão aqui
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Activity" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Atividade Recente
        </h3>
      </div>
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities?.map((activity, index) => {
          const icon = getActivityIcon(activity?.type);
          const isLast = index === activities?.length - 1;

          return (
            <div key={activity?.id} className="relative">
              {/* Timeline Line */}
              {!isLast && (
                <div className="absolute left-5 top-10 w-0.5 h-8 bg-border" />
              )}
              <div className="flex items-start space-x-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Icon name={icon?.name} size={16} color={icon?.color} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-card-foreground">
                        {getActivityTitle(activity)}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {activity?.description}
                      </p>
                    </div>

                    {/* Amount */}
                    {activity?.amount && (
                      <div className={`text-sm font-mono font-medium ${
                        activity?.amount > 0 ? 'text-success' : 'text-error'
                      }`}>
                        {activity?.amount > 0 ? '+' : ''}{activity?.amount?.toLocaleString('pt-BR')}
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity?.timestamp)}
                    </span>

                    {/* Status Badge */}
                    {activity?.status && (
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity?.status === 'completed' ? 'bg-success/20 text-success' :
                        activity?.status === 'pending' ? 'bg-warning/20 text-warning' :
                        activity?.status === 'failed'? 'bg-error/20 text-error' : 'bg-muted text-muted-foreground'
                      }`}>
                        {activity?.status === 'completed' ? 'Concluído' :
                         activity?.status === 'pending' ? 'Pendente' :
                         activity?.status === 'failed' ? 'Falhou' : activity?.status}
                      </div>
                    )}
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

export default ActivityTimeline;