import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NotificationSystem from '../../components/ui/NotificationSystem';
import LeaderboardTabs from './components/LeaderboardTabs';
import CategoryFilter from './components/CategoryFilter';
import PodiumDisplay from './components/PodiumDisplay';
import LeaderboardTable from './components/LeaderboardTable';
import PersonalStatsCard from './components/PersonalStatsCard';
import StatsSidebar from './components/StatsSidebar';
import LoadingState from './components/LoadingState';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const LeaderboardsPage = () => {
  const [activeTab, setActiveTab] = useState('weekly');
  const [selectedCategory, setSelectedCategory] = useState('overall');
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  // Mock current user data
  const currentUser = {
    id: 'user_123',
    username: 'ProGamer_BR',
    steamId: '76561198123456789',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    balance: 2450
  };

  // Mock leaderboard data
  const mockLeaderboardData = [
    {
      id: 'user_001',
      rank: 1,
      username: 'CS_Master_2024',
      steamId: '76561198987654321',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      totalWinnings: 15750.50,
      gamesPlayed: 342,
      winRate: 87.3,
      trend: 5
    },
    {
      id: 'user_002',
      rank: 2,
      username: 'AimBot_Destroyer',
      steamId: '76561198876543210',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      totalWinnings: 12890.25,
      gamesPlayed: 298,
      winRate: 84.1,
      trend: 2
    },
    {
      id: 'user_003',
      rank: 3,
      username: 'Clutch_King_BR',
      steamId: '76561198765432109',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      totalWinnings: 11234.75,
      gamesPlayed: 276,
      winRate: 81.9,
      trend: -1
    },
    {
      id: 'user_123',
      rank: 15,
      username: 'ProGamer_BR',
      steamId: '76561198123456789',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      totalWinnings: 5670.80,
      gamesPlayed: 156,
      winRate: 73.2,
      trend: 3
    },
    {
      id: 'user_004',
      rank: 4,
      username: 'Headshot_Hunter',
      steamId: '76561198654321098',
      avatar: 'https://randomuser.me/api/portraits/women/34.jpg',
      totalWinnings: 9876.40,
      gamesPlayed: 234,
      winRate: 79.5,
      trend: 1
    },
    {
      id: 'user_005',
      rank: 5,
      username: 'Smoke_Criminal',
      steamId: '76561198543210987',
      avatar: 'https://randomuser.me/api/portraits/men/23.jpg',
      totalWinnings: 8765.30,
      gamesPlayed: 198,
      winRate: 76.8,
      trend: -2
    }
  ];

  // Mock user stats
  const userStats = {
    avatar: currentUser?.avatar,
    username: currentUser?.username,
    currentRank: 15,
    totalWinnings: 5670.80,
    winRate: 73.2,
    gamesPlayed: 156,
    bestStreak: 12,
    currentStreak: 4,
    recentGames: 8,
    earningsTrend: 15.3,
    winRateTrend: 2.1
  };

  // Mock achievements
  const achievements = [
    {
      id: 1,
      title: 'Primeira Vitória',
      description: 'Ganhou seu primeiro quiz',
      icon: 'Trophy',
      dateEarned: '2 dias atrás'
    },
    {
      id: 2,
      title: 'Streak de Fogo',
      description: '5 vitórias consecutivas',
      icon: 'Flame',
      dateEarned: '1 semana atrás'
    },
    {
      id: 3,
      title: 'Conhecedor Expert',
      description: '100% de precisão em um quiz',
      icon: 'Target',
      dateEarned: '3 dias atrás'
    }
  ];

  // Mock performance data for charts
  const performanceData = [
    { week: 'Sem 1', ganhos: 450.50, jogos: 12 },
    { week: 'Sem 2', ganhos: 678.25, jogos: 18 },
    { week: 'Sem 3', ganhos: 892.75, jogos: 22 },
    { week: 'Sem 4', ganhos: 1234.80, jogos: 28 }
  ];

  const comparisonData = [
    { metric: 'Ganhos', voce: 5670, top10: 8950 },
    { metric: 'Jogos', voce: 156, top10: 245 },
    { metric: 'Taxa', voce: 73, top10: 82 }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Add welcome notification
    setNotifications([
      {
        id: 'welcome',
        type: 'info',
        title: 'Rankings Atualizados',
        message: 'Os rankings foram atualizados com os resultados mais recentes!',
        duration: 5000
      }
    ]);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePlayerClick = (player) => {
    setNotifications(prev => [...prev, {
      id: `player_${Date.now()}`,
      type: 'info',
      title: 'Perfil do Jogador',
      message: `Visualizando estatísticas de ${player?.username}`,
      duration: 3000
    }]);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setRefreshing(false);
    setNotifications(prev => [...prev, {
      id: `refresh_${Date.now()}`,
      type: 'success',
      title: 'Atualizado',
      message: 'Rankings atualizados com sucesso!',
      duration: 3000
    }]);
  };

  const handleScrollToUser = () => {
    const userElement = document.querySelector(`[data-user-id="${currentUser?.id}"]`);
    if (userElement) {
      userElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const dismissNotification = (id) => {
    setNotifications(prev => prev?.filter(n => n?.id !== id));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  const topThreePlayers = mockLeaderboardData?.filter(player => player?.rank <= 3);
  const sortedPlayers = [...mockLeaderboardData]?.sort((a, b) => a?.rank - b?.rank);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Rankings - CS Quiz Arena</title>
        <meta name="description" content="Confira os melhores jogadores do CS Quiz Arena e compare suas estatísticas com os top performers da comunidade." />
      </Helmet>
      <GlobalHeader 
        user={currentUser}
        balance={currentUser?.balance}
        notifications={notifications}
      />
      <NotificationSystem
        notifications={notifications}
        onDismiss={dismissNotification}
        position="top-right"
      />
      <main className="pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  🏆 Rankings
                </h1>
                <p className="text-muted-foreground mt-2">
                  Confira os melhores jogadores e compare suas estatísticas
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleScrollToUser}
                  iconName="User"
                  iconPosition="left"
                  iconSize={16}
                >
                  Minha Posição
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleRefresh}
                  disabled={refreshing}
                  iconName={refreshing ? "Loader2" : "RefreshCw"}
                  iconPosition="left"
                  iconSize={16}
                  className={refreshing ? "animate-spin" : ""}
                >
                  {refreshing ? 'Atualizando...' : 'Atualizar'}
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <LeaderboardTabs 
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />

          {/* Category Filter */}
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Podium Display */}
              <PodiumDisplay topPlayers={topThreePlayers} />

              {/* Leaderboard Table */}
              <LeaderboardTable
                players={sortedPlayers}
                currentUserId={currentUser?.id}
                onPlayerClick={handlePlayerClick}
              />

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Mostrando 1-{sortedPlayers?.length} de {sortedPlayers?.length} jogadores
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                    iconSize={16}
                  >
                    Anterior
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    <Button variant="default" size="sm">1</Button>
                    <Button variant="outline" size="sm">2</Button>
                    <Button variant="outline" size="sm">3</Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    iconName="ChevronRight"
                    iconPosition="right"
                    iconSize={16}
                  >
                    Próxima
                  </Button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {/* Personal Stats */}
              <PersonalStatsCard
                userStats={userStats}
                achievements={achievements}
              />

              {/* Stats Sidebar - Desktop Only */}
              <div className="hidden lg:block">
                <StatsSidebar
                  performanceData={performanceData}
                  comparisonData={comparisonData}
                />
              </div>
            </div>
          </div>

          {/* Mobile Stats Section */}
          <div className="lg:hidden mt-8">
            <StatsSidebar
              performanceData={performanceData}
              comparisonData={comparisonData}
            />
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          variant="default"
          size="icon"
          onClick={handleScrollToUser}
          className="w-14 h-14 rounded-full shadow-modal gaming-glow"
        >
          <Icon name="User" size={24} />
        </Button>
      </div>
    </div>
  );
};

export default LeaderboardsPage;