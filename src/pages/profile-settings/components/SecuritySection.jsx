import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';

const SecuritySection = ({ 
  securityData = {},
  onPasswordChange = () => {},
  onTwoFactorToggle = () => {},
  onSessionRevoke = () => {}
}) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const mockSecurityData = {
    lastLogin: new Date(Date.now() - 3600000), // 1 hour ago
    loginHistory: [
      {
        id: 1,
        location: 'São Paulo, Brasil',
        device: 'Chrome no Windows',
        ip: '192.168.1.100',
        timestamp: new Date(Date.now() - 3600000),
        current: true
      },
      {
        id: 2,
        location: 'Rio de Janeiro, Brasil',
        device: 'Firefox no Android',
        ip: '192.168.1.101',
        timestamp: new Date(Date.now() - 86400000),
        current: false
      },
      {
        id: 3,
        location: 'Belo Horizonte, Brasil',
        device: 'Safari no iPhone',
        ip: '192.168.1.102',
        timestamp: new Date(Date.now() - 172800000),
        current: false
      }
    ],
    activeSessions: [
      {
        id: 1,
        device: 'Chrome no Windows',
        location: 'São Paulo, Brasil',
        lastActive: new Date(Date.now() - 300000),
        current: true
      },
      {
        id: 2,
        device: 'App Mobile Android',
        location: 'São Paulo, Brasil',
        lastActive: new Date(Date.now() - 1800000),
        current: false
      }
    ],
    ...securityData
  };

  const handlePasswordFormChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = () => {
    if (passwordForm?.newPassword !== passwordForm?.confirmPassword) {
      return;
    }
    onPasswordChange(passwordForm);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setShowPasswordForm(false);
  };

  const handleTwoFactorToggle = (enabled) => {
    setTwoFactorEnabled(enabled);
    onTwoFactorToggle(enabled);
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutos atrás`;
    if (hours < 24) return `${hours} horas atrás`;
    return `${days} dias atrás`;
  };

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Lock" size={20} color="var(--color-primary)" />
          <span>Segurança da Senha</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <h4 className="font-medium text-foreground">Alterar senha</h4>
              <p className="text-sm text-muted-foreground">
                Última alteração: há 3 meses
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPasswordForm(!showPasswordForm)}
            >
              {showPasswordForm ? 'Cancelar' : 'Alterar Senha'}
            </Button>
          </div>

          {showPasswordForm && (
            <div className="space-y-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
              <Input
                label="Senha atual"
                type="password"
                value={passwordForm?.currentPassword}
                onChange={(e) => handlePasswordFormChange('currentPassword', e?.target?.value)}
                placeholder="Digite sua senha atual"
              />
              <Input
                label="Nova senha"
                type="password"
                value={passwordForm?.newPassword}
                onChange={(e) => handlePasswordFormChange('newPassword', e?.target?.value)}
                placeholder="Digite a nova senha"
                description="Mínimo 8 caracteres com letras e números"
              />
              <Input
                label="Confirmar nova senha"
                type="password"
                value={passwordForm?.confirmPassword}
                onChange={(e) => handlePasswordFormChange('confirmPassword', e?.target?.value)}
                placeholder="Confirme a nova senha"
                error={passwordForm?.confirmPassword && passwordForm?.newPassword !== passwordForm?.confirmPassword ? 'Senhas não coincidem' : ''}
              />
              <div className="flex space-x-3">
                <Button
                  variant="default"
                  onClick={handlePasswordSubmit}
                  disabled={!passwordForm?.currentPassword || !passwordForm?.newPassword || passwordForm?.newPassword !== passwordForm?.confirmPassword}
                >
                  Salvar Nova Senha
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Two-Factor Authentication */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Shield" size={20} color="var(--color-success)" />
          <span>Autenticação de Dois Fatores</span>
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-foreground">2FA via Steam Guard</h4>
                {twoFactorEnabled ? (
                  <div className="flex items-center space-x-1 text-success">
                    <Icon name="CheckCircle" size={16} />
                    <span className="text-sm font-medium">Ativo</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-warning">
                    <Icon name="AlertTriangle" size={16} />
                    <span className="text-sm font-medium">Inativo</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {twoFactorEnabled 
                  ? 'Sua conta está protegida com autenticação de dois fatores'
                  : 'Adicione uma camada extra de segurança à sua conta'
                }
              </p>
            </div>
            <Checkbox
              checked={twoFactorEnabled}
              onChange={(e) => handleTwoFactorToggle(e?.target?.checked)}
            />
          </div>

          {!twoFactorEnabled && (
            <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-warning font-medium mb-1">Recomendação de segurança:</p>
                  <p className="text-muted-foreground">
                    Ative a autenticação de dois fatores para proteger sua conta contra acessos não autorizados. 
                    Isso é especialmente importante para contas com itens valiosos.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Login History */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="History" size={20} color="var(--color-accent)" />
          <span>Histórico de Login</span>
        </h3>

        <div className="space-y-3">
          {mockSecurityData?.loginHistory?.map((login) => (
            <div key={login?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${login?.current ? 'bg-success' : 'bg-muted-foreground'}`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{login?.device}</span>
                    {login?.current && (
                      <span className="text-xs bg-success/20 text-success px-2 py-1 rounded-full">
                        Atual
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {login?.location} • {login?.ip}
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatRelativeTime(login?.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Active Sessions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Monitor" size={20} color="var(--color-warning)" />
          <span>Sessões Ativas</span>
        </h3>

        <div className="space-y-3">
          {mockSecurityData?.activeSessions?.map((session) => (
            <div key={session?.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <Icon name="Smartphone" size={20} color="var(--color-muted-foreground)" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-foreground">{session?.device}</span>
                    {session?.current && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                        Esta sessão
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {session?.location} • Ativo {formatRelativeTime(session?.lastActive)}
                  </div>
                </div>
              </div>
              {!session?.current && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onSessionRevoke(session?.id)}
                >
                  Revogar
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button variant="destructive" onClick={() => onSessionRevoke('all')}>
            <Icon name="LogOut" size={16} />
            Revogar Todas as Outras Sessões
          </Button>
        </div>
      </div>
      {/* Security Recommendations */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="ShieldCheck" size={20} color="var(--color-success)" />
          <span>Recomendações de Segurança</span>
        </h3>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-success/10 border border-success/20 rounded-lg">
            <Icon name="CheckCircle" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-success font-medium">Conta Steam conectada</p>
              <p className="text-muted-foreground">Sua conta Steam está devidamente vinculada</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-warning/10 border border-warning/20 rounded-lg">
            <Icon name="AlertTriangle" size={20} color="var(--color-warning)" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-warning font-medium">Ative a autenticação de dois fatores</p>
              <p className="text-muted-foreground">Proteja sua conta com uma camada adicional de segurança</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-accent/10 border border-accent/20 rounded-lg">
            <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-accent font-medium">Mantenha sua senha segura</p>
              <p className="text-muted-foreground">Use uma senha única e forte para sua conta</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;