import React from 'react';
import Icon from '../../../components/AppIcon';

const QuestionResults = ({ 
  question,
  userAnswer,
  correctAnswer,
  isCorrect,
  pointsEarned,
  currentScore,
  leaderboardPosition,
  totalParticipants,
  onNextQuestion
}) => {
  const getResultIcon = () => {
    if (isCorrect) {
      return { name: 'CheckCircle', color: 'var(--color-success)', bg: 'bg-success/20' };
    }
    return { name: 'XCircle', color: 'var(--color-error)', bg: 'bg-error/20' };
  };

  const resultIcon = getResultIcon();

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Result Header */}
      <div className={`text-center p-6 rounded-lg ${resultIcon?.bg}`}>
        <Icon 
          name={resultIcon?.name} 
          size={64} 
          color={resultIcon?.color}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold mb-2" style={{ color: resultIcon?.color }}>
          {isCorrect ? 'Correto!' : 'Incorreto!'}
        </h2>
        <p className="text-lg text-muted-foreground">
          {isCorrect 
            ? `Você ganhou ${pointsEarned} pontos!`
            : 'Não foi dessa vez!'
          }
        </p>
      </div>
      {/* Question Review */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">
          {question?.text}
        </h3>

        <div className="space-y-3">
          {question?.options?.map((option, index) => {
            const optionLetter = String.fromCharCode(65 + index);
            const isUserChoice = userAnswer === index;
            const isCorrectOption = correctAnswer === index;
            
            let optionClasses = `
              flex items-center space-x-3 p-3 rounded-lg border-2
            `;
            
            if (isCorrectOption) {
              optionClasses += ' border-success bg-success/20 text-success-foreground';
            } else if (isUserChoice && !isCorrectOption) {
              optionClasses += ' border-error bg-error/20 text-error-foreground';
            } else {
              optionClasses += ' border-border bg-muted text-muted-foreground';
            }

            return (
              <div key={index} className={optionClasses}>
                <div className={`
                  w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm
                  ${isCorrectOption || isUserChoice ? 'border-current bg-current/20' : 'border-current'}
                `}>
                  {optionLetter}
                </div>
                <span className="flex-1 font-medium">
                  {option}
                </span>
                {isCorrectOption && (
                  <Icon name="Check" size={20} color="var(--color-success)" />
                )}
                {isUserChoice && !isCorrectOption && (
                  <Icon name="X" size={20} color="var(--color-error)" />
                )}
              </div>
            );
          })}
        </div>

        {question?.explanation && (
          <div className="mt-4 p-4 bg-background rounded-lg border border-border">
            <h4 className="text-sm font-semibold text-foreground mb-2">
              Explicação:
            </h4>
            <p className="text-sm text-muted-foreground">
              {question?.explanation}
            </p>
          </div>
        )}
      </div>
      {/* Score Update */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Target" size={24} color="var(--color-accent)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-accent">
            {currentScore}
          </div>
          <div className="text-sm text-muted-foreground">
            Pontuação Total
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Trophy" size={24} color="var(--color-warning)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-warning">
            #{leaderboardPosition}
          </div>
          <div className="text-sm text-muted-foreground">
            Posição Atual
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Icon name="Users" size={24} color="var(--color-primary)" className="mx-auto mb-2" />
          <div className="text-2xl font-bold text-primary">
            {totalParticipants}
          </div>
          <div className="text-sm text-muted-foreground">
            Participantes
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionResults;