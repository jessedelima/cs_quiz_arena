import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const PrivacySettingsSection = ({ 
  privacySettings = {},
  onSettingsUpdate = () => {}
}) => {
  const [settings, setSettings] = useState({
    profileVisibility: 'public',
    showInLeaderboards: true,
    shareActivityStatus: true,
    allowFriendRequests: true,
    showInventoryValue: false,
    shareQuizHistory: true,
    allowSpectators: true,
    showOnlineStatus: true,
    ...privacySettings
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsUpdate(newSettings);
  };

  const profileVisibilityOptions = [
    { value: 'public', label: 'Público', description: 'Visível para todos os usuários' },
    { value: 'friends', label: 'Apenas Amigos', description: 'Visível apenas para amigos Steam' },
    { value: 'private', label: 'Privado', description: 'Visível apenas para você' }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Eye" size={20} color="var(--color-primary)" />
          <span>Visibilidade do Perfil</span>
        </h3>

        <div className="space-y-4">
          <Select
            label="Quem pode ver seu perfil"
            description="Controla quem pode visualizar suas informações básicas"
            options={profileVisibilityOptions}
            value={settings?.profileVisibility}
            onChange={(value) => handleSettingChange('profileVisibility', value)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Aparecer nos rankings"
              description="Mostrar seu nome e pontuação nos leaderboards públicos"
              checked={settings?.showInLeaderboards}
              onChange={(e) => handleSettingChange('showInLeaderboards', e?.target?.checked)}
            />

            <Checkbox
              label="Compartilhar status de atividade"
              description="Permitir que outros vejam quando você está online ou jogando"
              checked={settings?.shareActivityStatus}
              onChange={(e) => handleSettingChange('shareActivityStatus', e?.target?.checked)}
            />

            <Checkbox
              label="Aceitar solicitações de amizade"
              description="Permitir que outros usuários enviem convites de amizade"
              checked={settings?.allowFriendRequests}
              onChange={(e) => handleSettingChange('allowFriendRequests', e?.target?.checked)}
            />

            <Checkbox
              label="Mostrar valor do inventário"
              description="Exibir o valor total dos seus itens Steam no perfil"
              checked={settings?.showInventoryValue}
              onChange={(e) => handleSettingChange('showInventoryValue', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Gaming Privacy */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Gamepad2" size={20} color="var(--color-accent)" />
          <span>Privacidade de Jogos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Compartilhar histórico de quiz"
            description="Permitir que outros vejam suas partidas anteriores e estatísticas"
            checked={settings?.shareQuizHistory}
            onChange={(e) => handleSettingChange('shareQuizHistory', e?.target?.checked)}
          />

          <Checkbox
            label="Permitir espectadores"
            description="Outros usuários podem assistir suas partidas ao vivo"
            checked={settings?.allowSpectators}
            onChange={(e) => handleSettingChange('allowSpectators', e?.target?.checked)}
          />

          <Checkbox
            label="Mostrar status online"
            description="Exibir quando você está online na plataforma"
            checked={settings?.showOnlineStatus}
            onChange={(e) => handleSettingChange('showOnlineStatus', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Data Sharing */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Database" size={20} color="var(--color-warning)" />
          <span>Compartilhamento de Dados</span>
        </h3>

        <div className="space-y-4">
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-warning font-medium mb-1">Informações sobre dados:</p>
                <p className="text-muted-foreground">
                  Seus dados são utilizados apenas para melhorar sua experiência na plataforma. 
                  Nunca compartilhamos informações pessoais com terceiros sem seu consentimento.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Exportar meus dados</h4>
              <p className="text-sm text-muted-foreground">
                Baixe uma cópia de todas as suas informações e histórico
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Icon name="Download" size={16} />
              Exportar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettingsSection;