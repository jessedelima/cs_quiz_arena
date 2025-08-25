import React from 'react';
import Icon from '../../../components/AppIcon';

const BettingInfo = ({ room, currentUser }) => {
  const totalPrize = room.entryFee * room.participants.length;
  const userBet = room.participants.find(p => p.userId === currentUser?.id)?.betAmount || 0;
  
  // Calcular distribuição de prêmios com base no tipo de distribuição
  const calculatePrizeDistribution = () => {
    switch (room.distributionType) {
      case 'winner-takes-all':
        return [
          { position: 1, percentage: 100, amount: totalPrize }
        ];
      case 'top3':
        return [
          { position: 1, percentage: 60, amount: Math.floor(totalPrize * 0.6) },
          { position: 2, percentage: 30, amount: Math.floor(totalPrize * 0.3) },
          { position: 3, percentage: 10, amount: Math.floor(totalPrize * 0.1) }
        ];
      case 'proportional':
        // Simplificação para exibição
        return [
          { position: 1, percentage: 50, amount: Math.floor(totalPrize * 0.5) },
          { position: 2, percentage: 25, amount: Math.floor(totalPrize * 0.25) },
          { position: 3, percentage: 15, amount: Math.floor(totalPrize * 0.15) },
          { position: '4+', percentage: 10, amount: Math.floor(totalPrize * 0.1) }
        ];
      default:
        return [
          { position: 1, percentage: 100, amount: totalPrize }
        ];
    }
  };

  const prizeDistribution = calculatePrizeDistribution();

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-4">
      <h3 className="text-lg font-bold mb-3 flex items-center">
        <Icon name="Trophy" size={20} className="mr-2 text-warning" />
        Informações da Aposta
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Sua Aposta</div>
          <div className="flex items-center">
            <Icon name="Coins" size={18} className="mr-2 text-warning" />
            <span className="text-lg font-bold">{userBet}</span>
          </div>
        </div>
        
        <div className="bg-muted/30 p-3 rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Prêmio Total</div>
          <div className="flex items-center">
            <Icon name="Trophy" size={18} className="mr-2 text-warning" />
            <span className="text-lg font-bold">{totalPrize}</span>
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <h4 className="text-sm font-medium mb-2">Distribuição de Prêmios</h4>
        <div className="space-y-2">
          {prizeDistribution.map((prize) => (
            <div key={`prize-${prize.position}`} className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                  <span className="text-xs font-medium">{prize.position}</span>
                </div>
                <span className="text-sm">
                  {typeof prize.position === 'number' ? `${prize.position}º lugar` : prize.position}
                </span>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium mr-2">{prize.amount}</span>
                <span className="text-xs text-muted-foreground">({prize.percentage}%)</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {room.allowDoubleDown && (
        <div className="mt-4 pt-3 border-t border-border">
          <div className="flex items-center text-sm">
            <Icon name="Repeat" size={16} className="mr-2 text-primary" />
            <span>
              <span className="font-medium">Dobro ou Nada:</span> O vencedor poderá dobrar seus ganhos em um novo jogo
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BettingInfo;