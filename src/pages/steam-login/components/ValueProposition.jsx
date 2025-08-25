import React from 'react';
import Icon from '../../../components/AppIcon';

const ValueProposition = () => {
  const features = [
    {
      icon: 'Users',
      title: 'Lobbies Multiplayer',
      description: 'Compete em tempo real com outros jogadores'
    },
    {
      icon: 'Brain',
      title: 'Conhecimento CS',
      description: 'Teste seus conhecimentos sobre Counter-Strike'
    },
    {
      icon: 'Trophy',
      title: 'Prêmios Reais',
      description: 'Ganhe skins e moedas virtuais'
    },
    {
      icon: 'Zap',
      title: 'Tempo Real',
      description: 'Experiência de jogo instantânea e fluida'
    }
  ];

  return (
    <div className="text-center mb-8">
      {/* Main Heading */}
      <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
        CS Quiz Arena
      </h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
        A plataforma definitiva para testar seus conhecimentos sobre Counter-Strike
        e competir por prêmios reais em quizzes multiplayer
      </p>
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features?.map((feature, index) => (
          <div 
            key={index}
            className="bg-card border border-border rounded-lg p-6 gaming-transition hover:bg-card/80"
          >
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Icon name={feature?.icon} size={24} color="var(--color-primary)" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {feature?.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ValueProposition;