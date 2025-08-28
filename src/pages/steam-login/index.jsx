import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import SteamLoginForm from './components/SteamLoginForm';
import ValueProposition from './components/ValueProposition';
import TrustSignals from './components/TrustSignals';
import LanguageSelector from './components/LanguageSelector';
import LoginFooter from './components/LoginFooter';

const SteamLoginPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cs-quiz-language') || 'pt-BR';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem('cs-quiz-user', JSON.stringify(userData));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/steam-login" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                CS Quiz Arena
              </span>
            </Link>

            {/* Language Selector */}
            <LanguageSelector onLanguageChange={handleLanguageChange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <ValueProposition />
          </div>

          {/* Login Section */}
          <div className="max-w-md mx-auto mb-16">
            <SteamLoginForm onLogin={handleLogin} />
          </div>

          {/* Trust Signals */}
          <div className="mb-16">
            <TrustSignals />
          </div>

          {/* How It Works */}
          <div className="bg-card border border-border rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Como Funciona
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Faça Login
                </h3>
                <p className="text-sm text-muted-foreground">
                  Entre com sua conta Steam para começar a jogar
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Entre em Lobbies
                </h3>
                <p className="text-sm text-muted-foreground">
                  Escolha um lobby e pague a taxa de entrada
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Ganhe Prêmios
                </h3>
                <p className="text-sm text-muted-foreground">
                  Responda perguntas e ganhe moedas e skins
                </p>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-card border border-border rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Perguntas Frequentes
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  É seguro fazer login com Steam?
                </h3>
                <p className="text-muted-foreground">
                  Sim, utilizamos o Steam OpenID, que é o método oficial e seguro 
                  de autenticação da Valve. Nunca temos acesso à sua senha.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Como funcionam os prêmios?
                </h3>
                <p className="text-muted-foreground">
                  Os prêmios são distribuídos automaticamente após cada quiz. 
                  Você pode sacar suas moedas ou trocar por skins do CS.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Preciso depositar dinheiro para jogar?
                </h3>
                <p className="text-muted-foreground">
                  Você recebe moedas gratuitas ao se cadastrar. Depósitos adicionais 
                  são opcionais para participar de lobbies com prêmios maiores.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <LoginFooter />
    </div>
  );
};

export default SteamLoginPage;