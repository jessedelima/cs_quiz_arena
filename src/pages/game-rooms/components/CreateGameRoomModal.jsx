import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Icon from '../../../components/AppIcon';

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

      if (formData.maxPlayers < 2 || formData.maxPlayers > 20) {
        throw new Error('O número de jogadores deve estar entre 2 e 20');
      }

      if (formData.questionCount < 5 || formData.questionCount > 30) {
        throw new Error('O número de questões deve estar entre 5 e 30');
      }

      if (formData.timePerQuestion < 5 || formData.timePerQuestion > 60) {
        throw new Error('O tempo por questão deve estar entre 5 e 60 segundos');
      }

      if (currentUser.balance < formData.entryFee) {
        throw new Error('Saldo insuficiente para criar esta sala');
      }

      // Simulação de criação de sala
      setTimeout(() => {
        const newRoom = {
          id: `room-${Date.now()}`,
          creatorId: currentUser.id,
          ...formData,
          prizePool: formData.entryFee,
          participants: [
            { userId: currentUser.id, username: currentUser.username, ready: false }
          ],
          status: 'waiting'
        };

        onRoomCreated(newRoom);
        onClose();
        setIsCreating(false);
      }, 500);
    } catch (error) {
      setError(error.message);
      setIsCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-foreground">Criar Nova Sala de Quiz</h2>
            <button 
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="X" size={20} />
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
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
                  placeholder="Ex: Quiz de Estratégias CS2"
                  required
                />
              </div>

              <div>
                <label htmlFor="entryFee" className="block text-sm font-medium text-foreground mb-1">
                  Valor da Aposta (moedas)
                </label>
                <Input
                  id="entryFee"
                  name="entryFee"
                  type="number"
                  min="0"
                  value={formData.entryFee}
                  onChange={handleNumberChange}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxPlayers" className="block text-sm font-medium text-foreground mb-1">
                    Máximo de Jogadores
                  </label>
                  <Input
                    id="maxPlayers"
                    name="maxPlayers"
                    type="number"
                    min="2"
                    max="20"
                    value={formData.maxPlayers}
                    onChange={handleNumberChange}
                    required
                  />
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
                    required
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
                    Número de Questões
                  </label>
                  <Input
                    id="questionCount"
                    name="questionCount"
                    type="number"
                    min="5"
                    max="30"
                    value={formData.questionCount}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="timePerQuestion" className="block text-sm font-medium text-foreground mb-1">
                    Tempo por Questão (s)
                  </label>
                  <Input
                    id="timePerQuestion"
                    name="timePerQuestion"
                    type="number"
                    min="5"
                    max="60"
                    value={formData.timePerQuestion}
                    onChange={handleNumberChange}
                    required
                  />
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
                  required
                >
                  <option value="winner-takes-all">Vencedor leva tudo</option>
                  <option value="top-3">Top 3 jogadores</option>
                  <option value="proportional">Proporcional à pontuação</option>
                </Select>
              </div>

              <div className="flex items-center">
                <input
                  id="allowDoubleDown"
                  name="allowDoubleDown"
                  type="checkbox"
                  checked={formData.allowDoubleDown}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <label htmlFor="allowDoubleDown" className="ml-2 block text-sm text-foreground">
                  Permitir opção "Dobrar ou Nada" para o vencedor
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={isCreating}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  'Criar Sala'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGameRoomModal;