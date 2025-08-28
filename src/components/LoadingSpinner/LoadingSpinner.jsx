import React from 'react';
import './LoadingSpinner.css';

/**
 * Componente LoadingSpinner
 * 
 * Este componente exibe um spinner de carregamento
 * 
 * @param {string} size - Tamanho do spinner (sm, md, lg)
 * @param {string} color - Cor do spinner
 */
const LoadingSpinner = ({ size = 'md', color = 'primary' }) => {
  return (
    <div className={`loading-spinner loading-spinner--${size} loading-spinner--${color}`}>
      <div className="loading-spinner__circle"></div>
    </div>
  );
};

export default LoadingSpinner;