import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SteamIntegrationSection = ({ 
  steamProfile = null,
  tradeUrl = '',
  onTradeUrlUpdate = () => {},
  onTestTradeUrl = () => {},
  onDisconnectSteam = () => {}
}) => {
  const [localTradeUrl, setLocalTradeUrl] = useState(tradeUrl);
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [urlTestResult, setUrlTestResult] = useState(null);

  const handleTradeUrlChange = (e) => {
    setLocalTradeUrl(e?.target?.value);
    setUrlTestResult(null);
  };

  const handleSaveTradeUrl = () => {
    onTradeUrlUpdate(localTradeUrl);
  };

  const handleTestUrl = async () => {
    setIsTestingUrl(true);
    try {
      await onTestTradeUrl(localTradeUrl);
      setUrlTestResult({ success: true, message: 'URL de troca válida!' });
    } catch (error) {
      setUrlTestResult({ success: false, message: 'URL de troca inválida ou inacessível' });
    }
    setIsTestingUrl(false);
  };

  const mockSteamProfile = steamProfile || {
    steamId: '76561198123456789',
    username: 'CS_ProPlayer_BR',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    profileUrl: 'https://steamcommunity.com/id/cs_proplayer_br',
    level: 42,
    gamesOwned: 156,
    isConnected: true
  };

  return (
    <div className="space-y-6">
      {/* Steam Profile Connection */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
            <Icon name="Steam" size={20} color="var(--color-primary)" />
            <span>Integração Steam</span>
          </h3>
          {mockSteamProfile?.isConnected && (
            <div className="flex items-center space-x-2 text-success">
              <Icon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">Conectado</span>
            </div>
          )}
        </div>

        {mockSteamProfile?.isConnected ? (
          <div className="space-y-4">
            {/* Steam Profile Display */}
            <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg">
              <Image
                src={mockSteamProfile?.avatar}
                alt="Steam Avatar"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-foreground">{mockSteamProfile?.username}</h4>
                <p className="text-sm text-muted-foreground">Steam ID: {mockSteamProfile?.steamId}</p>
                <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                  <span>Nível {mockSteamProfile?.level}</span>
                  <span>•</span>
                  <span>{mockSteamProfile?.gamesOwned} jogos</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(mockSteamProfile?.profileUrl, '_blank')}
              >
                <Icon name="ExternalLink" size={16} />
                Ver Perfil
              </Button>
            </div>

            {/* Disconnect Option */}
            <div className="flex items-center justify-between p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div>
                <h4 className="font-medium text-foreground">Desconectar Steam</h4>
                <p className="text-sm text-muted-foreground">
                  Isso removerá o acesso aos seus itens e histórico de trocas
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={onDisconnectSteam}
              >
                Desconectar
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Icon name="Steam" size={48} color="var(--color-muted-foreground)" className="mx-auto mb-4" />
            <h4 className="font-semibold text-foreground mb-2">Steam não conectado</h4>
            <p className="text-muted-foreground mb-4">
              Conecte sua conta Steam para participar de trocas e acessar seu inventário
            </p>
            <Button variant="default">
              <Icon name="Link" size={16} />
              Conectar Steam
            </Button>
          </div>
        )}
      </div>
      {/* Trade URL Management */}
      {mockSteamProfile?.isConnected && (
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
            <Icon name="ArrowRightLeft" size={20} color="var(--color-accent)" />
            <span>URL de Troca Steam</span>
          </h3>

          <div className="space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Icon name="Info" size={20} color="var(--color-accent)" className="flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="text-accent font-medium mb-1">Como obter sua URL de troca:</p>
                  <ol className="text-muted-foreground space-y-1 list-decimal list-inside">
                    <li>Acesse seu inventário Steam</li>
                    <li>Clique em "Configurações de Privacidade do Inventário"</li>
                    <li>Defina como "Público" ou "Somente Amigos"</li>
                    <li>Copie sua "URL de Troca" e cole abaixo</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Input
                label="URL de Troca Steam"
                type="url"
                placeholder="https://steamcommunity.com/tradeoffer/new/?partner=123456789&token=AbCdEfGh"
                value={localTradeUrl}
                onChange={handleTradeUrlChange}
                description="Esta URL será usada para enviar ofertas de troca automaticamente"
                error={urlTestResult && !urlTestResult?.success ? urlTestResult?.message : ''}
              />

              {urlTestResult && urlTestResult?.success && (
                <div className="flex items-center space-x-2 text-success text-sm">
                  <Icon name="CheckCircle" size={16} />
                  <span>{urlTestResult?.message}</span>
                </div>
              )}

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={handleTestUrl}
                  loading={isTestingUrl}
                  disabled={!localTradeUrl?.trim()}
                >
                  <Icon name="TestTube" size={16} />
                  Testar URL
                </Button>
                <Button
                  variant="default"
                  onClick={handleSaveTradeUrl}
                  disabled={!localTradeUrl?.trim() || localTradeUrl === tradeUrl}
                >
                  <Icon name="Save" size={16} />
                  Salvar URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SteamIntegrationSection;