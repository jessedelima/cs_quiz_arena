import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import GoogleLoginButton from '../../../components/auth/GoogleLoginButton';
import { authApi } from '../../../api/apiService';

const SteamLoginForm = ({ onLogin = () => {} }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const navigate = useNavigate();

  const handleSteamLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Em um ambiente real, redirecionaríamos para a URL de autenticação do Steam
      // Aqui vamos abrir uma nova janela simulando o processo de login do Steam
      const steamLoginWindow = window.open('', 'SteamLogin', 'width=800,height=600,left=200,top=100');
      
      if (!steamLoginWindow) {
        throw new Error('Não foi possível abrir a janela de login do Steam. Verifique se os pop-ups estão permitidos.');
      }
      
      // Criar conteúdo HTML para a janela de login do Steam
      steamLoginWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Steam Login</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #1b2838;
              color: #c6d4df;
              margin: 0;
              padding: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .steam-login {
              background-color: #2a3f5a;
              border-radius: 4px;
              padding: 20px;
              width: 300px;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .steam-logo {
              text-align: center;
              margin-bottom: 20px;
            }
            .form-group {
              margin-bottom: 15px;
            }
            label {
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
            }
            input {
              width: 100%;
              padding: 8px;
              border: 1px solid #366996;
              background-color: #32404e;
              color: #c6d4df;
              border-radius: 2px;
              box-sizing: border-box;
            }
            button {
              width: 100%;
              padding: 10px;
              background-color: #66c0f4;
              color: white;
              border: none;
              border-radius: 2px;
              cursor: pointer;
              font-weight: bold;
            }
            button:hover {
              background-color: #5ba3d4;
            }
            .remember {
              display: flex;
              align-items: center;
              font-size: 12px;
              margin-bottom: 15px;
            }
            .remember input {
              width: auto;
              margin-right: 5px;
            }
          </style>
        </head>
        <body>
          <div class="steam-login">
            <div class="steam-logo">
              <img src="https://store.cloudflare.steamstatic.com/public/shared/images/header/logo_steam.svg" alt="Steam Logo" width="180">
            </div>
            <form id="steamLoginForm">
              <div class="form-group">
                <label for="username">Nome de usuário Steam</label>
                <input type="text" id="username" name="username" required>
              </div>
              <div class="form-group">
                <label for="password">Senha</label>
                <input type="password" id="password" name="password" required>
              </div>
              <div class="remember">
                <input type="checkbox" id="remember" name="remember">
                <label for="remember">Lembrar meu login</label>
              </div>
              <button type="submit">Entrar</button>
            </form>
          </div>
          <script>
            document.getElementById('steamLoginForm').addEventListener('submit', function(e) {
              e.preventDefault();
              // Simular autenticação bem-sucedida após 1 segundo
              setTimeout(function() {
                window.opener.postMessage('steam-login-success', '*');
                window.close();
              }, 1000);
            });
          </script>
        </body>
        </html>
      `);
      
      // Configurar listener para mensagem da janela de login
      const handleLoginMessage = (event) => {
        if (event.data === 'steam-login-success') {
          // Remover o listener após o login bem-sucedido
          window.removeEventListener('message', handleLoginMessage);
          
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
          setIsLoading(false);
        }
      };
      
      window.addEventListener('message', handleLoginMessage);
      
      // Configurar um timeout para fechar a janela se o usuário não fizer login
      setTimeout(() => {
        if (steamLoginWindow && !steamLoginWindow.closed) {
          steamLoginWindow.close();
          setError('Tempo limite de login excedido. Tente novamente.');
          setIsLoading(false);
          window.removeEventListener('message', handleLoginMessage);
        }
      }, 120000); // 2 minutos de timeout
      
    } catch (err) {
      setError(err.message || 'Falha na autenticação Steam. Tente novamente.');
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async (tokenResponse) => {
    setGoogleLoading(true);
    setError('');
    
    try {
      // Aqui seria implementada a chamada para a API de login com Google
      // Por enquanto, vamos manter o comportamento simulado
      // Em uma implementação real, usaríamos authApi.loginWithGoogle(tokenResponse)
      
      // Simulação de login bem-sucedido
      const mockUser = {
        id: '123456789',
        username: 'GoogleUser',
        email: 'user@gmail.com',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        coins: 500
      };
      
      onLogin(mockUser);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Falha na autenticação com Google. Tente novamente.');
    } finally {
      setGoogleLoading(false);
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
          <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Ou continue com
              </span>
            </div>
          </div>
          
          <div className="mt-4">
            <GoogleLoginButton 
              onSuccess={handleGoogleLogin}
              onError={(error) => setError('Falha na autenticação com Google. Tente novamente.')}
              text="Entrar com Google"
              className="mb-3"
            />
          </div>
          
          <div className="border-t border-border pt-4 mt-4">
            <p className="text-sm text-muted-foreground mb-2">
              Não tem uma conta?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Registre-se com email
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              Prefere usar email?{" "}
              <Link to="/email-login" className="text-primary hover:underline">
                Entre com email e senha
              </Link>
            </p>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SteamLoginForm;