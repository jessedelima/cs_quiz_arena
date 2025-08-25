import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const HostControls = ({ 
  canStartGame = false,
  participantCount = 0,
  minPlayers = 2,
  onStartGame = () => {},
  onUpdateSettings = () => {},
  lobbySettings = {}
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({
    difficulty: lobbySettings?.difficulty || 'médio',
    questionCount: lobbySettings?.questionCount || 10,
    timePerQuestion: lobbySettings?.timePerQuestion || 15,
    entryFee: lobbySettings?.entryFee || 100
  });

  const difficultyOptions = [
    { value: 'fácil', label: 'Fácil', description: 'Perguntas básicas sobre CS' },
    { value: 'médio', label: 'Médio', description: 'Conhecimento intermediário' },
    { value: 'difícil', label: 'Difícil', description: 'Para especialistas' }
  ];

  const questionCountOptions = [
    { value: 5, label: '5 perguntas' },
    { value: 10, label: '10 perguntas' },
    { value: 15, label: '15 perguntas' },
    { value: 20, label: '20 perguntas' }
  ];

  const timeOptions = [
    { value: 10, label: '10 segundos' },
    { value: 15, label: '15 segundos' },
    { value: 20, label: '20 segundos' },
    { value: 30, label: '30 segundos' }
  ];

  const entryFeeOptions = [
    { value: 0, label: 'Gratuito' },
    { value: 50, label: '50 coins' },
    { value: 100, label: '100 coins' },
    { value: 250, label: '250 coins' },
    { value: 500, label: '500 coins' },
    { value: 1000, label: '1000 coins' }
  ];

  const handleSettingsUpdate = () => {
    onUpdateSettings(settings);
    setIsSettingsOpen(false);
  };

  const getStartButtonText = () => {
    if (participantCount < minPlayers) {
      return `Aguardando jogadores (${participantCount}/${minPlayers})`;
    }
    return canStartGame ? 'Iniciar Quiz' : 'Aguardando jogadores prontos';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">
          Controles do Host
        </h2>
        <Icon name="Crown" size={20} color="var(--color-warning)" />
      </div>
      <div className="space-y-4">
        {/* Start Game Button */}
        <Button
          variant={canStartGame ? "default" : "outline"}
          fullWidth
          disabled={!canStartGame}
          onClick={onStartGame}
          iconName={canStartGame ? "Play" : "Clock"}
          iconPosition="left"
          className="h-12"
        >
          {getStartButtonText()}
        </Button>

        {/* Game Status */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-background rounded-lg p-3 border border-border">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="Users" size={14} color="var(--color-accent)" />
              <span className="text-muted-foreground">Jogadores</span>
            </div>
            <span className="font-mono font-medium text-accent">
              {participantCount} conectados
            </span>
          </div>

          <div className="bg-background rounded-lg p-3 border border-border">
            <div className="flex items-center space-x-2 mb-1">
              <Icon name="CheckCircle" size={14} color="var(--color-success)" />
              <span className="text-muted-foreground">Status</span>
            </div>
            <span className={`font-medium ${canStartGame ? 'text-success' : 'text-warning'}`}>
              {canStartGame ? 'Pronto' : 'Aguardando'}
            </span>
          </div>
        </div>

        {/* Settings Toggle */}
        <Button
          variant="outline"
          fullWidth
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          iconName={isSettingsOpen ? "ChevronUp" : "Settings"}
          iconPosition="left"
        >
          {isSettingsOpen ? 'Fechar Configurações' : 'Configurações do Lobby'}
        </Button>

        {/* Settings Panel */}
        {isSettingsOpen && (
          <div className="space-y-4 p-4 bg-background rounded-lg border border-border">
            <Select
              label="Dificuldade"
              options={difficultyOptions}
              value={settings?.difficulty}
              onChange={(value) => setSettings(prev => ({ ...prev, difficulty: value }))}
            />

            <Select
              label="Número de Perguntas"
              options={questionCountOptions}
              value={settings?.questionCount}
              onChange={(value) => setSettings(prev => ({ ...prev, questionCount: value }))}
            />

            <Select
              label="Tempo por Pergunta"
              options={timeOptions}
              value={settings?.timePerQuestion}
              onChange={(value) => setSettings(prev => ({ ...prev, timePerQuestion: value }))}
            />

            <Select
              label="Taxa de Entrada"
              options={entryFeeOptions}
              value={settings?.entryFee}
              onChange={(value) => setSettings(prev => ({ ...prev, entryFee: value }))}
            />

            <div className="flex space-x-2 pt-2">
              <Button
                variant="default"
                onClick={handleSettingsUpdate}
                iconName="Check"
                iconPosition="left"
                className="flex-1"
              >
                Salvar
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsSettingsOpen(false)}
                iconName="X"
                iconPosition="left"
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            iconName="Copy"
            iconPosition="left"
            onClick={() => navigator.clipboard?.writeText(window.location?.href)}
          >
            Copiar Link
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Share"
            iconPosition="left"
          >
            Compartilhar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HostControls;