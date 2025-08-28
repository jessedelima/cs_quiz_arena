import React from 'react';
import './PlayerAvatar.css';

/**
 * Componente PlayerAvatar
 * 
 * Este componente exibe o avatar de um jogador com indicador de status
 * 
 * @param {Object} player - Dados do jogador
 * @param {boolean} isReady - Indica se o jogador está pronto
 * @param {boolean} isHost - Indica se o jogador é o host da sala
 */
const PlayerAvatar = ({ player, isReady = false, isHost = false }) => {
  // Gera uma cor baseada no nome do jogador para avatares sem imagem
  const generateColorFromName = (name) => {
    if (!name) return '#6366f1'; // Cor padrão
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 60%)`;
  };
  
  // Gera as iniciais do nome do jogador
  const getInitials = (name) => {
    if (!name) return '?';
    
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };
  
  const avatarColor = generateColorFromName(player?.username || player?.displayName);
  const initials = getInitials(player?.username || player?.displayName);
  
  return (
    <div className={`player-avatar ${isReady ? 'player-avatar--ready' : ''}`}>
      <div 
        className="player-avatar__image" 
        style={{ backgroundColor: avatarColor }}
      >
        {player?.avatarUrl ? (
          <img src={player.avatarUrl} alt={player.username || 'Jogador'} />
        ) : (
          <span className="player-avatar__initials">{initials}</span>
        )}
      </div>
      
      {isHost && (
        <div className="player-avatar__host-badge" title="Host da sala">
          👑
        </div>
      )}
      
      <div className="player-avatar__name">
        {player?.username || player?.displayName || 'Jogador'}
      </div>
      
      <div className={`player-avatar__status ${isReady ? 'player-avatar__status--ready' : ''}`}>
        {isReady ? 'Pronto' : 'Aguardando'}
      </div>
    </div>
  );
};

export default PlayerAvatar;