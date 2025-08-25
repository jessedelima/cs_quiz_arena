import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GameRoomCard = ({ room, currentUser, onJoinSuccess, onJoinError }) => {
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = React.useState(false);

  const isCreator = room.creatorId === currentUser?.id;
  const hasJoined = room.participants.some(p => p.userId === currentUser?.id);
  const isFull = room.participants.length >= room.maxPlayers;
  const canJoin = !isCreator && !hasJoined && !isFull;

  const totalPrize = room.entryFee * room.participants.length;
  const remainingSlots = room.maxPlayers - room.participants.length;

  const handleJoinRoom = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (currentUser.balance < room.entryFee) {
      onJoinError('Saldo insuficiente para entrar nesta sala');
      return;
    }

    setIsJoining(true);
    try {
      // Simulação de entrada na sala
      setTimeout(() => {
        const updatedRoom = {
          ...room,
          participants: [
            ...room.participants,
            { userId: currentUser.id, username: currentUser.username, ready: false }
          ]
        };
        
        onJoinSuccess(updatedRoom);
        navigate(`/quiz-lobby/${room.id}`);
        setIsJoining(false);
      }, 500);
    } catch (error) {
      onJoinError(error.message || 'Erro ao entrar na sala');
      setIsJoining(false);
    }
  };

  const handleViewRoom = () => {
    navigate(`/quiz-lobby/${room.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{room.name}</h3>
          <p className="text-sm text-muted-foreground">
            Criado por {room.participants.find(p => p.userId === room.creatorId)?.username || 'Desconhecido'}
          </p>
        </div>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            room.difficulty === 'Fácil' ? 'bg-green-100 text-green-800' :
            room.difficulty === 'Médio' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {room.difficulty}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Valor de Entrada</span>
          <span className="font-medium text-foreground flex items-center">
            <Icon name="Coins" size={16} className="mr-1 text-yellow-500" />
            {room.entryFee} moedas
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Prêmio Total</span>
          <span className="font-medium text-foreground flex items-center">
            <Icon name="Award" size={16} className="mr-1 text-yellow-500" />
            {totalPrize} moedas
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Jogadores</span>
          <span className="font-medium text-foreground">
            {room.participants.length}/{room.maxPlayers}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Questões</span>
          <span className="font-medium text-foreground">
            {room.questionCount} ({room.timePerQuestion}s cada)
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {hasJoined || isCreator ? (
          <Button 
            onClick={handleViewRoom}
            variant="outline"
            className="w-full"
          >
            {isCreator ? 'Gerenciar Sala' : 'Entrar na Sala'}
          </Button>
        ) : (
          <Button 
            onClick={handleJoinRoom}
            disabled={!canJoin || isJoining}
            className="w-full"
          >
            {isJoining ? (
              <>
                <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                Entrando...
              </>
            ) : isFull ? (
              'Sala Cheia'
            ) : (
              <>
                <Icon name="LogIn" size={16} className="mr-2" />
                Entrar ({room.entryFee} moedas)
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameRoomCard;