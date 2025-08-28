import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import websocketService from '../../api/websocketService';
import { getLoggedInUser } from '../../utils/authService';
import { getRoomById, setPlayerReady, startGame } from '../../utils/gameRoomService';
import './WaitingRoom.css';

// Componentes
import PlayerAvatar from '../PlayerAvatar/PlayerAvatar';
import Button from '../Button/Button';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ChatBox from '../ChatBox/ChatBox';

/**
 * Componente de Sala de Espera
 * 
 * Este componente exibe a sala de espera para um jogo, mostrando os jogadores
 * conectados e permitindo que o criador inicie o jogo quando todos estiverem prontos.
 */
const WaitingRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [isCreator, setIsCreator] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  
  const currentUser = getLoggedInUser();
  
  // Carrega os dados da sala
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const roomData = await getRoomById(roomId);
        if (!roomData) {
          setError('Sala não encontrada');
          return;
        }
        
        setRoom(roomData);
        setIsCreator(roomData.createdBy === currentUser?.id);
        
        // Verifica se o jogador atual já está pronto
        const currentPlayer = roomData.participants.find(p => p.id === currentUser?.id);
        if (currentPlayer) {
          setIsReady(currentPlayer.ready || false);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Erro ao carregar sala:', err);
        setError('Erro ao carregar dados da sala');
        setLoading(false);
      }
    };
    
    loadRoom();
  }, [roomId, currentUser]);
  
  // Conecta ao WebSocket quando a sala for carregada
  useEffect(() => {
    if (!room || !currentUser) return;
    
    const connectToWebSocket = async () => {
      try {
        setConnectionStatus('connecting');
        await websocketService.connect(roomId, currentUser.id);
        setConnectionStatus('connected');
        
        // Envia evento de entrada na sala
        websocketService.send('join_room', {
          playerId: currentUser.id,
          playerName: currentUser.username || currentUser.displayName
        });
      } catch (err) {
        console.error('Erro ao conectar ao WebSocket:', err);
        setConnectionStatus('error');
        setError('Erro ao conectar à sala. Tente novamente.');
      }
    };
    
    connectToWebSocket();
    
    // Desconecta do WebSocket quando o componente for desmontado
    return () => {
      websocketService.disconnect();
    };
  }, [room, currentUser, roomId]);
  
  // Configura os listeners do WebSocket
  useEffect(() => {
    if (!room) return;
    
    // Listener para jogador entrando na sala
    const onPlayerJoined = (data) => {
      console.log('Jogador entrou:', data);
      
      // Atualiza a lista de jogadores na sala
      setRoom(prevRoom => {
        // Verifica se o jogador já está na sala
        const playerExists = prevRoom.participants.some(p => p.id === data.userId);
        
        if (playerExists) return prevRoom;
        
        // Adiciona o novo jogador à lista
        const newParticipant = {
          id: data.userId,
          username: data.username,
          ready: false,
          joinedAt: data.joinedAt
        };
        
        return {
          ...prevRoom,
          participants: [...prevRoom.participants, newParticipant]
        };
      });
      
      // Adiciona mensagem ao chat
      setChatMessages(prev => [
        ...prev,
        {
          type: 'system',
          message: `${data.username} entrou na sala`,
          timestamp: new Date().toISOString()
        }
      ]);
    };
    
    // Listener para jogador saindo da sala
    const onPlayerLeft = (data) => {
      console.log('Jogador saiu:', data);
      
      // Remove o jogador da lista
      setRoom(prevRoom => ({
        ...prevRoom,
        participants: prevRoom.participants.filter(p => p.id !== data.userId)
      }));
      
      // Adiciona mensagem ao chat
      setChatMessages(prev => [
        ...prev,
        {
          type: 'system',
          message: `${data.username} saiu da sala`,
          timestamp: new Date().toISOString()
        }
      ]);
    };
    
    // Listener para jogador ficando pronto
    const onPlayerReady = (data) => {
      console.log('Jogador pronto:', data);
      
      // Atualiza o status de pronto do jogador
      setRoom(prevRoom => ({
        ...prevRoom,
        participants: prevRoom.participants.map(p => 
          p.id === data.userId ? { ...p, ready: data.ready } : p
        )
      }));
      
      // Adiciona mensagem ao chat
      setChatMessages(prev => [
        ...prev,
        {
          type: 'system',
          message: `${data.username || 'Jogador'} está ${data.ready ? 'pronto' : 'não está mais pronto'}`,
          timestamp: new Date().toISOString()
        }
      ]);
    };
    
    // Listener para início da partida
    const onGameStarted = (data) => {
      console.log('Partida iniciou:', data);
      
      // Inicia contagem regressiva
      setCountdown(5);
      
      // Adiciona mensagem ao chat
      setChatMessages(prev => [
        ...prev,
        {
          type: 'system',
          message: 'A partida vai começar em 5 segundos!',
          timestamp: new Date().toISOString()
        }
      ]);
    };
    
    // Listener para novas mensagens de chat
    const onNewMessage = (data) => {
      console.log('Nova mensagem:', data);
      
      // Adiciona a mensagem ao chat
      setChatMessages(prev => [
        ...prev,
        {
          type: 'user',
          userId: data.userId,
          username: data.username,
          message: data.message,
          timestamp: data.timestamp
        }
      ]);
    };
    
    // Listener para erros de conexão
    const onConnectionError = (data) => {
      console.error('Erro de conexão:', data);
      setConnectionStatus('error');
      setError(`Erro de conexão: ${data.message}`);
    };
    
    // Registra os listeners
    const unsubscribePlayerJoined = websocketService.on('player_joined', onPlayerJoined);
    const unsubscribePlayerLeft = websocketService.on('player_left', onPlayerLeft);
    const unsubscribePlayerReady = websocketService.on('player_ready', onPlayerReady);
    const unsubscribeGameStarted = websocketService.on('game_started', onGameStarted);
    const unsubscribeNewMessage = websocketService.on('new_message', onNewMessage);
    const unsubscribeError = websocketService.on('error', onConnectionError);
    const unsubscribeConnected = websocketService.on('connected', () => setConnectionStatus('connected'));
    const unsubscribeDisconnected = websocketService.on('disconnected', () => setConnectionStatus('error'));
    
    // Limpa os listeners quando o componente for desmontado
    return () => {
      unsubscribePlayerJoined();
      unsubscribePlayerLeft();
      unsubscribePlayerReady();
      unsubscribeGameStarted();
      unsubscribeNewMessage();
      unsubscribeError();
      unsubscribeConnected();
      unsubscribeDisconnected();
    };
  }, [room]);
  
  // Efeito para contagem regressiva
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown <= 0) {
      // Redireciona para a página do quiz
      navigate(`/live-quiz/${roomId}`);
      return;
    }
    
    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [countdown, navigate, roomId]);
  
  // Manipulador para alternar o status de pronto
  const handleToggleReady = async () => {
    if (!room || !currentUser) return;
    
    try {
      const newReadyStatus = !isReady;
      setIsReady(newReadyStatus);
      
      // Atualiza o status no serviço
      await setPlayerReady(roomId, currentUser.id, newReadyStatus);
      
      // Envia evento para o WebSocket
      websocketService.send('ready', {
        playerId: currentUser.id,
        username: currentUser.username || currentUser.displayName,
        ready: newReadyStatus
      });
    } catch (err) {
      console.error('Erro ao atualizar status de pronto:', err);
      setIsReady(!isReady); // Reverte o estado em caso de erro
      setError('Erro ao atualizar status. Tente novamente.');
    }
  };
  
  // Manipulador para iniciar o jogo
  const handleStartGame = async () => {
    if (!room || !isCreator) return;
    
    try {
      // Verifica se todos os jogadores estão prontos
      const allReady = room.participants.every(p => p.ready);
      if (!allReady) {
        setError('Nem todos os jogadores estão prontos');
        return;
      }
      
      // Inicia o jogo no serviço
      await startGame(roomId);
      
      // Envia evento para o WebSocket
      websocketService.send('start_game', { roomId });
    } catch (err) {
      console.error('Erro ao iniciar jogo:', err);
      setError('Erro ao iniciar o jogo. Tente novamente.');
    }
  };
  
  // Manipulador para enviar mensagem de chat
  const handleSendMessage = async (message) => {
    if (!room || !currentUser || !message.trim()) return;
    
    try {
      // Envia evento para o WebSocket
      websocketService.send('chat_message', {
        senderId: currentUser.id,
        senderName: currentUser.username || currentUser.displayName,
        message: message.trim()
      });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      setError('Erro ao enviar mensagem. Tente novamente.');
    }
  };
  
  // Manipulador para sair da sala
  const handleLeaveRoom = async () => {
    if (!room || !currentUser) return;
    
    try {
      // Envia evento para o WebSocket
      websocketService.send('leave_room', {
        playerId: currentUser.id,
        username: currentUser.username || currentUser.displayName
      });
      
      // Desconecta do WebSocket
      websocketService.disconnect();
      
      // Redireciona para a página de salas
      navigate('/game-rooms');
    } catch (err) {
      console.error('Erro ao sair da sala:', err);
      setError('Erro ao sair da sala. Tente novamente.');
    }
  };
  
  // Renderiza o componente de carregamento
  if (loading) {
    return (
      <div className="waiting-room waiting-room--loading">
        <LoadingSpinner size="large" />
        <p>Carregando sala de espera...</p>
      </div>
    );
  }
  
  // Renderiza mensagem de erro
  if (error) {
    return (
      <div className="waiting-room waiting-room--error">
        <div className="waiting-room__error-container">
          <h2>Erro</h2>
          <p>{error}</p>
          <Button onClick={() => navigate('/game-rooms')} variant="primary">
            Voltar para salas
          </Button>
        </div>
      </div>
    );
  }
  
  // Renderiza a sala de espera
  return (
    <div className="waiting-room">
      {/* Cabeçalho da sala */}
      <div className="waiting-room__header">
        <h1>{room.name}</h1>
        <div className="waiting-room__status">
          {connectionStatus === 'connecting' && (
            <span className="waiting-room__status-connecting">
              <LoadingSpinner size="small" /> Conectando...
            </span>
          )}
          {connectionStatus === 'connected' && (
            <span className="waiting-room__status-connected">
              <span className="waiting-room__status-dot"></span> Conectado
            </span>
          )}
          {connectionStatus === 'error' && (
            <span className="waiting-room__status-error">
              <span className="waiting-room__status-dot"></span> Erro de conexão
            </span>
          )}
        </div>
      </div>
      
      {/* Informações da sala */}
      <div className="waiting-room__info">
        <div className="waiting-room__info-item">
          <span className="waiting-room__info-label">Valor de entrada:</span>
          <span className="waiting-room__info-value">{room.entryFee} moedas</span>
        </div>
        <div className="waiting-room__info-item">
          <span className="waiting-room__info-label">Prêmio total:</span>
          <span className="waiting-room__info-value">{room.prizePool} moedas</span>
        </div>
        <div className="waiting-room__info-item">
          <span className="waiting-room__info-label">Jogadores:</span>
          <span className="waiting-room__info-value">{room.participants.length}/{room.maxPlayers}</span>
        </div>
      </div>
      
      {/* Contagem regressiva */}
      {countdown !== null && (
        <div className="waiting-room__countdown">
          <h2>A partida começa em</h2>
          <div className="waiting-room__countdown-number">{countdown}</div>
        </div>
      )}
      
      {/* Conteúdo principal */}
      <div className="waiting-room__content">
        {/* Lista de jogadores */}
        <div className="waiting-room__players">
          <h2>Jogadores</h2>
          <div className="waiting-room__players-list">
            {room.participants.map((player) => (
              <div 
                key={player.id} 
                className={`waiting-room__player ${player.ready ? 'waiting-room__player--ready' : ''}`}
              >
                <PlayerAvatar 
                  userId={player.id} 
                  size="medium" 
                  username={player.username} 
                />
                <div className="waiting-room__player-info">
                  <span className="waiting-room__player-name">
                    {player.username}
                    {player.id === room.createdBy && (
                      <span className="waiting-room__player-host"> (Anfitrião)</span>
                    )}
                  </span>
                  <span className="waiting-room__player-status">
                    {player.ready ? 'Pronto' : 'Não pronto'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Chat da sala */}
        <div className="waiting-room__chat">
          <h2>Chat da Sala</h2>
          <ChatBox 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
            currentUserId={currentUser?.id}
          />
        </div>
      </div>
      
      {/* Ações da sala */}
      <div className="waiting-room__actions">
        <Button 
          onClick={handleLeaveRoom} 
          variant="secondary"
          className="waiting-room__leave-button"
        >
          Sair da Sala
        </Button>
        
        {isCreator ? (
          <Button 
            onClick={handleStartGame} 
            variant="primary"
            disabled={!room.participants.every(p => p.ready) || room.participants.length < 2}
            className="waiting-room__start-button"
          >
            Iniciar Partida
          </Button>
        ) : (
          <Button 
            onClick={handleToggleReady} 
            variant={isReady ? "success" : "primary"}
            className="waiting-room__ready-button"
          >
            {isReady ? 'Pronto!' : 'Marcar como Pronto'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WaitingRoom;