import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

// Import all section components
import SteamIntegrationSection from './components/SteamIntegrationSection';
import PrivacySettingsSection from './components/PrivacySettingsSection';
import NotificationPreferencesSection from './components/NotificationPreferencesSection';
import DisplayPreferencesSection from './components/DisplayPreferencesSection';
import SecuritySection from './components/SecuritySection';
import AccountManagementSection from './components/AccountManagementSection';
import ProfileEditSection from './components/ProfileEditSection';

const ProfileSettings = () => {
  const [activeTab, setActiveTab] = useState('steam');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Mock user data
  const mockUser = {
    username: 'CS_ProPlayer_BR',
    email: 'player@email.com',
    fullName: 'Carlos Silva',
    bio: 'Jogador profissional de CS:GO com mais de 5 anos de experiência em competições.',
    country: 'Brasil',
    steamId: '76561198123456789',
    balance: 1250,
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
    socialLinks: {
      twitter: 'https://twitter.com/cs_proplayer',
      twitch: 'https://twitch.tv/cs_proplayer',
      youtube: '',
      instagram: 'https://instagram.com/cs_proplayer'
    }
  };

  const mockNotifications = [
    {
      id: 1,
      type: 'trade-offer',
      title: 'Nova oferta de troca',
      message: 'Você recebeu uma oferta de troca no Steam',
      timestamp: new Date(Date.now() - 300000)
    }
  ];

  // Check for saved language preference on load
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
    }
  }, []);

  const settingsTabs = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: 'UserCircle',
      description: 'Editar dados do perfil'
    },
    {
      id: 'steam',
      label: 'Steam',
      icon: 'Link',
      description: 'Integração e configurações Steam'
    },
    {
      id: 'privacy',
      label: 'Privacidade',
      icon: 'Eye',
      description: 'Controle de visibilidade e dados'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: 'Bell',
      description: 'Preferências de alertas'
    },
    {
      id: 'display',
      label: 'Exibição',
      icon: 'Monitor',
      description: 'Idioma e aparência'
    },
    {
      id: 'security',
      label: 'Segurança',
      icon: 'Shield',
      description: 'Senha e autenticação'
    },
    {
      id: 'account',
      label: 'Conta',
      icon: 'User',
      description: 'Dados e exclusão'
    }
  ];

  const handleTabChange = (tabId) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm('Você tem alterações não salvas. Deseja continuar?');
      if (!confirmLeave) return;
    }
    setActiveTab(tabId);
    setIsMobileMenuOpen(false);
    setHasUnsavedChanges(false);
  };

  const handleSettingsUpdate = (section, settings) => {
    setHasUnsavedChanges(true);
    console.log(`Updating ${section} settings:`, settings);
    
    // Handle language changes immediately
    if (section === 'display' && settings?.language) {
      setCurrentLanguage(settings?.language);
      localStorage.setItem('selectedLanguage', settings?.language);
    }
  };

  const handleSteamIntegration = {
    onTradeUrlUpdate: (url) => {
      console.log('Updating trade URL:', url);
      setHasUnsavedChanges(false);
    },
    onTestTradeUrl: async (url) => {
      console.log('Testing trade URL:', url);
      // Simulate API call
      return new Promise((resolve) => setTimeout(resolve, 2000));
    },
    onDisconnectSteam: () => {
      console.log('Disconnecting Steam account');
      setHasUnsavedChanges(false);
    }
  };

  const handleSecurity = {
    onPasswordChange: (passwordData) => {
      console.log('Changing password');
      setHasUnsavedChanges(false);
    },
    onTwoFactorToggle: (enabled) => {
      console.log('2FA toggled:', enabled);
      setHasUnsavedChanges(false);
    },
    onSessionRevoke: (sessionId) => {
      console.log('Revoking session:', sessionId);
    }
  };

  const handleAccountManagement = {
    onDataExport: async (type) => {
      console.log('Exporting data type:', type);
      // Simulate export process
      return new Promise((resolve) => setTimeout(resolve, 3000));
    },
    onAccountDeletion: () => {
      console.log('Account deletion requested');
      alert('Solicitação de exclusão enviada. Você receberá um email de confirmação.');
    }
  };

  const handleProfileUpdate = (profileData) => {
    console.log('Updating profile data:', profileData);
    // Em um aplicativo real, você enviaria os dados para o servidor aqui
    setHasUnsavedChanges(false);
    alert('Perfil atualizado com sucesso!');
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileEditSection
            currentUser={mockUser}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      case 'steam':
        return (
          <SteamIntegrationSection
            {...handleSteamIntegration}
          />
        );
      case 'privacy':
        return (
          <PrivacySettingsSection
            onSettingsUpdate={(settings) => handleSettingsUpdate('privacy', settings)}
          />
        );
      case 'notifications':
        return (
          <NotificationPreferencesSection
            onSettingsUpdate={(settings) => handleSettingsUpdate('notifications', settings)}
          />
        );
      case 'display':
        return (
          <DisplayPreferencesSection
            onSettingsUpdate={(settings) => handleSettingsUpdate('display', settings)}
          />
        );
      case 'security':
        return (
          <SecuritySection
            {...handleSecurity}
          />
        );
      case 'account':
        return (
          <AccountManagementSection
            {...handleAccountManagement}
          />
        );
      default:
        return null;
    }
  };

  const currentTab = settingsTabs?.find(tab => tab?.id === activeTab);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Configurações do Perfil - CS Quiz Arena</title>
        <meta name="description" content="Gerencie suas configurações de conta, integração Steam e preferências na CS Quiz Arena" />
      </Helmet>
      <GlobalHeader 
        user={mockUser}
        balance={mockUser?.balance}
        notifications={mockNotifications}
      />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Settings" size={28} color="var(--color-primary)" />
              <h1 className="text-3xl font-bold text-foreground">
                Configurações do Perfil
              </h1>
            </div>
            <p className="text-muted-foreground">
              Gerencie suas preferências de conta, integração Steam e configurações de privacidade
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-24">
                <h2 className="text-lg font-semibold text-card-foreground mb-4">
                  Categorias
                </h2>
                <nav className="space-y-2">
                  {settingsTabs?.map((tab) => (
                    <button
                      key={tab?.id}
                      onClick={() => handleTabChange(tab?.id)}
                      className={`
                        w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left gaming-transition
                        ${activeTab === tab?.id
                          ? 'bg-primary text-primary-foreground gaming-glow'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        }
                      `}
                    >
                      <Icon name={tab?.icon} size={20} />
                      <div className="flex-1">
                        <div className="font-medium">{tab?.label}</div>
                        <div className="text-xs opacity-80">{tab?.description}</div>
                      </div>
                    </button>
                  ))}
                </nav>

                {hasUnsavedChanges && (
                  <div className="mt-6 p-4 bg-warning/10 border border-warning/20 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Icon name="AlertTriangle" size={16} color="var(--color-warning)" />
                      <span className="text-sm text-warning font-medium">
                        Alterações não salvas
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Tab Selector */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full justify-between mb-4"
              >
                <div className="flex items-center space-x-2">
                  <Icon name={currentTab?.icon} size={20} />
                  <span>{currentTab?.label}</span>
                </div>
                <Icon 
                  name="ChevronDown" 
                  size={20} 
                  className={`gaming-transition ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                />
              </Button>

              {isMobileMenuOpen && (
                <div className="bg-card border border-border rounded-lg p-4 mb-6 animate-slide-in">
                  <div className="grid grid-cols-2 gap-2">
                    {settingsTabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => handleTabChange(tab?.id)}
                        className={`
                          flex flex-col items-center space-y-2 p-3 rounded-lg gaming-transition
                          ${activeTab === tab?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                          }
                        `}
                      >
                        <Icon name={tab?.icon} size={24} />
                        <span className="text-sm font-medium">{tab?.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="bg-card border border-border rounded-lg">
                {/* Section Header */}
                <div className="p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <Icon name={currentTab?.icon} size={24} color="var(--color-primary)" />
                    <div>
                      <h2 className="text-xl font-semibold text-card-foreground">
                        {currentTab?.label}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {currentTab?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Section Content */}
                <div className="p-6">
                  {renderActiveSection()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;