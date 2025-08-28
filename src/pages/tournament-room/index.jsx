import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import GlobalHeader from '../../components/ui/GlobalHeader';
import { createGameRoom, joinRoom, getRoomById, leaveRoom as leaveGameRoom } from '../../utils/gameRoomService';
import websocketService from '../../api/websocketService';
import { startQuiz } from '../../utils/quizService';

const TournamentRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [countdown, setCountdown] = useState(null);
  
  // Mock do usuário atual (substituir por autenticação real)
  const currentUser = {
    id: 'user123',
    name: 'Jogador CS',
    balance: 1000,
    avatar: 'https://placehold.co/100x100'
  };

  useEffect(() => {
    // Conectar ao WebSocket para a sala
    websocketService.connect(roomId, currentUser.id);
    
    // Carregar dados da sala
    loadRoom();
    
    // Configurar listeners para eventos da sala
    const unsubscribeRoomUpdated = websocketService.on('room_updated', handleRoomUpdated);
    const unsubscribeGameStarted = websocketService.on('game_started', handleGameStarted);
    const unsubscribePlayerJoined = websocketService.on('player_joined', handlePlayerJoined);
    const unsubscribePlayerLeft = websocketService.on('player_left', handlePlayerLeft);
    const unsubscribePlayerReady = websocketService.on('player_ready', handlePlayerReady);
    
    // Limpar listeners quando o componente for desmontado
    return () => {
      unsubscribeRoomUpdated();
      unsubscribeGameStarted();
      unsubscribePlayerJoined();
      unsubscribePlayerLeft();
      unsubscribePlayerReady();
      websocketService.disconnect();
    };
  }, [roomId]);

  // Carregar dados da sala
  const loadRoom = async () => {
    setLoading(true);
    try {
      const roomData = await getRoomById(roomId);
      if (!roomData) {
        setError('Sala não encontrada');
        return;
      }
      
      setRoom(roomData);
      
      // Verificar se o jogador atual já está pronto
      const currentPlayer = roomData.participants.find(p => p.userId === currentUser.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.isReady || false);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao carregar sala:', err);
      setError('Erro ao carregar dados da sala');
      setLoading(false);
    }
  };

  // Handlers para eventos WebSocket
  const handleRoomUpdated = (data) => {
    setRoom(data.room);
  };

  const handleGameStarted = (data) => {
    console.log('Jogo iniciado:', data);
    
    // Se o jogo foi iniciado por outro jogador (host)
    if (data.initiatedBy !== currentUser.id) {
      // Inicia contagem regressiva
      setCountdown(5);
      
      // Após a contagem, redireciona para a tela do jogo
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate(`/live-quiz/${roomId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const handlePlayerJoined = (data) => {
    console.log('Jogador entrou:', data);
    loadRoom(); // Recarrega os dados da sala
  };

  const handlePlayerLeft = (data) => {
    console.log('Jogador saiu:', data);
    loadRoom(); // Recarrega os dados da sala
  };

  const handlePlayerReady = (data) => {
    console.log('Jogador pronto:', data);
    loadRoom(); // Recarrega os dados da sala
  };

  // Marcar jogador como pronto
  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    
    // Enviar status para o servidor via WebSocket
    websocketService.send('player_ready', {
      roomId,
      userId: currentUser.id,
      isReady: newReadyState
    });
  };

  // Iniciar o jogo (apenas para o host)
  const startGame = () => {
    try {
      // Iniciar o quiz usando o serviço
      const gameOptions = {
        timePerQuestion: room?.timePerQuestion || 15,
        count: room?.questionCount || 10,
        difficulty: room?.difficulty || 'medium'
      };
      
      // Iniciar o quiz com os participantes da sala
      startQuiz(roomId, room.participants, gameOptions);
      
      // Enviar evento para o servidor via WebSocket
      websocketService.send('start_game', {
        roomId,
        userId: currentUser.id
      });
      
      // Iniciar contagem regressiva
      setCountdown(5);
      
      // Após a contagem, redireciona para a tela do jogo
      const countdownInterval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            navigate(`/live-quiz/${roomId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.error('Erro ao iniciar o jogo:', err);
      alert('Erro ao iniciar o jogo. Tente novamente.');
    }
  };

  // Sair da sala
  const leaveRoom = () => {
    try {
      // Remover o jogador da sala usando o serviço
      leaveGameRoom(roomId, currentUser.id);
      
      // Enviar evento para o servidor via WebSocket
      websocketService.send('leave_room', {
        roomId,
        userId: currentUser.id
      });
      
      // Redirecionar para a lista de salas
      navigate('/game-rooms');
    } catch (err) {
      console.error('Erro ao sair da sala:', err);
      // Mesmo com erro, tentar redirecionar
      navigate('/game-rooms');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="loader" className="mx-auto mb-4 animate-spin" size={48} />
          <h2 className="text-xl font-semibold">Carregando sala...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="alert-triangle" className="mx-auto mb-4 text-error" size={48} />
          <h2 className="text-xl font-semibold mb-4">{error}</h2>
          <Button onClick={() => navigate('/game-rooms')} variant="primary">
            Voltar para Salas
          </Button>
        </div>
      </div>
    );
  }

  const isHost = room?.hostId === currentUser.id;
  const allPlayersReady = room?.participants.every(p => p.isReady);
  const canStartGame = isHost && allPlayersReady && room?.participants.length >= room?.settings.minPlayersToStart;

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{room?.name || 'Sala de Torneio'}</h1>
          <Button onClick={leaveRoom} variant="outline" size="sm">
            <Icon name="log-out" className="mr-2" size={16} />
            Sair da Sala
          </Button>
        </div>
        
        {/* Contagem regressiva */}
        {countdown !== null && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">O jogo começa em</h2>
              <div className="text-6xl font-bold text-primary mb-4">{countdown}</div>
              <p className="text-muted-foreground">Prepare-se para o quiz!</p>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da sala */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Informações da Sala</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Valor de Entrada</div>
                  <div className="text-lg font-semibold">{room?.entryFee || 0} moedas</div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Prêmio Total</div>
                  <div className="text-lg font-semibold">{room?.prizePool || 0} moedas</div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Jogadores</div>
                  <div className="text-lg font-semibold">{room?.participants.length || 0}/{room?.maxPlayers || 10}</div>
                </div>
                
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground">Dificuldade</div>
                  <div className="text-lg font-semibold capitalize">{room?.difficulty || 'Médio'}</div>
                </div>
              </div>
            </div>
            
            {/* Lista de jogadores */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Jogadores</h2>
              
              <div className="space-y-3">
                {room?.participants.map((player) => (
                  <div key={player.userId} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <Icon name="user" size={20} />
                      </div>
                      <div>
                        <div className="font-medium">{player.userId === currentUser.id ? 'Você' : `Jogador ${player.userId}`}</div>
                        <div className="text-xs text-muted-foreground">
                          {player.isHost ? 'Host' : 'Jogador'}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${player.isReady ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'}`}>
                      {player.isReady ? 'Pronto' : 'Não Pronto'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Painel de controle */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Controles</h2>
              
              <div className="space-y-4">
                <Button 
                  onClick={toggleReady} 
                  variant={isReady ? "outline" : "primary"}
                  className="w-full"
                >
                  <Icon name={isReady ? "x" : "check"} className="mr-2" size={16} />
                  {isReady ? 'Cancelar Pronto' : 'Marcar como Pronto'}
                </Button>
                
                {isHost && (
                  <Button 
                    onClick={startGame} 
                    variant="primary"
                    className="w-full"
                    disabled={!canStartGame}
                  >
                    <Icon name="play" className="mr-2" size={16} />
                    Iniciar Jogo
                  </Button>
                )}
                
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Regras do Jogo</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• {room?.questionCount || 10} perguntas sobre Counter-Strike</li>
                    <li>• {room?.timePerQuestion || 15} segundos por pergunta</li>
                    <li>• Respostas mais rápidas valem mais pontos</li>
                    <li>• Mínimo de {room?.settings?.minPlayersToStart || 2} jogadores para iniciar</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                  <h3 className="font-medium mb-2 flex items-center">
                    <Icon name="info" className="mr-2 text-primary" size={16} />
                    Status da Sala
                  </h3>
                  <div className="text-sm">
                    {canStartGame ? (
                      <p className="text-success">Pronto para iniciar! Todos os jogadores estão prontos.</p>
                    ) : (
                      <p className="text-warning">
                        {!allPlayersReady ? 'Aguardando todos os jogadores ficarem prontos.' : 
                         room?.participants.length < room?.settings.minPlayersToStart ? 
                         `Aguardando mais jogadores (mínimo ${room?.settings.minPlayersToStart}).` : 
                         'Aguardando o host iniciar o jogo.'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentRoom;