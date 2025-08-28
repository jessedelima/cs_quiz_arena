import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import GoogleLoginForm from './components/GoogleLoginForm';
import ValueProposition from '../steam-login/components/ValueProposition';
import TrustSignals from '../steam-login/components/TrustSignals';
import LanguageSelector from '../steam-login/components/LanguageSelector';
import LoginFooter from '../steam-login/components/LoginFooter';

const RegisterPage = () => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cs-quiz-language') || 'pt-BR';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('cs-quiz-language', languageCode);
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
            <Link to="/" className="flex items-center space-x-2">
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
            <GoogleLoginForm onLogin={handleLogin} />
          </div>

          {/* Trust Signals */}
          <div className="mb-16">
            <TrustSignals />
          </div>
        </div>
      </main>

      {/* Footer */}
      <LoginFooter />
    </div>
  );
};

export default RegisterPage;