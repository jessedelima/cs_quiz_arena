import React from 'react';
import './Button.css';

/**
 * Componente Button
 * 
 * Este componente renderiza um botão estilizado com diferentes variantes
 * 
 * @param {string} variant - Variante do botão (primary, secondary, success, danger, warning)
 * @param {boolean} disabled - Se o botão está desabilitado
 * @param {Function} onClick - Função chamada ao clicar no botão
 * @param {string} className - Classes CSS adicionais
 * @param {ReactNode} children - Conteúdo do botão
 * @param {string} type - Tipo do botão (button, submit, reset)
 */
const Button = ({ 
  variant = 'primary', 
  disabled = false, 
  onClick, 
  className = '', 
  children, 
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;