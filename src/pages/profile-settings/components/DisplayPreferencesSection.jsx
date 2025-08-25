import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const DisplayPreferencesSection = ({ 
  displaySettings = {},
  onSettingsUpdate = () => {}
}) => {
  const [settings, setSettings] = useState({
    language: 'pt-BR',
    theme: 'dark',
    currency: 'BRL',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
    numberFormat: 'pt-BR',
    showAnimations: true,
    reducedMotion: false,
    highContrast: false,
    fontSize: 'medium',
    compactMode: false,
    showTooltips: true,
    autoPlayVideos: true,
    soundEffects: true,
    ...displaySettings
  });

  const handleSettingChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onSettingsUpdate(newSettings);
    
    // Apply immediate changes for certain settings
    if (key === 'language') {
      localStorage.setItem('selectedLanguage', value);
    }
  };

  const languageOptions = [
    { value: 'pt-BR', label: 'Português (Brasil)', description: 'Idioma padrão da plataforma' },
    { value: 'en-US', label: 'English (US)', description: 'English language support' },
    { value: 'es-ES', label: 'Español', description: 'Soporte en español' }
  ];

  const themeOptions = [
    { value: 'dark', label: 'Escuro', description: 'Tema escuro para jogadores' },
    { value: 'light', label: 'Claro', description: 'Tema claro tradicional' },
    { value: 'auto', label: 'Automático', description: 'Seguir configuração do sistema' }
  ];

  const currencyOptions = [
    { value: 'BRL', label: 'Real Brasileiro (R$)', description: 'Moeda padrão brasileira' },
    { value: 'USD', label: 'Dólar Americano ($)', description: 'Para referência internacional' },
    { value: 'EUR', label: 'Euro (€)', description: 'Moeda europeia' }
  ];

  const dateFormatOptions = [
    { value: 'DD/MM/YYYY', label: 'DD/MM/AAAA', description: 'Formato brasileiro padrão' },
    { value: 'MM/DD/YYYY', label: 'MM/DD/AAAA', description: 'Formato americano' },
    { value: 'YYYY-MM-DD', label: 'AAAA-MM-DD', description: 'Formato ISO internacional' }
  ];

  const timeFormatOptions = [
    { value: '24h', label: '24 horas', description: '14:30 (formato 24h)' },
    { value: '12h', label: '12 horas', description: '2:30 PM (formato 12h)' }
  ];

  const fontSizeOptions = [
    { value: 'small', label: 'Pequeno', description: 'Texto menor para mais conteúdo' },
    { value: 'medium', label: 'Médio', description: 'Tamanho padrão recomendado' },
    { value: 'large', label: 'Grande', description: 'Texto maior para melhor legibilidade' }
  ];

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Globe" size={20} color="var(--color-primary)" />
          <span>Idioma e Região</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Idioma da interface"
            description="Idioma principal da plataforma"
            options={languageOptions}
            value={settings?.language}
            onChange={(value) => handleSettingChange('language', value)}
          />

          <Select
            label="Moeda"
            description="Moeda para exibição de valores"
            options={currencyOptions}
            value={settings?.currency}
            onChange={(value) => handleSettingChange('currency', value)}
          />

          <Select
            label="Formato de data"
            description="Como as datas serão exibidas"
            options={dateFormatOptions}
            value={settings?.dateFormat}
            onChange={(value) => handleSettingChange('dateFormat', value)}
          />

          <Select
            label="Formato de hora"
            description="Formato de exibição do horário"
            options={timeFormatOptions}
            value={settings?.timeFormat}
            onChange={(value) => handleSettingChange('timeFormat', value)}
          />
        </div>

        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="MapPin" size={20} color="var(--color-accent)" />
            <div className="text-sm">
              <p className="text-accent font-medium">Região detectada: Brasil</p>
              <p className="text-muted-foreground">
                Configurações otimizadas para usuários brasileiros
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Appearance */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Palette" size={20} color="var(--color-accent)" />
          <span>Aparência</span>
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tema"
              description="Esquema de cores da interface"
              options={themeOptions}
              value={settings?.theme}
              onChange={(value) => handleSettingChange('theme', value)}
            />

            <Select
              label="Tamanho da fonte"
              description="Tamanho do texto na interface"
              options={fontSizeOptions}
              value={settings?.fontSize}
              onChange={(value) => handleSettingChange('fontSize', value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Checkbox
              label="Modo compacto"
              description="Reduzir espaçamentos para mostrar mais conteúdo"
              checked={settings?.compactMode}
              onChange={(e) => handleSettingChange('compactMode', e?.target?.checked)}
            />

            <Checkbox
              label="Alto contraste"
              description="Aumentar contraste para melhor visibilidade"
              checked={settings?.highContrast}
              onChange={(e) => handleSettingChange('highContrast', e?.target?.checked)}
            />
          </div>
        </div>
      </div>
      {/* Animations & Effects */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Zap" size={20} color="var(--color-warning)" />
          <span>Animações e Efeitos</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Mostrar animações"
            description="Ativar transições e animações na interface"
            checked={settings?.showAnimations}
            onChange={(e) => handleSettingChange('showAnimations', e?.target?.checked)}
          />

          <Checkbox
            label="Movimento reduzido"
            description="Reduzir animações para usuários sensíveis ao movimento"
            checked={settings?.reducedMotion}
            onChange={(e) => handleSettingChange('reducedMotion', e?.target?.checked)}
          />

          <Checkbox
            label="Efeitos sonoros"
            description="Reproduzir sons para ações da interface"
            checked={settings?.soundEffects}
            onChange={(e) => handleSettingChange('soundEffects', e?.target?.checked)}
          />

          <Checkbox
            label="Reprodução automática de vídeos"
            description="Iniciar vídeos automaticamente quando visíveis"
            checked={settings?.autoPlayVideos}
            onChange={(e) => handleSettingChange('autoPlayVideos', e?.target?.checked)}
          />
        </div>
      </div>
      {/* User Experience */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="User" size={20} color="var(--color-success)" />
          <span>Experiência do Usuário</span>
        </h3>

        <div className="space-y-4">
          <Checkbox
            label="Mostrar dicas de ferramentas"
            description="Exibir informações adicionais ao passar o mouse sobre elementos"
            checked={settings?.showTooltips}
            onChange={(e) => handleSettingChange('showTooltips', e?.target?.checked)}
          />

          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="Lightbulb" size={20} color="var(--color-success)" className="flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="text-success font-medium mb-1">Dica de acessibilidade:</p>
                <p className="text-muted-foreground">
                  As configurações de acessibilidade ajudam a tornar a plataforma mais inclusiva. 
                  Experimente diferentes opções para encontrar a melhor experiência para você.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Preview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="Eye" size={20} color="var(--color-muted-foreground)" />
          <span>Visualização</span>
        </h3>

        <div className="bg-muted rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">Exemplo de formatação</h4>
            <span className="text-sm text-muted-foreground">
              {new Date()?.toLocaleDateString('pt-BR', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Moeda:</span>
              <span className="text-foreground font-mono">R$ 1.250,00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Horário:</span>
              <span className="text-foreground font-mono">
                {settings?.timeFormat === '24h' ? '14:30' : '2:30 PM'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Idioma:</span>
              <span className="text-foreground">
                {languageOptions?.find(opt => opt?.value === settings?.language)?.label}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisplayPreferencesSection;