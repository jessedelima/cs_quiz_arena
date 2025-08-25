import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const UserProfileCard = ({ 
  user = {},
  coinBalance = 0,
  onDeposit = () => {},
  onProfileClick = () => {}
}) => {
  const mockUser = {
    steamId: "76561198123456789",
    username: "CS_ProPlayer_BR",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    level: 42,
    country: "BR",
    memberSince: "2019-03-15",
    gamesOwned: 247,
    hoursPlayed: 2847,
    ...user
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 gaming-transition gaming-hover">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary gaming-glow">
            <Image
              src={mockUser?.avatar}
              alt={`Avatar de ${mockUser?.username}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card flex items-center justify-center">
            <Icon name="Zap" size={12} color="white" />
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-card-foreground truncate">
              {mockUser?.username}
            </h3>
            <div className="flex items-center space-x-1 bg-primary/20 px-2 py-1 rounded-full">
              <Icon name="Star" size={12} color="var(--color-primary)" />
              <span className="text-xs font-medium text-primary">
                Nível {mockUser?.level}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-1">
              <Icon name="MapPin" size={14} />
              <span>Brasil</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>Desde Mar 2019</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-accent">{mockUser?.gamesOwned}</div>
              <div className="text-xs text-muted-foreground">Jogos</div>
            </div>
            <div className="text-center p-2 bg-muted rounded-lg">
              <div className="text-lg font-bold text-warning">{mockUser?.hoursPlayed?.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Horas</div>
            </div>
          </div>
        </div>
      </div>
      {/* Coin Balance */}
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Icon name="Coins" size={20} color="var(--color-warning)" />
            <span className="text-sm font-medium text-muted-foreground">Saldo Atual</span>
          </div>
          <div className="text-2xl font-bold text-warning font-mono">
            {coinBalance?.toLocaleString('pt-BR')}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={onDeposit}
            className="flex-1"
          >
            Depositar
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="User"
            onClick={onProfileClick}
          >
            Perfil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileCard;