import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { joinGameRoom } from '../../../utils/gameRoomService';
import { placeBet } from '../../../utils/bettingService';

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
      // Processar aposta
      await placeBet(currentUser.id, room.entryFee, room.id);
      
      // Entrar na sala
      const updatedRoom = await joinGameRoom(room.id, currentUser.id);
      
      onJoinSuccess(updatedRoom);
      navigate(`/quiz-lobby/${room.id}`);
    } catch (error) {
      onJoinError(error.message || 'Erro ao entrar na sala');
    } finally {
      setIsJoining(false);
    }
  };

  const handleViewRoom = () => {
    navigate(`/quiz-lobby/${room.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-foreground truncate">{room.name}</h3>
          <div className="bg-primary/10 text-primary text-xs font-medium px-2 py-1 rounded-full">
            {room.difficulty}
          </div>
        </div>

        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <Icon name="User" size={14} className="mr-1" />
          <span>
            {room.participants.length}/{room.maxPlayers} jogadores
          </span>
          <span className="mx-2">•</span>
          <Icon name="Clock" size={14} className="mr-1" />
          <span>{room.timePerQuestion}s por pergunta</span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-xs text-muted-foreground">Aposta</div>
            <div className="flex items-center">
              <Icon name="Coins" size={16} color="var(--color-warning)" className="mr-1" />
              <span className="font-medium">{room.entryFee}</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-muted-foreground">Prêmio Total</div>
            <div className="flex items-center justify-end">
              <Icon name="Trophy" size={16} color="var(--color-warning)" className="mr-1" />
              <span className="font-medium">{totalPrize}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          {canJoin ? (
            <Button 
              onClick={handleJoinRoom} 
              loading={isJoining}
              fullWidth
            >
              Entrar ({room.entryFee} <Icon name="Coins" size={14} inline />)
            </Button>
          ) : hasJoined ? (
            <Button 
              onClick={handleViewRoom}
              variant="outline"
              fullWidth
            >
              Continuar
            </Button>
          ) : isCreator ? (
            <Button 
              onClick={handleViewRoom}
              variant="outline"
              fullWidth
            >
              Gerenciar Sala
            </Button>
          ) : (
            <Button 
              disabled 
              fullWidth
            >
              Sala Cheia
            </Button>
          )}
        </div>
      </div>

      <div className="bg-muted/30 px-4 py-2 border-t border-border">
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center">
            <Icon name="HelpCircle" size={14} className="mr-1" />
            {room.questionCount} perguntas
          </div>

          {room.allowDoubleDown && (
            <div className="flex items-center">
              <Icon name="Repeat" size={14} className="mr-1" />
              Dobro ou Nada
            </div>
          )}

          <div className="flex items-center">
            <Icon name="Users" size={14} className="mr-1" />
            {remainingSlots} {remainingSlots === 1 ? 'vaga' : 'vagas'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRoomCard;