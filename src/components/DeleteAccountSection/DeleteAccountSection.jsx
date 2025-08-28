import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { deleteUserAccount } from '../../utils/authService';

const DeleteAccountSection = ({ onAccountDeleted }) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDeleteRequest = () => {
    setShowConfirmation(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setError('');
    
    try {
      const result = await deleteUserAccount();
      
      if (result.success) {
        if (onAccountDeleted) {
          onAccountDeleted();
        }
      } else {
        setError(result.error || 'Ocorreu um erro ao excluir a conta.');
        setShowConfirmation(false);
      }
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      setError('Ocorreu um erro ao excluir a conta. Tente novamente mais tarde.');
      setShowConfirmation(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-10 pt-5 border-t border-border">
      <h3 className="text-lg font-semibold mb-3 text-foreground">Excluir Conta</h3>
      <p className="text-destructive mb-4 text-sm">
        Atenção: A exclusão da conta é permanente e todos os seus dados serão removidos.
      </p>
      
      {error && (
        <div className="bg-red-50 text-red-800 border border-red-200 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {!showConfirmation ? (
        <button 
          type="button" 
          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors"
          onClick={handleDeleteRequest}
        >
          Excluir minha conta
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
          <p className="mb-4 text-foreground">Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
          <div className="flex gap-3">
            <button 
              type="button" 
              className="bg-muted text-muted-foreground px-4 py-2 rounded-md hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancelar
            </button>
            <button 
              type="button" 
              className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Excluindo...' : 'Sim, excluir minha conta'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

DeleteAccountSection.propTypes = {
  onAccountDeleted: PropTypes.func
};

export default DeleteAccountSection;