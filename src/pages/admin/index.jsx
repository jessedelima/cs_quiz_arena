import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, isCurrentUserAdmin } from '../../utils/authService';

// Componentes de UI
import Button from '../../components/ui/Button';

// Estilos
import '../../styles/admin.css';

// Dados simulados para o dashboard
const mockUsers = [
  { id: 1, username: 'player1', email: 'player1@example.com', registeredDate: '2023-05-10', lastLogin: '2023-06-15', gamesPlayed: 45 },
  { id: 2, username: 'gamer2', email: 'gamer2@example.com', registeredDate: '2023-04-22', lastLogin: '2023-06-14', gamesPlayed: 32 },
  { id: 3, username: 'cs_master', email: 'master@example.com', registeredDate: '2023-03-15', lastLogin: '2023-06-16', gamesPlayed: 78 },
  { id: 4, username: 'shooter_pro', email: 'shooter@example.com', registeredDate: '2023-05-30', lastLogin: '2023-06-10', gamesPlayed: 21 },
  { id: 5, username: 'tactical_player', email: 'tactical@example.com', registeredDate: '2023-02-18', lastLogin: '2023-06-12', gamesPlayed: 56 },
];

const mockRevenue = [
  { id: 1, month: 'Janeiro', year: 2023, amount: 1250.75, transactions: 45 },
  { id: 2, month: 'Fevereiro', year: 2023, amount: 1580.50, transactions: 52 },
  { id: 3, month: 'Março', year: 2023, amount: 2150.25, transactions: 67 },
  { id: 4, month: 'Abril', year: 2023, amount: 1890.00, transactions: 58 },
  { id: 5, month: 'Maio', year: 2023, amount: 2450.75, transactions: 72 },
  { id: 6, month: 'Junho', year: 2023, amount: 2780.50, transactions: 85 },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('users');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Verificar se o usuário é administrador
  useEffect(() => {
    const checkAdmin = () => {
      const isAdmin = isCurrentUserAdmin();
      const currentUser = getCurrentUser();
      
      if (!isAdmin || !currentUser) {
        navigate('/login');
        return;
      }
      
      setIsAdmin(true);
      setLoading(false);
    };
    
    checkAdmin();
  }, [navigate]);
  
  // Renderizar tabela de usuários
  const renderUsersTable = () => (
    <div className="admin-table-container">
      <h2>Usuários Registrados</h2>
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome de Usuário</th>
            <th>Email</th>
            <th>Data de Registro</th>
            <th>Último Login</th>
            <th>Jogos Jogados</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.registeredDate}</td>
              <td>{user.lastLogin}</td>
              <td>{user.gamesPlayed}</td>
              <td>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => alert(`Visualizar detalhes do usuário ${user.username}`)}
                >
                  Detalhes
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  // Renderizar tabela de receita
  const renderRevenueTable = () => (
    <div className="admin-table-container">
      <h2>Receita Mensal</h2>
      <div className="revenue-summary">
        <div className="revenue-card">
          <h3>Total Arrecadado</h3>
          <p className="revenue-amount">R$ {mockRevenue.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}</p>
        </div>
        <div className="revenue-card">
          <h3>Total de Transações</h3>
          <p className="revenue-amount">{mockRevenue.reduce((sum, item) => sum + item.transactions, 0)}</p>
        </div>
        <div className="revenue-card">
          <h3>Média por Transação</h3>
          <p className="revenue-amount">R$ {(mockRevenue.reduce((sum, item) => sum + item.amount, 0) / 
            mockRevenue.reduce((sum, item) => sum + item.transactions, 0)).toFixed(2)}</p>
        </div>
      </div>
      
      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mês</th>
            <th>Ano</th>
            <th>Valor (R$)</th>
            <th>Transações</th>
            <th>Média por Transação</th>
          </tr>
        </thead>
        <tbody>
          {mockRevenue.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.month}</td>
              <td>{item.year}</td>
              <td>R$ {item.amount.toFixed(2)}</td>
              <td>{item.transactions}</td>
              <td>R$ {(item.amount / item.transactions).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
  
  if (loading) {
    return <div className="admin-loading">Carregando...</div>;
  }
  
  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Painel de Administração</h1>
        <div className="admin-user-info">
          <span>Logado como Administrador</span>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuários
        </button>
        <button 
          className={`admin-tab ${activeTab === 'revenue' ? 'active' : ''}`}
          onClick={() => setActiveTab('revenue')}
        >
          Receita
        </button>
      </div>
      
      <div className="admin-content">
        {activeTab === 'users' ? renderUsersTable() : renderRevenueTable()}
      </div>
    </div>
  );
};

export default AdminDashboard;