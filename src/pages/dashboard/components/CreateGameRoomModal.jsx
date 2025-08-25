import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';
import { createGameRoom } from '../../../utils/gameRoomService';
import { placeBet } from '../../../utils/bettingService';

const CreateGameRoomModal = ({ isOpen, onClose, onRoomCreated, currentUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    entryFee: 50,
    maxPlayers: 10,
    difficulty: 'Médio',
    questionCount: 10,
    timePerQuestion: 15,
    distributionType: 'winner-takes-all',
    allowDoubleDown: true
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseInt(value, 10) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    setError('');

    try {
      // Validações
      if (!formData.name.trim()) {
        throw new Error('O nome da sala é obrigatório');
      }

      if (formData.entryFee < 0) {
        throw new Error('O valor da aposta não pode ser negativo');
      }

      if (formData.maxPlayers < 2 || formData.maxPlayers > 10) {
        throw new Error('O número de jogadores deve ser entre 2 e 10');
      }

      // Verificar saldo do usuário
      const userBalance = currentUser?.balance || 0;
      if (userBalance < formData.entryFee) {
        throw new Error('Saldo insuficiente para criar esta sala');
      }

      // Criar sala
      const newRoom = createGameRoom(formData, currentUser.id);

      // Processar aposta do criador
      if (formData.entryFee > 0) {
        placeBet(currentUser.id, formData.entryFee, newRoom.id);
      }

      // Notificar criação bem-sucedida
      onRoomCreated(newRoom);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Criar Nova Sala de Quiz
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertCircle" size={16} color="var(--color-error)" />
              <span className="text-sm text-error">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Nome da Sala
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Quiz CS2 - Mapas Clássicos"
                required
              />
            </div>

            <div>
              <label htmlFor="entryFee" className="block text-sm font-medium text-foreground mb-1">
                Valor da Aposta
              </label>
              <div className="relative">
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  step="10"
                  value={formData.entryFee}
                  onChange={handleNumberChange}
                  className="pl-8"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <Icon name="Coins" size={16} color="var(--color-warning)" />
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Seu saldo: {currentUser?.balance?.toLocaleString('pt-BR')} moedas
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="maxPlayers" className="block text-sm font-medium text-foreground mb-1">
                  Máx. Jogadores
                </label>
                <Select
                  id="maxPlayers"
                  name="maxPlayers"
                  value={formData.maxPlayers}
                  onChange={handleNumberChange}
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} jogadores</option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-1">
                  Dificuldade
                </label>
                <Select
                  id="difficulty"
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleChange}
                >
                  <option value="Fácil">Fácil</option>
                  <option value="Médio">Médio</option>
                  <option value="Difícil">Difícil</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="questionCount" className="block text-sm font-medium text-foreground mb-1">
                  Nº de Perguntas
                </label>
                <Select
                  id="questionCount"
                  name="questionCount"
                  value={formData.questionCount}
                  onChange={handleNumberChange}
                >
                  {[5, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num} perguntas</option>
                  ))}
                </Select>
              </div>

              <div>
                <label htmlFor="timePerQuestion" className="block text-sm font-medium text-foreground mb-1">
                  Tempo por Pergunta
                </label>
                <Select
                  id="timePerQuestion"
                  name="timePerQuestion"
                  value={formData.timePerQuestion}
                  onChange={handleNumberChange}
                >
                  <option value="10">10 segundos</option>
                  <option value="15">15 segundos</option>
                  <option value="20">20 segundos</option>
                  <option value="30">30 segundos</option>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="distributionType" className="block text-sm font-medium text-foreground mb-1">
                Distribuição de Prêmios
              </label>
              <Select
                id="distributionType"
                name="distributionType"
                value={formData.distributionType}
                onChange={handleChange}
              >
                <option value="winner-takes-all">Vencedor leva tudo</option>
                <option value="top3">Top 3 (60%, 30%, 10%)</option>
                <option value="proportional">Proporcional à pontuação</option>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allowDoubleDown"
                name="allowDoubleDown"
                checked={formData.allowDoubleDown}
                onChange={handleChange}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              <label htmlFor="allowDoubleDown" className="text-sm text-foreground">
                Permitir "Dobro ou Nada" para o vencedor
              </label>
            </div>

            <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
              <p className="font-medium mb-1">Informações:</p>
              <ul className="space-y-1">
                <li>• O valor total do prêmio será a soma de todas as apostas</li>
                <li>• A sala iniciará quando todos os jogadores estiverem prontos</li>
                <li>• Você pode cancelar a sala antes do início sem perder sua aposta</li>
              </ul>
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                fullWidth
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                loading={isCreating}
                fullWidth
              >
                Criar Sala
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGameRoomModal;