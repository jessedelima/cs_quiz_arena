import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const LiveQuiz = () => {
  const navigate = useNavigate();
  
  // Estado simplificado
  const [score, setScore] = useState(0);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Quiz ao Vivo</h1>
          <Button onClick={handleGoBack} variant="outline" size="sm">
            <Icon name="arrow-left" className="mr-2" size={16} />
            Voltar ao Dashboard
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="loader" className="mx-auto mb-4 animate-spin" size={48} />
          <h2 className="text-xl font-semibold mb-2">Quiz em Desenvolvimento</h2>
          <p className="text-muted-foreground mb-6">
            Esta funcionalidade está sendo implementada e estará disponível em breve.
          </p>
          <Button onClick={handleGoBack} variant="primary">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LiveQuiz;