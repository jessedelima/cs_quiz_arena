import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { confirmEmail } from '../../utils/authService';
import { sendConfirmationEmail } from '../../utils/emailService';

const EmailConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [countdown, setCountdown] = useState(5);

  // Extrair token da URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const email = params.get('email');
    
    if (!token || !email) {
      setStatus('error');
      return;
    }

    // Verificação de token
    const verifyToken = async () => {
      try {
        // Chamar serviço de confirmação de email
        const result = confirmEmail(token, email);
        
        if (result.success) {
          setStatus('success');
          // Iniciar contagem regressiva para redirecionamento
          startCountdown();
        } else {
          setStatus('error');
        }
      } catch (error) {
        console.error('Erro ao confirmar email:', error);
        setStatus('error');
      }
    };

    verifyToken();
  }, [location]);

  // Contagem regressiva para redirecionamento
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/steam-login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  };

  // Função para reenviar email de confirmação
  const handleResendEmail = async () => {
    const params = new URLSearchParams(location.search);
    const email = params.get('email');
    
    if (!email) {
      alert('Email não encontrado. Por favor, tente se registrar novamente.');
      navigate('/register');
      return;
    }
    
    try {
      // Simular reenvio de email
      // Em um ambiente real, precisaríamos gerar um novo token
      const mockToken = Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      await sendConfirmationEmail(email, 'Usuário', mockToken);
      
      // Mostrar mensagem de sucesso
      alert('Email de confirmação reenviado com sucesso!');
    } catch (error) {
      console.error('Erro ao reenviar email:', error);
      alert('Erro ao reenviar email. Por favor, tente novamente.');
    }
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-card border border-border rounded-lg p-8 shadow-card text-center">
            {status === 'verifying' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Verificando seu email
                </h2>
                <p className="text-muted-foreground">
                  Por favor, aguarde enquanto confirmamos seu email...
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-success/10 rounded-full flex items-center justify-center">
                  <Icon name="CheckCircle" size={32} color="var(--color-success)" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Email confirmado!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Sua conta foi ativada com sucesso. Agora você pode acessar todos os recursos da plataforma.
                </p>
                <div className="bg-success/10 border border-success/20 rounded-lg p-4 mb-6">
                  <p className="text-sm text-success">
                    Você será redirecionado para a página de login em {countdown} segundos...
                  </p>
                </div>
                <Button
                  variant="default"
                  onClick={() => navigate('/steam-login')}
                  fullWidth
                >
                  Ir para o login agora
                </Button>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 mx-auto mb-4 bg-error/10 rounded-full flex items-center justify-center">
                  <Icon name="XCircle" size={32} color="var(--color-error)" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Erro na confirmação
                </h2>
                <p className="text-muted-foreground mb-6">
                  Não foi possível confirmar seu email. O link pode ter expirado ou ser inválido.
                </p>
                <div className="space-y-4">
                  <Button
                    variant="default"
                    onClick={handleResendEmail}
                    fullWidth
                  >
                    Reenviar email de confirmação
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/steam-login')}
                    fullWidth
                  >
                    Voltar para o login
                  </Button>
                </div>
              </>
            )}
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Precisa de ajuda?{" "}
              <Link to="/support" className="text-primary hover:underline">
                Entre em contato com o suporte
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EmailConfirmationPage;