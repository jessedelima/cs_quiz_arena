import React from 'react';
import Image from '../../../components/AppImage';

const QuestionDisplay = ({ 
  question, 
  questionNumber, 
  totalQuestions,
  timeRemaining,
  selectedAnswer,
  onAnswerSelect,
  isAnswered,
  showCorrectAnswer,
  correctAnswer
}) => {
  const getTimerColor = () => {
    if (timeRemaining > 10) return 'text-success';
    if (timeRemaining > 5) return 'text-warning';
    return 'text-error';
  };

  const getTimerBgColor = () => {
    if (timeRemaining > 10) return 'bg-success/20';
    if (timeRemaining > 5) return 'bg-warning/20';
    return 'bg-error/20';
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-6">
      {/* Question Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium text-muted-foreground">
            Pergunta {questionNumber} de {totalQuestions}
          </div>
          <div className="w-32 bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full gaming-transition"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        
        {/* Timer */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getTimerBgColor()}`}>
          <div className={`w-3 h-3 rounded-full ${timeRemaining <= 5 ? 'animate-pulse' : ''}`} 
               style={{ backgroundColor: timeRemaining > 10 ? 'var(--color-success)' : timeRemaining > 5 ? 'var(--color-warning)' : 'var(--color-error)' }} />
          <span className={`text-lg font-mono font-bold ${getTimerColor()}`}>
            {timeRemaining}s
          </span>
        </div>
      </div>
      {/* Question Content */}
      <div className="bg-card rounded-lg border border-border p-6 space-y-4">
        {question?.image && (
          <div className="w-full h-48 overflow-hidden rounded-lg">
            <Image 
              src={question?.image} 
              alt="Pergunta sobre Counter-Strike"
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h2 className="text-xl md:text-2xl font-semibold text-card-foreground leading-relaxed">
          {question?.text}
        </h2>
      </div>
      {/* Answer Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {question?.options?.map((option, index) => {
          const optionLetter = String.fromCharCode(65 + index);
          const isSelected = selectedAnswer === index;
          const isCorrect = showCorrectAnswer && correctAnswer === index;
          const isWrong = showCorrectAnswer && isSelected && correctAnswer !== index;
          
          let buttonClasses = `
            w-full p-4 text-left rounded-lg border-2 gaming-transition
            flex items-center space-x-3 min-h-[60px]
            ${!isAnswered && !showCorrectAnswer ? 'hover:border-primary hover:bg-primary/10 cursor-pointer' : 'cursor-default'}
          `;
          
          if (showCorrectAnswer) {
            if (isCorrect) {
              buttonClasses += ' border-success bg-success/20 text-success-foreground';
            } else if (isWrong) {
              buttonClasses += ' border-error bg-error/20 text-error-foreground';
            } else {
              buttonClasses += ' border-border bg-muted text-muted-foreground';
            }
          } else if (isSelected) {
            buttonClasses += ' border-primary bg-primary/20 text-primary-foreground';
          } else {
            buttonClasses += ' border-border bg-card text-card-foreground hover:border-primary';
          }

          return (
            <button
              key={index}
              onClick={() => !isAnswered && !showCorrectAnswer && onAnswerSelect(index)}
              className={buttonClasses}
              disabled={isAnswered || showCorrectAnswer}
            >
              <div className={`
                w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm
                ${isSelected || isCorrect ? 'border-current bg-current/20' : 'border-current'}
              `}>
                {optionLetter}
              </div>
              <span className="flex-1 text-base font-medium">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionDisplay;