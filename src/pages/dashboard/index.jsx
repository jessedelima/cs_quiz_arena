import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NotificationSystem from '../../components/ui/NotificationSystem';
import UserProfileCard from './components/UserProfileCard';
import LobbyCard from './components/LobbyCard';
import ActivityTimeline from './components/ActivityTimeline';
import QuickActions from './components/QuickActions';
import LobbyFilters from './components/LobbyFilters';
import StatsOverview from './components/StatsOverview';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [joiningLobby, setJoiningLobby] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [lobbyFilters, setLobbyFilters] = useState({
    difficulty: 'all',
    entryFee: 'all',
    players: 'all'
  });

  // Mock user data
  const mockUser = {
    steamId: "76561198123456789",
    username: "CS_ProPlayer_BR",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face",
    level: 42,
    country: "BR",
    memberSince: "2019-03-15",
    gamesOwned: 247,
    hoursPlayed: 2847
  };

  const [coinBalance, setCoinBalance] = useState(1250);

  // Mock lobbies data
  const mockLobbies = [
    {
      id: 1,
      name: "Quiz CS2 - Mapas Clássicos",
      difficulty: "Médio",
      entryFee: 50,
      prizePool: 450,
      currentPlayers: 6,
      maxPlayers: 10,
      isHot: true,
      startTime: "2min"
    },
    {
      id: 2,
      name: "Conhecimento Geral CS",
      difficulty: "Fácil",
      entryFee: 25,
      prizePool: 200,
      currentPlayers: 3,
      maxPlayers: 8,
      isHot: false,
      startTime: "5min"
    },
    {
      id: 3,
      name: "Quiz Pro - Estratégias",
      difficulty: "Difícil",
      entryFee: 100,
      prizePool: 900,
      currentPlayers: 8,
      maxPlayers: 12,
      isHot: true,
      startTime: "1min"
    },
    {
      id: 4,
      name: "Armas e Equipamentos",
      difficulty: "Médio",
      entryFee: 75,
      prizePool: 600,
      currentPlayers: 4,
      maxPlayers: 10,
      isHot: false,
      startTime: "3min"
    },
    {
      id: 5,
      name: "História do Counter-Strike",
      difficulty: "Fácil",
      entryFee: 0,
      prizePool: 150,
      currentPlayers: 12,
      maxPlayers: 15,
      isHot: false,
      startTime: "7min"
    },
    {
      id: 6,
      name: "Quiz Rápido - 5min",
      difficulty: "Médio",
      entryFee: 30,
      prizePool: 240,
      currentPlayers: 2,
      maxPlayers: 6,
      isHot: false,
      startTime: "Agora"
    }
  ];

  // Mock activities data
  const mockActivities = [
    {
      id: 1,
      type: 'quiz_win',
      description: 'Vitória no "Quiz CS2 - Mapas Clássicos"',
      amount: 225,
      timestamp: new Date(Date.now() - 300000),
      status: 'completed'
    },
    {
      id: 2,
      type: 'deposit',
      description: 'Depósito via PIX',
      amount: 500,
      timestamp: new Date(Date.now() - 1800000),
      status: 'completed'
    },
    {
      id: 3,
      type: 'quiz_loss',
      description: 'Quiz "Estratégias Pro" finalizado',
      amount: -50,
      timestamp: new Date(Date.now() - 3600000),
      status: 'completed'
    },
    {
      id: 4,
      type: 'trade_offer',
      description: 'Oferta de troca recebida',
      amount: 0,
      timestamp: new Date(Date.now() - 7200000),
      status: 'pending'
    },
    {
      id: 5,
      type: 'skin_deposit',
      description: 'AK-47 Redline depositada',
      amount: 150,
      timestamp: new Date(Date.now() - 10800000),
      status: 'completed'
    }
  ];

  // Mock notifications
  const mockNotifications = [
    {
      id: 1,
      type: 'lobby-invite',
      title: 'Convite para Lobby',
      message: 'Você foi convidado para "Quiz Pro - Estratégias"',
      actions: [
        { label: 'Aceitar', variant: 'default' },
        { label: 'Recusar', variant: 'outline' }
      ],
      autoClose: false
    },
    {
      id: 2,
      type: 'quiz-result',
      title: 'Quiz Finalizado',
      message: 'Você ganhou 225 moedas no último quiz!',
      duration: 5000
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
      setNotifications(mockNotifications);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleJoinLobby = async (lobbyId) => {
    setJoiningLobby(lobbyId);
    
    // Simulate API call
    setTimeout(() => {
      setJoiningLobby(null);
      navigate('/quiz-lobby', { state: { lobbyId } });
    }, 1500);
  };

  const handleDeposit = () => {
    // Mock deposit functionality
    const newNotification = {
      id: Date.now(),
      type: 'success',
      title: 'Depósito Realizado',
      message: 'Suas moedas foram adicionadas com sucesso!',
      duration: 3000
    };
    setNotifications(prev => [...prev, newNotification]);
    setCoinBalance(prev => prev + 500);
  };

  const handleProfileClick = () => {
    navigate('/profile-settings');
  };

  const handleNotificationDismiss = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  const handleNotificationAction = (notificationId, action) => {
    if (action?.label === 'Aceitar') {
      navigate('/quiz-lobby');
    }
    handleNotificationDismiss(notificationId);
  };

  const filterLobbies = (lobbies) => {
    return lobbies?.filter(lobby => {
      if (lobbyFilters?.difficulty !== 'all' && lobby?.difficulty?.toLowerCase() !== lobbyFilters?.difficulty) {
        return false;
      }
      
      if (lobbyFilters?.entryFee !== 'all') {
        switch (lobbyFilters?.entryFee) {
          case 'free':
            if (lobby?.entryFee > 0) return false;
            break;
          case 'low':
            if (lobby?.entryFee >= 100) return false;
            break;
          case 'medium':
            if (lobby?.entryFee < 100 || lobby?.entryFee > 500) return false;
            break;
          case 'high':
            if (lobby?.entryFee <= 500) return false;
            break;
        }
      }

      if (lobbyFilters?.players !== 'all') {
        const fillRate = lobby?.currentPlayers / lobby?.maxPlayers;
        switch (lobbyFilters?.players) {
          case 'available':
            if (fillRate >= 0.8) return false;
            break;
          case 'filling':
            if (fillRate < 0.3 || fillRate >= 0.8) return false;
            break;
          case 'almost-full':
            if (fillRate < 0.8) return false;
            break;
        }
      }

      return true;
    });
  };

  const filteredLobbies = filterLobbies(mockLobbies);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader user={mockUser} balance={coinBalance} notifications={notifications} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={mockUser} 
        balance={coinBalance} 
        notifications={notifications}
        onNavigate={(path) => navigate(path)}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta, {mockUser?.username}! 👋
            </h1>
            <p className="text-muted-foreground">
              Pronto para testar seus conhecimentos em Counter-Strike?
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Left Sidebar */}
            <div className="lg:col-span-3 space-y-6">
              <UserProfileCard
                user={mockUser}
                coinBalance={coinBalance}
                onDeposit={handleDeposit}
                onProfileClick={handleProfileClick}
              />
              <QuickActions
                onInventoryClick={() => navigate('/profile-settings')}
                onTradeUrlClick={() => navigate('/profile-settings')}
                onDepositClick={handleDeposit}
                onWithdrawClick={() => {}}
              />
              <StatsOverview />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-6">
              <LobbyFilters
                onFilterChange={setLobbyFilters}
                activeFilters={lobbyFilters}
                lobbyCount={filteredLobbies?.length}
              />

              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Lobbies Ativos
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="RefreshCw"
                    onClick={() => window.location?.reload()}
                  >
                    Atualizar
                  </Button>
                </div>

                <div className="grid gap-4">
                  {filteredLobbies?.map((lobby) => (
                    <LobbyCard
                      key={lobby?.id}
                      lobby={lobby}
                      onJoin={handleJoinLobby}
                      isJoining={joiningLobby === lobby?.id}
                    />
                  ))}
                </div>

                {filteredLobbies?.length === 0 && (
                  <div className="text-center py-12 bg-card border border-border rounded-lg">
                    <Icon name="Search" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-card-foreground mb-2">
                      Nenhum lobby encontrado
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Tente ajustar os filtros ou aguarde novos lobbies
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setLobbyFilters({ difficulty: 'all', entryFee: 'all', players: 'all' })}
                    >
                      Limpar Filtros
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-3">
              <ActivityTimeline activities={mockActivities} />
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6">
            <UserProfileCard
              user={mockUser}
              coinBalance={coinBalance}
              onDeposit={handleDeposit}
              onProfileClick={handleProfileClick}
            />

            <QuickActions
              onInventoryClick={() => navigate('/profile-settings')}
              onTradeUrlClick={() => navigate('/profile-settings')}
              onDepositClick={handleDeposit}
              onWithdrawClick={() => {}}
            />

            <LobbyFilters
              onFilterChange={setLobbyFilters}
              activeFilters={lobbyFilters}
              lobbyCount={filteredLobbies?.length}
            />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">
                  Lobbies Ativos
                </h2>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="RefreshCw"
                  onClick={() => window.location?.reload()}
                >
                  Atualizar
                </Button>
              </div>

              <div className="space-y-4">
                {filteredLobbies?.map((lobby) => (
                  <LobbyCard
                    key={lobby?.id}
                    lobby={lobby}
                    onJoin={handleJoinLobby}
                    isJoining={joiningLobby === lobby?.id}
                  />
                ))}
              </div>

              {filteredLobbies?.length === 0 && (
                <div className="text-center py-8 bg-card border border-border rounded-lg">
                  <Icon name="Search" size={40} color="var(--color-muted-foreground)" className="mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-card-foreground mb-2">
                    Nenhum lobby encontrado
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tente ajustar os filtros
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLobbyFilters({ difficulty: 'all', entryFee: 'all', players: 'all' })}
                  >
                    Limpar Filtros
                  </Button>
                </div>
              )}
            </div>

            <StatsOverview />
            <ActivityTimeline activities={mockActivities} />
          </div>
        </div>
      </main>
      <NotificationSystem
        notifications={notifications}
        onDismiss={handleNotificationDismiss}
        onAction={handleNotificationAction}
        position="top-right"
        maxVisible={3}
      />
    </div>
  );
};

export default Dashboard;