import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox, CheckboxGroup } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const NotificationPreferencesSection = ({ 
  notificationSettings = {},
  onSettingsUpdate = () => {}
}) => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    browserNotifications: false,
    steamMessages: true,
    quizInvitations: true,
    tradeOffers: true,
    promotionalEmails: false,
    weeklyDigest: true,
    securityAlerts: true,
    friendRequests: true,
    lobbyUpdates: true,
    prizeNotifications: true,
    maintenanceAlerts: true,
    notificationFrequency: 'immediate',
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    ...notificationSettings
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsUpdate(newSettings);
  };

  const frequencyOptions = [
    { value: 'immediate', label: 'Imediato', description: 'Receber notificações instantaneamente' },
    { value: 'hourly', label: 'A cada hora', description: 'Agrupar notificações por hora' },
    { value: 'daily', label: 'Diário', description: 'Resumo diário das notificações' },
    { value: 'weekly', label: 'Semanal', description: 'Resumo semanal apenas' }
  ];

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Bell" size={20} color="var(--color-primary)" />
          <span>Canais de Notificação</span>
        </h3>

        <div className="space-y-4">
          <CheckboxGroup label="Métodos de notificação">
            <Checkbox
              label="Notificações por email"
              description="Receber alertas importantes por email"
              checked={settings?.emailNotifications}
              onChange={(e) => handleSettingChange('emailNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Notificações do navegador"
              description="Mostrar notificações push no navegador"
              checked={settings?.browserNotifications}
              onChange={(e) => handleSettingChange('browserNotifications', e?.target?.checked)}
            />

            <Checkbox
              label="Mensagens Steam"
              description="Enviar notificações através do Steam"
              checked={settings?.steamMessages}
              onChange={(e) => handleSettingChange('steamMessages', e?.target?.checked)}
            />
          </CheckboxGroup>

          <Select
            label="Frequência das notificações"
            description="Com que frequência você deseja receber notificações agrupadas"
            options={frequencyOptions}
            value={settings?.notificationFrequency}
            onChange={(value) => handleSettingChange('notificationFrequency', value)}
            className="mt-4"
          />
        </div>
      </div>
      {/* Game Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Gamepad2" size={20} color="var(--color-accent)" />
          <span>Notificações de Jogos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Convites para quiz"
            description="Quando alguém te convidar para uma partida"
            checked={settings?.quizInvitations}
            onChange={(e) => handleSettingChange('quizInvitations', e?.target?.checked)}
          />

          <Checkbox
            label="Atualizações de lobby"
            description="Mudanças nos lobbies que você está participando"
            checked={settings?.lobbyUpdates}
            onChange={(e) => handleSettingChange('lobbyUpdates', e?.target?.checked)}
          />

          <Checkbox
            label="Notificações de prêmios"
            description="Quando você ganhar moedas ou itens"
            checked={settings?.prizeNotifications}
            onChange={(e) => handleSettingChange('prizeNotifications', e?.target?.checked)}
          />

          <Checkbox
            label="Solicitações de amizade"
            description="Novos pedidos de amizade na plataforma"
            checked={settings?.friendRequests}
            onChange={(e) => handleSettingChange('friendRequests', e?.target?.checked)}
          />
        </div>
      </div>
      {/* Trading Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="ArrowRightLeft" size={20} color="var(--color-warning)" />
          <span>Notificações de Trocas</span>
        </h3>

        <div className="space-y-4">
          <Checkbox
            label="Ofertas de troca"
            description="Quando receber uma nova oferta de troca Steam"
            checked={settings?.tradeOffers}
            onChange={(e) => handleSettingChange('tradeOffers', e?.target?.checked)}
          />

          <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-accent font-medium mb-1">Importante:</p>
                <p className="text-muted-foreground">
                  As notificações de troca são essenciais para não perder ofertas importantes. 
                  Recomendamos manter esta opção ativada.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* System Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Settings" size={20} color="var(--color-success)" />
          <span>Notificações do Sistema</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Alertas de segurança"
              description="Logins suspeitos e alterações de conta"
              checked={settings?.securityAlerts}
              onChange={(e) => handleSettingChange('securityAlerts', e?.target?.checked)}
              disabled
            />

            <Checkbox
              label="Alertas de manutenção"
              description="Quando a plataforma estiver em manutenção"
              checked={settings?.maintenanceAlerts}
              onChange={(e) => handleSettingChange('maintenanceAlerts', e?.target?.checked)}
            />

            <Checkbox
              label="Emails promocionais"
              description="Ofertas especiais e novidades da plataforma"
              checked={settings?.promotionalEmails}
              onChange={(e) => handleSettingChange('promotionalEmails', e?.target?.checked)}
            />

            <Checkbox
              label="Resumo semanal"
              description="Estatísticas e conquistas da semana"
              checked={settings?.weeklyDigest}
              onChange={(e) => handleSettingChange('weeklyDigest', e?.target?.checked)}
            />
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Icon name="Shield" size={20} color="var(--color-warning)" />
              <div className="text-sm">
                <p className="text-warning font-medium">Alertas de segurança obrigatórios</p>
                <p className="text-muted-foreground mt-1">
                  Por motivos de segurança, não é possível desativar alertas relacionados à segurança da conta.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Quiet Hours */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Moon" size={20} color="var(--color-muted-foreground)" />
          <span>Horário Silencioso</span>
        </h3>

        <div className="space-y-4">
          <Checkbox
            label="Ativar horário silencioso"
            description="Pausar notificações não urgentes durante determinado período"
            checked={settings?.quietHours}
            onChange={(e) => handleSettingChange('quietHours', e?.target?.checked)}
          />

          {settings?.quietHours && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Início
                </label>
                <input
                  type="time"
                  value={settings?.quietStart}
                  onChange={(e) => handleSettingChange('quietStart', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Fim
                </label>
                <input
                  type="time"
                  value={settings?.quietEnd}
                  onChange={(e) => handleSettingChange('quietEnd', e?.target?.value)}
                  className="w-full px-3 py-2 bg-input border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPreferencesSection;