import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ProfileForm from '../../components/ProfileForm/ProfileForm';
import DeleteAccountSection from '../../components/DeleteAccountSection/DeleteAccountSection';
import { getCurrentUser } from '../../utils/authService';

const ProfileSettings = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      } else {
        // Redirecionar para login se não estiver autenticado
        navigate('/login');
      }
      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
  };

  const handleAccountDeleted = () => {
    // Redirecionar para a página inicial após exclusão da conta
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

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
        
        <div className="bg-card border border-border rounded-lg p-6">
          <ProfileForm user={user} onProfileUpdate={handleProfileUpdate} />
          <DeleteAccountSection onAccountDeleted={handleAccountDeleted} />
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;