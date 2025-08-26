import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import NotificationSystem from '../../components/ui/NotificationSystem';
import LobbyHeader from './components/LobbyHeader';
import ParticipantsList from './components/ParticipantsList';
import LobbyChat from './components/LobbyChat';
import HostControls from './components/HostControls';
import EntryFeeModal from './components/EntryFeeModal';

const QuizLobby = () => {
  const navigate = useNavigate();
  const { lobbyId } = useParams();
  const [activeTab, setActiveTab] = useState('participants');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  // Mock current user data
  const currentUser = {
    id: 'user-123',
    username: 'ProPlayer_BR',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    balance: 2500,
    level: 15,
    wins: 47
  };

  // Mock lobby data
  const [lobbyData, setLobbyData] = useState({
    id: lobbyId || 'lobby-456',
    name: 'Quiz CS2 - Mapas Clássicos',
    hostId: 'user-789',
    entryFee: 100,
    prizePool: 800,
    difficulty: 'Médio',
    maxPlayers: 8,
    questionCount: 10,
    timePerQuestion: 15,
    status: 'waiting'
  });

  // Mock participants data
  const [participants, setParticipants] = useState([
    {
      id: 'user-789',
      username: 'CS_Master_2024',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      isHost: true,
      isReady: true,
      isOnline: true,
      level: 22,
      wins: 89
    },
    {
      id: 'user-123',
      username: 'ProPlayer_BR',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      isHost: false,
      isReady: false,
      isOnline: true,
      level: 15,
      wins: 47
    },
    {
      id: 'user-456',
      username: 'AK47_Sniper',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      isHost: false,
      isReady: true,
      isOnline: true,
      level: 18,
      wins: 63
    },
    {
      id: 'user-321',
      username: 'Dust2_Legend',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg',
      isHost: false,
      isReady: false,
      isOnline: true,
      level: 12,
      wins: 34
    }
  ]);

  // Mock chat messages
  const [messages, setMessages] = useState([
    {
      id: 'msg-1',
      type: 'join',
      content: 'ProPlayer_BR entrou no lobby',
      timestamp: new Date(Date.now() - 300000),
      userId: 'system'
    },
    {
      id: 'msg-2',
      type: 'message',
      content: 'Salve galera! Bora para mais um quiz?',
      timestamp: new Date(Date.now() - 240000),
      userId: 'user-789',
      username: 'CS_Master_2024',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
    },
    {
      id: 'msg-3',
      type: 'message',
      content: 'Opa! Preparado para as perguntas sobre mapas clássicos 🎯',
      timestamp: new Date(Date.now() - 180000),
      userId: 'user-456',
      username: 'AK47_Sniper',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
    },
    {
      id: 'msg-4',
      type: 'ready',
      content: 'AK47_Sniper está pronto para o quiz',
      timestamp: new Date(Date.now() - 120000),
      userId: 'system'
    },
    {
      id: 'msg-5',
      type: 'message',
      content: 'Alguém sabe se vai ter perguntas sobre as novas atualizações do CS2?',
      timestamp: new Date(Date.now() - 60000),
      userId: 'user-321',
      username: 'Dust2_Legend',
      avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
    }
  ]);

  const [timeRemaining, setTimeRemaining] = useState(120); // 2 minutes

  // Timer countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleStartGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check if user needs to pay entry fee
  useEffect(() => {
    const userInLobby = participants?.find(p => p?.id === currentUser?.id);
    if (!userInLobby && lobbyData?.entryFee > 0) {
      setShowEntryModal(true);
    }
  }, []);

  const isHost = participants?.find(p => p?.id === currentUser?.id)?.isHost || false;
  const readyCount = participants?.filter(p => p?.isReady)?.length;
  const canStartGame = readyCount >= 2 && readyCount === participants?.length;

  const handleLeaveLobby = () => {
    addNotification({
      type: 'info',
      title: 'Saindo do lobby',
      message: 'Você saiu do lobby com sucesso.',
      duration: 3000
    });
    navigate('/dashboard');
  };

  const handleToggleReady = () => {
    setParticipants(prev => prev?.map(p => 
      p?.id === currentUser?.id 
        ? { ...p, isReady: !p?.isReady }
        : p
    ));

    const newReadyStatus = !participants?.find(p => p?.id === currentUser?.id)?.isReady;
    
    setMessages(prev => [...prev, {
      id: `msg-${Date.now()}`,
      type: newReadyStatus ? 'ready' : 'unready',
      content: `${currentUser?.username} ${newReadyStatus ? 'está pronto' : 'cancelou o pronto'}`,
      timestamp: new Date(),
      userId: 'system'
    }]);

    addNotification({
      type: 'success',
      message: newReadyStatus ? 'Você está pronto!' : 'Status alterado para não pronto',
      duration: 2000
    });
  };

  const handleSendMessage = (content) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      type: 'message',
      content,
      timestamp: new Date(),
      userId: currentUser?.id,
      username: currentUser?.username,
      avatar: currentUser?.avatar
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleKickPlayer = (playerId) => {
    const player = participants?.find(p => p?.id === playerId);
    if (player) {
      setParticipants(prev => prev?.filter(p => p?.id !== playerId));
      
      setMessages(prev => [...prev, {
        id: `msg-${Date.now()}`,
        type: 'leave',
        content: `${player?.username} foi removido do lobby`,
        timestamp: new Date(),
        userId: 'system'
      }]);

      addNotification({
        type: 'warning',
        message: `${player?.username} foi removido do lobby`,
        duration: 3000
      });
    }
  };

  const handleStartGame = () => {
    if (canStartGame || timeRemaining <= 0) {
      addNotification({
        type: 'success',
        title: 'Quiz iniciado!',
        message: 'Redirecionando para o quiz...',
        duration: 2000
      });
      
      setTimeout(() => {
        navigate('/live-quiz', { 
          state: { 
            lobbyData, 
            participants: participants?.filter(p => p?.isReady) 
          } 
        });
      }, 2000);
    }
  };

  const handleUpdateSettings = (newSettings) => {
    setLobbyData(prev => ({ ...prev, ...newSettings }));
    
    addNotification({
      type: 'info',
      message: 'Configurações do lobby atualizadas',
      duration: 2000
    });
  };

  const handleConfirmEntry = () => {
    setShowEntryModal(false);
    addNotification({
      type: 'success',
      title: 'Entrada confirmada!',
      message: `${lobbyData?.entryFee} coins foram descontados do seu saldo.`,
      duration: 3000
    });
  };

  const handleCancelEntry = () => {
    setShowEntryModal(false);
    navigate('/dashboard');
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const handleDismissNotification = (notificationId) => {
    setNotifications(prev => prev?.filter(n => n?.id !== notificationId));
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={currentUser}
        balance={currentUser?.balance}
        notifications={notifications}
        onNavigate={(path) => navigate(path)}
      />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <LobbyHeader
            lobbyData={lobbyData}
            timeRemaining={timeRemaining}
            onLeaveLobby={handleLeaveLobby}
            isHost={isHost}
          />

          <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Mobile Tabs */}
            <div className="lg:hidden col-span-1">
              <div className="flex bg-card rounded-lg border border-border p-1">
                <button
                  onClick={() => setActiveTab('participants')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium gaming-transition ${
                    activeTab === 'participants' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Participantes ({participants?.length})
                </button>
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium gaming-transition ${
                    activeTab === 'chat' ?'bg-primary text-primary-foreground' :'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Chat
                </button>
              </div>
            </div>

            {/* Participants Section */}
            <div className={`lg:col-span-5 ${activeTab === 'participants' ? 'block' : 'hidden lg:block'}`}>
              <ParticipantsList
                participants={participants}
                currentUserId={currentUser?.id}
                isHost={isHost}
                maxPlayers={lobbyData?.maxPlayers}
                onKickPlayer={handleKickPlayer}
                onToggleReady={handleToggleReady}
              />
            </div>

            {/* Chat Section */}
            <div className={`lg:col-span-4 ${activeTab === 'chat' ? 'block' : 'hidden lg:block'} h-96 lg:h-auto`}>
              <LobbyChat
                messages={messages}
                currentUserId={currentUser?.id}
                onSendMessage={handleSendMessage}
                isConnected={isConnected}
              />
            </div>

            {/* Host Controls */}
            {isHost && (
              <div className="lg:col-span-3">
                <HostControls
                  canStartGame={canStartGame}
                  participantCount={participants?.length}
                  minPlayers={2}
                  onStartGame={handleStartGame}
                  onUpdateSettings={handleUpdateSettings}
                  lobbySettings={lobbyData}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <EntryFeeModal
        isOpen={showEntryModal}
        entryFee={lobbyData?.entryFee}
        userBalance={currentUser?.balance}
        lobbyName={lobbyData?.name}
        onConfirm={handleConfirmEntry}
        onCancel={handleCancelEntry}
      />
      <NotificationSystem
        notifications={notifications}
        onDismiss={handleDismissNotification}
        position="top-right"
        maxVisible={3}
      />
    </div>
  );
};

export default QuizLobby;