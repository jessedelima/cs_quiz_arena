import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuizComplete = ({ 
  finalScore,
  totalQuestions,
  correctAnswers,
  finalPosition,
  totalParticipants,
  coinsEarned,
  achievements = [],
  quizStats
}) => {
  const navigate = useNavigate();

  const getPositionIcon = () => {
    if (finalPosition === 1) return { name: 'Crown', color: 'var(--color-warning)' };
    if (finalPosition <= 3) return { name: 'Medal', color: 'var(--color-accent)' };
    return { name: 'Trophy', color: 'var(--color-primary)' };
  };

  const positionIcon = getPositionIcon();
  const accuracy = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Final Result Header */}
      <div className="text-center p-8 bg-card rounded-lg border border-border">
        <Icon 
          name={positionIcon?.name} 
          size={80} 
          color={positionIcon?.color}
          className="mx-auto mb-4"
        />
        <h1 className="text-3xl font-bold text-card-foreground mb-2">
          Quiz Finalizado!
        </h1>
        <p className="text-xl text-muted-foreground mb-4">
          Você terminou em #{finalPosition} de {totalParticipants} jogadores
        </p>
        
        {coinsEarned > 0 && (
          <div className="flex items-center justify-center space-x-2 bg-warning/20 px-4 py-2 rounded-lg">
            <Icon name="Coins" size={20} color="var(--color-warning)" />
            <span className="text-lg font-bold text-warning">
              +{coinsEarned?.toLocaleString()} moedas ganhas!
            </span>
          </div>
        )}
      </div>
      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Target" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-accent">
            {finalScore}
          </div>
          <div className="text-sm text-muted-foreground">
            Pontos Finais
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="CheckCircle" size={24} color="var(--color-success)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-success">
            {correctAnswers}/{totalQuestions}
          </div>
          <div className="text-sm text-muted-foreground">
            Acertos
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Percent" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary">
            {accuracy}%
          </div>
          <div className="text-sm text-muted-foreground">
            Precisão
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Clock" size={24} color="var(--color-warning)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-warning">
            {quizStats?.averageTime || '12'}s
          </div>
          <div className="text-sm text-muted-foreground">
            Tempo Médio
          </div>
        </div>
      </div>
      {/* Achievements */}
      {achievements?.length > 0 && (
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
            <Icon name="Award" size={20} color="var(--color-warning)" />
            <span>Conquistas Desbloqueadas</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements?.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-background rounded-lg border border-border">
                <Icon name="Star" size={20} color="var(--color-warning)" />
                <div>
                  <div className="font-medium text-foreground">
                    {achievement?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {achievement?.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Performance Breakdown */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          Análise de Performance
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Respostas Rápidas (&lt;5s)</span>
            <span className="font-medium text-foreground">
              {quizStats?.fastAnswers || 3} perguntas
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Sequência Máxima</span>
            <span className="font-medium text-foreground">
              {quizStats?.maxStreak || 4} acertos
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Categoria Forte</span>
            <span className="font-medium text-foreground">
              {quizStats?.strongCategory || 'Mapas'}
            </span>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          variant="default"
          onClick={() => navigate('/leaderboards')}
          iconName="Trophy"
          iconPosition="left"
          className="flex-1"
        >
          Ver Classificação
        </Button>
        
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          iconName="Home"
          iconPosition="left"
          className="flex-1"
        >
          Voltar ao Dashboard
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => navigate('/quiz-lobby')}
          iconName="RotateCcw"
          iconPosition="left"
          className="flex-1"
        >
          Jogar Novamente
        </Button>
      </div>
    </div>
  );
};

export default QuizComplete;