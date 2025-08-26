import React from 'react';
import Button from '../../../components/ui/Button';

const DoubleDownModal = ({ isOpen, onClose, currentUser, gameRoom, winnings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Dobrar ou Nada</h2>
        
        <p className="text-card-foreground mb-6">
          Parabéns! Você ganhou {winnings} moedas. Deseja dobrar ou nada?
        </p>
        
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={onClose}>
            Recusar
          </Button>
          <Button variant="primary" onClick={onClose}>
            Dobrar!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoubleDownModal;