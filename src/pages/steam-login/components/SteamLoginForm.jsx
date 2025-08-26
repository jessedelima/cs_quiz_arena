import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SteamLoginForm = ({ onLogin = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate Steam OpenID authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful authentication
      const mockUser = {
        steamId: '76561198123456789',
        username: 'CS_ProPlayer',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
        profileUrl: 'https://steamcommunity.com/id/cs_proplayer',
        coins: 1250
      };

      onLogin(mockUser);
      navigate('/dashboard');
    } catch (err) {
      setError('Falha na autenticação Steam. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-card border border-border rounded-lg p-8 shadow-card">
        {/* Steam Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#1b2838] rounded-lg flex items-center justify-center mx-auto mb-4">
            <Icon name="Gamepad2" size={32} color="#66c0f4" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Entrar com Steam
          </h2>
          <p className="text-muted-foreground text-sm">
            Use sua conta Steam para acessar o CS Quiz Arena
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm text-error">{error}</span>
            </div>
          </div>
        )}

        {/* Steam Login Button */}
        <Button
          onClick={handleSteamLogin}
          loading={isLoading}
          fullWidth
          className="bg-[#66c0f4] hover:bg-[#5ba3d4] text-white border-0 h-12 text-base font-medium mb-4"
          disabled={isLoading}
        >
          {!isLoading && (
            <div className="flex items-center justify-center space-x-3">
              <Icon name="Gamepad2" size={20} color="white" />
              <span>Entrar com Steam</span>
            </div>
          )}
          {isLoading && <span>Conectando...</span>}
        </Button>

        {/* Security Notice */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground mb-4">
            Você será redirecionado para o Steam para fazer login com segurança
          </p>
          <div className="border-t border-border pt-4 mt-2">
            <p className="text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <a href="/register" className="text-primary hover:underline">
                Registre-se com email
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SteamLoginForm;