import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../../components/AppIcon';
import { loginWithEmail } from '../../utils/authService';
import GoogleLoginButton from '../../components/auth/GoogleLoginButton';

const EmailLoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError('Por favor, preencha todos os campos.');
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Por favor, insira um email válido.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = loginWithEmail(formData.email, formData.password);
      
      if (result.success) {
        setSuccess(result.message || 'Login realizado com sucesso!');
        
        // Redirecionar para o dashboard após login bem-sucedido
        setTimeout(() => {
          if (result.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1500);
      } else {
        setError(result.error || 'Falha no login. Verifique suas credenciais.');
      }
    } catch (error) {
      setError(error.message || 'Falha no login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={32} color="white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Entre na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Ou{' '}
          <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
            crie uma nova conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <motion.div 
          className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {success && (
            <div className="mb-4 p-4 bg-green-800 border border-green-700 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icon name="CheckCircle" size={18} color="#4ade80" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-400">{success}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-900 border border-red-800 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Icon name="AlertCircle" size={18} color="#f87171" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-red-400">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 bg-gray-700 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-600 bg-gray-700 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Entrando...
                  </>
                ) : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/steam-login');
                }}
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-600 rounded-md shadow-sm bg-gray-700 text-sm font-medium text-gray-300 hover:bg-gray-600"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/>
                </svg>
                <span className="ml-2">Steam</span>
              </a>

              <GoogleLoginButton 
                onSuccess={(response) => {
                  // Implementar login com Google usando authApi
                  setIsLoading(true);
                  setError('');
                  
                  // Simulação de login bem-sucedido
                  setTimeout(() => {
                    setIsLoading(false);
                    setSuccess('Login com Google realizado com sucesso!');
                    setTimeout(() => {
                      navigate('/dashboard');
                    }, 1500);
                  }, 1000);
                }}
                onError={(error) => setError('Falha na autenticação com Google. Tente novamente.')}
                text="Entrar com Google"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6">
            <div className="text-sm text-center">
              <p className="text-gray-400">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-medium text-indigo-400 hover:text-indigo-300">
                  Registre-se
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmailLoginPage;