import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GameContextOverlay = ({ 
  gameState = 'lobby', // 'lobby' | 'active' | 'completed'
  gameData = {},
  onExitGame = () => {},
  showProgress = false,
  progress = 0,
  timeRemaining = null,
  className = ""
}) => {
  const navigate = useNavigate();

  const handleExitGame = () => {
    onExitGame();
    navigate('/dashboard');
  };

  const GameHeader = () => (
    <div className="flex items-center justify-between p-4 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center space-x-4">
        {/* Exit Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleExitGame}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>

        {/* Game Title */}
        <div className="flex items-center space-x-2">
          <Icon name="Gamepad2" size={20} color="var(--color-primary)" />
          <h1 className="text-lg font-semibold text-foreground">
            {gameState === 'lobby' && 'Quiz Lobby'}
            {gameState === 'active' && 'Live Quiz'}
            {gameState === 'completed' && 'Quiz Complete'}
          </h1>
        </div>

        {/* Game Info */}
        {gameData?.lobbyName && (
          <div className="hidden md:flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Users" size={16} />
            <span>{gameData?.lobbyName}</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Timer */}
        {timeRemaining && (
          <div className="flex items-center space-x-2 bg-card px-3 py-2 rounded-lg border border-border">
            <Icon name="Clock" size={16} color="var(--color-warning)" />
            <span className="text-sm font-mono text-warning font-medium">
              {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60)?.toString()?.padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Progress */}
        {showProgress && (
          <div className="flex items-center space-x-2 bg-card px-3 py-2 rounded-lg border border-border">
            <Icon name="Target" size={16} color="var(--color-accent)" />
            <span className="text-sm font-medium text-accent">
              {progress}%
            </span>
          </div>
        )}

        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow"></div>
          <span className="text-xs text-success hidden sm:block">Live</span>
        </div>
      </div>
    </div>
  );

  const GameSidebar = () => (
    gameState === 'active' && (
      <div className="hidden lg:block w-64 bg-card border-l border-border p-4">
        <div className="space-y-4">
          {/* Players */}
          <div>
            <h3 className="text-sm font-medium text-foreground mb-2">Players</h3>
            <div className="space-y-2">
              {gameData?.players?.map((player, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{player?.name}</span>
                  <span className="text-accent font-mono">{player?.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Question */}
          {gameData?.currentQuestion && (
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Question</h3>
              <div className="text-xs text-muted-foreground">
                {gameData?.currentQuestion} of {gameData?.totalQuestions}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  );

  return (
    <div className={`fixed inset-0 z-1100 bg-background ${className}`}>
      <div className="flex flex-col h-full">
        <GameHeader />
        
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-auto">
            {/* Game content will be rendered here by parent components */}
          </main>
          
          <GameSidebar />
        </div>
      </div>
    </div>
  );
};

export default GameContextOverlay;