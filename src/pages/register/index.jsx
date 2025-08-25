import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import { registerUser } from '../../utils/authService';
import { sendConfirmationEmail } from '../../utils/emailService';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Nome de usuário é obrigatório');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email é obrigatório');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email inválido');
      return false;
    }
    
    if (!formData.password) {
      setError('Senha é obrigatória');
      return false;
    }
    
    if (formData.password.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return false;
    }
    
    if (!formData.acceptTerms) {
      setError('Você deve aceitar os termos e condições');
      return false;
    }
    
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Registrar usuário
      const registrationResult = await registerUser({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      if (!registrationResult.success) {
        setError(registrationResult.error);
        setIsLoading(false);
        return;
      }
      
      // Enviar email de confirmação
      await sendConfirmationEmail(
        registrationResult.email,
        registrationResult.username,
        registrationResult.confirmationToken
      );
      
      // Mostrar mensagem de sucesso
      setSuccessMessage('Registro realizado com sucesso! Um email de confirmação foi enviado para ' + formData.email);
      
      // Limpar formulário
      setFormData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        acceptTerms: false
      });
      
      // Após 5 segundos, redirecionar para a página de login
      setTimeout(() => {
        navigate('/steam-login');
      }, 5000);
    } catch (err) {
      setError('Erro ao registrar. Por favor, tente novamente.');
      console.error('Erro no registro:', err);
    } finally {
      setIsLoading(false);
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Crie sua conta
            </h1>
            <p className="text-muted-foreground">
              Junte-se à comunidade CS Quiz Arena
            </p>
          </div>

          {/* Registration Form */}
          <div className="bg-card border border-border rounded-lg p-8 shadow-card">
            {error && (
              <div className="mb-6 p-3 bg-error/10 border border-error/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="AlertCircle" size={16} color="var(--color-error)" />
                  <span className="text-sm text-error">{error}</span>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="mb-6 p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-sm text-success">{successMessage}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                label="Nome de usuário"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Seu nome de usuário"
                required
              />

              <Input
                label="Email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="seu.email@exemplo.com"
                required
              />

              <Input
                label="Senha"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Mínimo 8 caracteres"
                required
              />

              <Input
                label="Confirmar senha"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Digite a senha novamente"
                required
              />

              <div className="pt-2">
                <Checkbox
                  label={
                    <span className="text-sm text-muted-foreground">
                      Eu aceito os{" "}
                      <Link to="/terms" className="text-primary hover:underline">
                        Termos de Serviço
                      </Link>{" "}
                      e{" "}
                      <Link to="/privacy" className="text-primary hover:underline">
                        Política de Privacidade
                      </Link>
                    </span>
                  }
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                />
              </div>

              <Button
                type="submit"
                variant="default"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
                className="mt-6 h-12"
              >
                {isLoading ? "Registrando..." : "Registrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/steam-login" className="text-primary hover:underline">
                  Faça login
                </Link>
              </p>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Icon name="Shield" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">Registro Seguro</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Seus dados estão protegidos e nunca serão compartilhados com terceiros.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;