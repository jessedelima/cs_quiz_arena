import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Icon from '../../components/AppIcon';
import GameRoomCard from './components/GameRoomCard';
import CreateGameRoomModal from './components/CreateGameRoomModal';
import { fetchGameRooms } from '../../utils/gameRoomService';
import { mockGameRooms } from '../../utils/mockData';
const GameRoomsPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    difficulty: 'all',
    entryFee: 'all',
    availability: 'all'
  });

  // Mock do usuário atual (substituir por autenticação real)
  const currentUser = {
    id: 'user123',
    name: 'Jogador CS',
    balance: 1000,
    avatar: 'https://placehold.co/100x100'
  };

  useEffect(() => {
    // Usar dados mockados em vez de buscar do serviço
    setIsLoading(true);
    setTimeout(() => {
      setRooms(mockGameRooms);
      setFilteredRooms(mockGameRooms);
      setIsLoading(false);
    }, 500); // Simular tempo de carregamento
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, rooms]);

  const applyFilters = () => {
    let result = [...rooms];

    // Filtro por nome
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchLower)
      );
    }

    // Filtro por dificuldade
    if (filters.difficulty !== 'all') {
      result = result.filter(room => room.difficulty === filters.difficulty);
    }

    // Filtro por valor de entrada
    if (filters.entryFee !== 'all') {
      switch (filters.entryFee) {
        case 'free':
          result = result.filter(room => room.entryFee === 0);
          break;
        case 'low':
          result = result.filter(room => room.entryFee > 0 && room.entryFee <= 50);
          break;
        case 'medium':
          result = result.filter(room => room.entryFee > 50 && room.entryFee <= 200);
          break;
        case 'high':
          result = result.filter(room => room.entryFee > 200);
          break;
        default:
          break;
      }
    }

    // Filtro por disponibilidade
    if (filters.availability !== 'all') {
      switch (filters.availability) {
        case 'available':
          result = result.filter(room => 
            room.participants.length < room.maxPlayers && 
            !room.participants.some(p => p.userId === currentUser.id)
          );
          break;
        case 'joined':
          result = result.filter(room => 
            room.participants.some(p => p.userId === currentUser.id)
          );
          break;
        case 'created':
          result = result.filter(room => room.creatorId === currentUser.id);
          break;
        default:
          break;
      }
    }

    setFilteredRooms(result);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateRoom = (newRoom) => {
    setRooms(prev => [newRoom, ...prev]);
    console.log('Sala criada com sucesso!');
    navigate(`/quiz-lobby/${newRoom.id}`);
  };

  const handleJoinSuccess = (updatedRoom) => {
    setRooms(prev => prev.map(room => 
      room.id === updatedRoom.id ? updatedRoom : room
    ));
    console.log('Você entrou na sala!');
  };

  const handleJoinError = (errorMessage) => {
    console.error(errorMessage);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Salas de Quiz com Apostas</h1>
          <p className="text-muted-foreground">
            Participe de quizzes competitivos e ganhe moedas ao demonstrar seu conhecimento em CS2
          </p>
        </div>
        
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center"
          >
            <Icon name="Plus" size={18} className="mr-2" />
            Criar Nova Sala
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-foreground mb-1">
              Buscar
            </label>
            <Input
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Nome da sala..."
              icon="Search"
            />
          </div>

          <div>
            <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-1">
              Dificuldade
            </label>
            <Select
              id="difficulty"
              name="difficulty"
              value={filters.difficulty}
              onChange={handleFilterChange}
            >
              <option value="all">Todas</option>
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </Select>
          </div>

          <div>
            <label htmlFor="entryFee" className="block text-sm font-medium text-foreground mb-1">
              Valor da Aposta
            </label>
            <Select
              id="entryFee"
              name="entryFee"
              value={filters.entryFee}
              onChange={handleFilterChange}
            >
              <option value="all">Todos</option>
              <option value="free">Gratuito</option>
              <option value="low">Baixo (1-50)</option>
              <option value="medium">Médio (51-200)</option>
              <option value="high">Alto (201+)</option>
            </Select>
          </div>

          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-foreground mb-1">
              Status
            </label>
            <Select
              id="availability"
              name="availability"
              value={filters.availability}
              onChange={handleFilterChange}
            >
              <option value="all">Todas as salas</option>
              <option value="available">Disponíveis para entrar</option>
              <option value="joined">Minhas salas</option>
              <option value="created">Criadas por mim</option>
            </Select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map(room => (
            <GameRoomCard
              key={room.id}
              room={room}
              currentUser={currentUser}
              onJoinSuccess={handleJoinSuccess}
              onJoinError={handleJoinError}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium text-foreground mb-2">
            Nenhuma sala encontrada
          </h3>
          <p className="text-muted-foreground mb-6">
            {filters.search || filters.difficulty !== 'all' || filters.entryFee !== 'all' || filters.availability !== 'all'
              ? 'Tente ajustar os filtros para ver mais salas'
              : 'Seja o primeiro a criar uma sala de quiz com apostas!'}
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            Criar Nova Sala
          </Button>
        </div>
      )}

      {showCreateModal && (
        <CreateGameRoomModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onRoomCreated={handleCreateRoom}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default GameRoomsPage;