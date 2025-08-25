import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EntryFeeModal = ({ 
  isOpen = false,
  entryFee = 0,
  userBalance = 0,
  lobbyName = '',
  onConfirm = () => {},
  onCancel = () => {}
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const canAfford = userBalance >= entryFee;

  const handleConfirm = async () => {
    if (!canAfford) return;
    
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-1200 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-modal max-w-md w-full p-6 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Coins" size={32} color="var(--color-primary)" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">
            Confirmar Entrada
          </h2>
          <p className="text-muted-foreground">
            Você está prestes a entrar no lobby "{lobbyName}"
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-background rounded-lg p-4 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Taxa de Entrada:</span>
              <div className="flex items-center space-x-1">
                <Icon name="Coins" size={16} color="var(--color-warning)" />
                <span className="font-mono font-bold text-warning">
                  {entryFee?.toLocaleString('pt-BR')} coins
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Seu Saldo:</span>
              <div className="flex items-center space-x-1">
                <Icon name="Wallet" size={16} color="var(--color-accent)" />
                <span className={`font-mono font-bold ${canAfford ? 'text-accent' : 'text-error'}`}>
                  {userBalance?.toLocaleString('pt-BR')} coins
                </span>
              </div>
            </div>
          </div>

          {!canAfford && (
            <div className="bg-error/10 border border-error/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="AlertTriangle" size={16} color="var(--color-error)" />
                <span className="text-sm font-medium text-error">
                  Saldo Insuficiente
                </span>
              </div>
              <p className="text-xs text-error/80">
                Você precisa de mais {(entryFee - userBalance)?.toLocaleString('pt-BR')} coins para entrar neste lobby.
              </p>
            </div>
          )}

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} color="var(--color-accent)" />
              <span className="text-sm font-medium text-accent">
                Informações Importantes
              </span>
            </div>
            <ul className="text-xs text-accent/80 space-y-1">
              <li>• A taxa será descontada apenas se você participar do quiz</li>
              <li>• Você pode sair do lobby antes do início sem cobrança</li>
              <li>• O prêmio será distribuído entre os vencedores</li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            fullWidth
            onClick={onCancel}
            disabled={isProcessing}
            iconName="X"
            iconPosition="left"
          >
            Cancelar
          </Button>
          <Button
            variant="default"
            fullWidth
            onClick={handleConfirm}
            disabled={!canAfford || isProcessing}
            loading={isProcessing}
            iconName="Check"
            iconPosition="left"
          >
            {isProcessing ? 'Processando...' : 'Confirmar Entrada'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntryFeeModal;