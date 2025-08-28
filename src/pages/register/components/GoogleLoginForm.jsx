import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import GoogleLoginButton from '../../../components/GoogleLoginButton';

const GoogleLoginForm = ({ onLogin = () => {} }) => {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLoginSuccess = (userData) => {
    onLogin(userData);
  };

  const handleLoginError = (errorMessage) => {
    setError(errorMessage);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="UserCheck" size={24} color="var(--color-primary)" />
        </div>
        <h2 className="text-xl font-bold text-foreground mb-2">
          Entre na CS Quiz Arena
        </h2>
        <p className="text-muted-foreground">
          Use sua conta Google para entrar rapidamente
        </p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="bg-error/10 border border-error/20 text-error rounded-lg p-3 text-sm">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} />
              <span>{error}</span>
            </div>
          </div>
        )}

        <GoogleLoginButton 
          onSuccess={handleLoginSuccess}
          onError={handleLoginError}
        />

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Você será redirecionado para o Google para fazer login com segurança
          </p>
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta Google?{" "}
              <a href="/steam-login" className="text-primary hover:underline">
                Entre com Steam
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleLoginForm;