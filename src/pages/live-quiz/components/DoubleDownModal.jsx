import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { createGameRoom } from '../../../utils/gameRoomService';
import { doubleDownBet } from '../../../utils/bettingService';

const DoubleDownModal = ({ isOpen, onClose, currentUser, gameRoom, winnings }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  
  if (!isOpen) return null;
  
  const handleDoubleDown = async () => {
    setIsProcessing(true);
    try {
      // Criar nova sala com o dobro da aposta
      const newRoomData = {
        ...gameRoom,
        entryFee: gameRoom.entryFee * 2,
        name: `${gameRoom.name} - Dobro ou Nada`,
        creatorId: currentUser.id
      };
      
      // Criar nova sala e processar aposta dobrada
      const newRoom = await createGameRoom(newRoomData, currentUser.id);
      await doubleDownBet(currentUser.id, gameRoom.id, newRoom.id);
      
      // Redirecionar para a nova sala
      navigate(`/quiz-lobby/${newRoom.id}`);
    } catch (error) {
      console.error('Erro ao processar dobro ou nada:', error);
      onClose();
    }
  };
  
  const handleCollect = () => {
    onClose();
    navigate('/game-rooms');
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Parabéns! Você Venceu!
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Trophy" size={40} color="var(--color-warning)" />
          </div>
          <h3 className="text-2xl font-bold mb-2">
            {winnings} <Icon name="Coins" size={20} inline />
          </h3>
          <p className="text-muted-foreground">
            Você ganhou o prêmio total! O que deseja fazer agora?
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted/30 p-4 rounded-lg border border-border hover:border-primary cursor-pointer transition-colors text-center" onClick={handleDoubleDown}>
            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Repeat" size={24} color="var(--color-primary)" />
            </div>
            <h4 className="font-bold mb-1">Dobro ou Nada</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Aposte tudo em um novo jogo com o dobro do valor
            </p>
            <div className="text-sm font-medium">
              Ganhe {winnings * 2} <Icon name="Coins" size={12} inline />
            </div>
          </div>
          
          <div className="bg-muted/30 p-4 rounded-lg border border-border hover:border-success cursor-pointer transition-colors text-center" onClick={handleCollect}>
            <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Wallet" size={24} color="var(--color-success)" />
            </div>
            <h4 className="font-bold mb-1">Coletar Prêmio</h4>
            <p className="text-xs text-muted-foreground mb-2">
              Adicione o valor ao seu saldo e continue jogando
            </p>
            <div className="text-sm font-medium">
              Garantir {winnings} <Icon name="Coins" size={12} inline />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center">
            <Icon name="Info" size={16} className="mr-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              No "Dobro ou Nada", você aposta todo o seu prêmio em um novo jogo. Se vencer, ganha o dobro. Se perder, perde tudo.
            </p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isProcessing}
          >
            Decidir depois
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoubleDownModal;