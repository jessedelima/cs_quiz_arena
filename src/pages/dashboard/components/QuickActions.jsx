import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';


const QuickActions = ({ 
  onInventoryClick = () => {},
  onTradeUrlClick = () => {},
  onDepositClick = () => {},
  onWithdrawClick = () => {}
}) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      id: 'inventory',
      title: 'Inventário',
      description: 'Gerencie suas skins',
      icon: 'Package',
      color: 'var(--color-primary)',
      onClick: onInventoryClick
    },
    {
      id: 'trade-url',
      title: 'URL de Troca',
      description: 'Configure sua URL',
      icon: 'Link',
      color: 'var(--color-accent)',
      onClick: onTradeUrlClick
    },
    {
      id: 'deposit',
      title: 'Depositar',
      description: 'Adicionar moedas',
      icon: 'Plus',
      color: 'var(--color-success)',
      onClick: onDepositClick
    },
    {
      id: 'withdraw',
      title: 'Sacar',
      description: 'Retirar fundos',
      icon: 'Minus',
      color: 'var(--color-warning)',
      onClick: onWithdrawClick
    },
    {
      id: 'leaderboards',
      title: 'Rankings',
      description: 'Ver classificação',
      icon: 'Trophy',
      color: 'var(--color-error)',
      onClick: () => navigate('/leaderboards')
    },
    {
      id: 'profile',
      title: 'Perfil',
      description: 'Configurações',
      icon: 'User',
      color: 'var(--color-muted-foreground)',
      onClick: () => navigate('/profile-settings')
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-semibold text-card-foreground">
          Ações Rápidas
        </h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={action?.onClick}
            className="p-4 bg-muted rounded-lg gaming-transition gaming-hover text-left group"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center group-hover:scale-110 gaming-transition">
                <Icon name={action?.icon} size={20} color={action?.color} />
              </div>
            </div>
            
            <h4 className="text-sm font-medium text-card-foreground mb-1">
              {action?.title}
            </h4>
            <p className="text-xs text-muted-foreground">
              {action?.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;