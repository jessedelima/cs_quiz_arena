import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import websocketService from '../../../api/websocketService';

const CreateGameRoomModal = ({ isOpen, onClose, onCreateRoom }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'cs2',
    difficulty: 'medium',
    maxPlayers: 10,
    entryFee: 100,
    timePerQuestion: 30
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateRoom(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-card-foreground mb-4">Criar Nova Sala</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-card-foreground mb-1">Nome da Sala</label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite o nome da sala"
                required
              />
            </div>
            
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-card-foreground mb-1">Categoria</label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                options={[
                  { value: 'cs2', label: 'Counter-Strike 2' },
                  { value: 'csgo', label: 'CS:GO' },
                  { value: 'cs16', label: 'CS 1.6' },
                  { value: 'css', label: 'CS: Source' }
                ]}
              />
            </div>
            
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-card-foreground mb-1">Dificuldade</label>
              <Select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                options={[
                  { value: 'easy', label: 'Fácil' },
                  { value: 'medium', label: 'Médio' },
                  { value: 'hard', label: 'Difícil' }
                ]}
              />
            </div>
            
            <div>
              <label htmlFor="maxPlayers" className="block text-sm font-medium text-card-foreground mb-1">Máximo de Jogadores</label>
              <Input
                id="maxPlayers"
                name="maxPlayers"
                type="number"
                min="2"
                max="20"
                value={formData.maxPlayers}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="entryFee" className="block text-sm font-medium text-card-foreground mb-1">Taxa de Entrada (moedas)</label>
              <Input
                id="entryFee"
                name="entryFee"
                type="number"
                min="0"
                value={formData.entryFee}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="timePerQuestion" className="block text-sm font-medium text-card-foreground mb-1">Tempo por Questão (segundos)</label>
              <Input
                id="timePerQuestion"
                name="timePerQuestion"
                type="number"
                min="10"
                max="120"
                value={formData.timePerQuestion}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary">
              Criar Sala
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGameRoomModal;