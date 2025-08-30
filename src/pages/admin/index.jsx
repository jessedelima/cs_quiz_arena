import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logout, isCurrentUserAdmin } from '../../utils/authService';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const AdminPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  // Verificar se o usuário é admin
  if (!currentUser || !isCurrentUserAdmin()) {
    navigate('/dashboard');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/email-login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                CS Quiz Arena - Admin
              </span>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                Bem-vindo, {currentUser.username}
              </span>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
              >
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Gerencie o CS Quiz Arena através deste painel.
          </p>
        </div>

        {/* Admin Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Usuários */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Icon name="Users" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Usuários
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Gerencie usuários registrados no sistema.
            </p>
            <Button className="w-full">
              Gerenciar Usuários
            </Button>
          </div>

          {/* Quizzes */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Icon name="BookOpen" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Quizzes
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Crie e gerencie quizzes e perguntas.
            </p>
            <Button className="w-full">
              Gerenciar Quizzes
            </Button>
          </div>

          {/* Salas de Jogo */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Icon name="Gamepad2" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Salas de Jogo
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Monitore e gerencie salas de jogo ativas.
            </p>
            <Button className="w-full">
              Gerenciar Salas
            </Button>
          </div>

          {/* Relatórios */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Icon name="BarChart3" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Relatórios
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualize estatísticas e relatórios do sistema.
            </p>
            <Button className="w-full">
              Ver Relatórios
            </Button>
          </div>

          {/* Configurações */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                <Icon name="Settings" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Configurações
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Configure parâmetros do sistema.
            </p>
            <Button className="w-full">
              Configurações
            </Button>
          </div>

          {/* Logs do Sistema */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                <Icon name="FileText" size={20} color="white" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Logs do Sistema
              </h3>
            </div>
            <p className="text-muted-foreground mb-4">
              Visualize logs e atividades do sistema.
            </p>
            <Button className="w-full">
              Ver Logs
            </Button>
          </div>
        </div>

        {/* Status do Sistema */}
        <div className="mt-8 bg-card border border-border rounded-lg p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Status do Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500 mb-1">Online</div>
              <div className="text-sm text-muted-foreground">Status do Servidor</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500 mb-1">0</div>
              <div className="text-sm text-muted-foreground">Usuários Online</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500 mb-1">0</div>
              <div className="text-sm text-muted-foreground">Jogos Ativos</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPage;