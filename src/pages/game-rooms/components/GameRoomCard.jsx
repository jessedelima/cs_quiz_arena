import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const GameRoomCard = ({ room }) => {
  const navigate = useNavigate();

  const handleJoinRoom = () => {
    navigate(`/quiz-lobby/${room.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold text-card-foreground truncate">{room.name}</h3>
          <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">
            {room.category}
          </span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Icon name="user" className="mr-1" size={14} />
          <span>{room.currentPlayers}/{room.maxPlayers} jogadores</span>
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Icon name="coin" className="mr-1" size={14} />
          <span>Taxa de entrada: {room.entryFee} moedas</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center text-sm">
            <Icon name="trophy" className="mr-1 text-yellow-500" size={14} />
            <span className="font-medium">Prêmio: {room.prize} moedas</span>
          </div>
          <Button onClick={handleJoinRoom} variant="primary" size="sm">
            Entrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameRoomCard;