import React from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const ProfileSettings = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Configurações de Perfil</h1>
          <Button onClick={handleGoBack} variant="outline" size="sm">
            <Icon name="arrow-left" className="mr-2" size={16} />
            Voltar ao Dashboard
          </Button>
        </div>
        
        <div className="bg-card border border-border rounded-lg p-6 text-center">
          <Icon name="settings" className="mx-auto mb-4" size={48} />
          <h2 className="text-xl font-semibold mb-2">Configurações em Desenvolvimento</h2>
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

export default ProfileSettings;