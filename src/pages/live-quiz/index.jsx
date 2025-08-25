import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import QuestionDisplay from './components/QuestionDisplay';
import LiveParticipants from './components/LiveParticipants';
import QuestionResults from './components/QuestionResults';
import QuizComplete from './components/QuizComplete';
import NetworkStatus from './components/NetworkStatus';
import DoubleDownModal from './components/DoubleDownModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { distributeWinnings, doubleDownBet } from '../../utils/bettingService';
import { getGameRoomById, createGameRoom } from '../../utils/gameRoomService';

const LiveQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Quiz state
  const [gameState, setGameState] = useState('active'); // 'active', 'results', 'complete'
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(15);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [userScore, setUserScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  
  // Network state
  const [connectionStatus, setConnectionStatus] = useState('connected');
  const [latency, setLatency] = useState(42);
  const [syncStatus, setSyncStatus] = useState('synced');
  
  // UI state
  const [showSidebar, setShowSidebar] = useState(false);
  const [showDoubleDownModal, setShowDoubleDownModal] = useState(false);
  const [winnings, setWinnings] = useState(0);
  const [currentGameRoom, setCurrentGameRoom] = useState(null);

  // Mock user data
  const mockUser = {
    id: 'user123',
    username: 'ProGamer_BR',
    steamId: '76561198123456789',
    balance: 2500
  };

  // Mock quiz data
  const mockQuestions = [
    {
      id: 1,
      text: `Qual é o nome do mapa mais jogado no Counter-Strike competitivo?`,
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=400&fit=crop',
      options: ['Dust2', 'Mirage', 'Inferno', 'Cache'],
      correctAnswer: 0,
      explanation: `Dust2 é historicamente o mapa mais icônico e jogado do Counter-Strike, sendo considerado o mapa mais equilibrado para competições.`
    },
    {
      id: 2,
      text: `Quantos rounds são necessários para vencer uma partida competitiva no CS:GO/CS2?`,
      options: ['15 rounds', '16 rounds', '18 rounds', '20 rounds'],
      correctAnswer: 1,
      explanation: `Uma partida competitiva é vencida pelo primeiro time a conquistar 16 rounds, em um formato de melhor de 30 rounds.`
    },
    {
      id: 3,
      text: `Qual arma é conhecida como "AK" no Counter-Strike?`,
      image: 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=800&h=400&fit=crop',
      options: ['AK-47', 'AUG', 'M4A4', 'Galil AR'],
      correctAnswer: 0,
      explanation: `A AK-47 é o rifle de assalto principal do lado terrorista, famosa por seu dano alto e recuo característico.`
    }
  ];

  // Mock participants
  const mockParticipants = [
    {
      id: 'user123',
      username: 'ProGamer_BR',
      score: 2400,
      correctAnswers: 2,
      streak: 2,
      answerStatus: 'answered'
    },
    {
      id: 'user456',
      username: 'CS_Master',
      score: 2800,
      correctAnswers: 3,
      streak: 3,
      answerStatus: 'answered'
    },
    {
      id: 'user789',
      username: 'HeadShot_King',
      score: 2200,
      correctAnswers: 2,
      streak: 1,
      answerStatus: 'thinking'
    },
    {
      id: 'user101',
      username: 'Clutch_God',
      score: 1800,
      correctAnswers: 1,
      streak: 0,
      answerStatus: 'answered'
    },
    {
      id: 'user202',
      username: 'Sniper_Elite',
      score: 2600,
      correctAnswers: 3,
      streak: 2,
      answerStatus: 'timeout'
    }
  ];

  // Timer effect
  useEffect(() => {
    if (gameState === 'active' && timeRemaining > 0 && !isAnswered) {
      const timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isAnswered) {
      handleTimeUp();
    }
  }, [timeRemaining, gameState, isAnswered]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex) => {
    if (isAnswered || showResults) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    // Simulate network delay
    setTimeout(() => {
      setShowResults(true);
      
      const currentQ = mockQuestions?.[currentQuestion - 1];
      const isCorrect = answerIndex === currentQ?.correctAnswer;
      const points = isCorrect ? Math.max(100, 500 - (15 - timeRemaining) * 20) : 0;
      
      setUserScore(prev => prev + points);
      setUserAnswers(prev => [...prev, {
        questionId: currentQ?.id,
        selectedAnswer: answerIndex,
        isCorrect,
        points
      }]);
    }, 1500);
  }, [isAnswered, showResults, currentQuestion, timeRemaining]);

  // Handle time up
  const handleTimeUp = useCallback(() => {
    if (isAnswered) return;
    
    setIsAnswered(true);
    setSelectedAnswer(null);
    
    setTimeout(() => {
      setShowResults(true);
      setUserAnswers(prev => [...prev, {
        questionId: mockQuestions?.[currentQuestion - 1]?.id,
        selectedAnswer: null,
        isCorrect: false,
        points: 0
      }]);
    }, 1000);
  }, [isAnswered, currentQuestion]);

  // Handle next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestion >= mockQuestions?.length) {
      setGameState('complete');
      return;
    }
    
    setCurrentQuestion(prev => prev + 1);
    setTimeRemaining(15);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setShowResults(false);
    setGameState('active');
  }, [currentQuestion]);

  // Handle quiz exit
  const handleExitQuiz = async () => {
    try {
      // Obter dados da sala
      const roomData = await getGameRoomById(mockUser.id);
      
      if (roomData) {
        // Distribuir prêmios com base nas pontuações finais
        const prizeDistribution = await distributeWinnings(roomData.id, mockParticipants);
        
        // Verificar se o usuário atual é o vencedor
        const sortedParticipants = [...mockParticipants].sort((a, b) => b.score - a.score);
        const isWinner = sortedParticipants[0].id === mockUser.id;
        
        // Se o usuário for o vencedor e a sala permitir dobrar a aposta
        if (isWinner && roomData.allowDoubleDown) {
          // Calcular o valor ganho
          const totalWinnings = prizeDistribution.find(p => p.userId === mockUser.id)?.amount || 0;
          
          // Mostrar modal de dobro ou nada
          setWinnings(totalWinnings);
          setCurrentGameRoom(roomData);
          setShowDoubleDownModal(true);
          return;
        }
      }
      
      navigate('/game-rooms');
    } catch (error) {
      console.error('Erro ao finalizar quiz:', error);
      navigate('/dashboard');
    }
  };
  
  // Handle close double down modal
  const handleCloseDoubleDown = () => {
    setShowDoubleDownModal(false);
    navigate('/game-rooms');
  };

  // Get current question data
  const getCurrentQuestion = () => mockQuestions?.[currentQuestion - 1];
  const getCurrentAnswer = () => userAnswers?.[currentQuestion - 1];

  // Calculate final stats
  const correctAnswersCount = userAnswers?.filter(answer => answer?.isCorrect)?.length;
  const finalPosition = mockParticipants?.findIndex(p => p?.id === mockUser?.id) + 1;
  const coinsEarned = Math.floor(userScore / 10);

  // Mock achievements
  const mockAchievements = [
    {
      name: 'Resposta Rápida',
      description: 'Respondeu em menos de 5 segundos'
    },
    {
      name: 'Especialista em Mapas',
      description: 'Acertou todas as perguntas sobre mapas'
    }
  ];

  const mockQuizStats = {
    averageTime: 8,
    fastAnswers: 2,
    maxStreak: 2,
    strongCategory: 'Mapas'
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader 
        user={mockUser}
        balance={mockUser?.balance}
        notifications={[]}
      />
      <div className="pt-16">
        {/* Mobile Header */}
        <div className="lg:hidden bg-card border-b border-border p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExitQuiz}
            >
              <Icon name="ArrowLeft" size={20} />
            </Button>
            
            <div className="flex items-center space-x-2">
              <Icon name="Gamepad2" size={20} color="var(--color-primary)" />
              <span className="font-semibold text-foreground">Quiz Ao Vivo</span>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden"
            >
              <Icon name="Users" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex">
          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8">
            {gameState === 'active' && !showResults && (
              <QuestionDisplay
                question={getCurrentQuestion()}
                questionNumber={currentQuestion}
                totalQuestions={mockQuestions?.length}
                timeRemaining={timeRemaining}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                isAnswered={isAnswered}
                showCorrectAnswer={false}
                correctAnswer={null}
              />
            )}

            {gameState === 'active' && showResults && (
              <div className="space-y-6">
                <QuestionDisplay
                  question={getCurrentQuestion()}
                  questionNumber={currentQuestion}
                  totalQuestions={mockQuestions?.length}
                  timeRemaining={0}
                  selectedAnswer={selectedAnswer}
                  onAnswerSelect={() => {}}
                  isAnswered={true}
                  showCorrectAnswer={true}
                  correctAnswer={getCurrentQuestion()?.correctAnswer}
                />
                
                <QuestionResults
                  question={getCurrentQuestion()}
                  userAnswer={selectedAnswer}
                  correctAnswer={getCurrentQuestion()?.correctAnswer}
                  isCorrect={selectedAnswer === getCurrentQuestion()?.correctAnswer}
                  pointsEarned={getCurrentAnswer()?.points || 0}
                  currentScore={userScore}
                  leaderboardPosition={finalPosition}
                  totalParticipants={mockParticipants?.length}
                  onNextQuestion={handleNextQuestion}
                />

                <div className="text-center">
                  <Button
                    variant="default"
                    onClick={handleNextQuestion}
                    iconName="ArrowRight"
                    iconPosition="right"
                    size="lg"
                  >
                    {currentQuestion >= mockQuestions?.length ? 'Ver Resultado Final' : 'Próxima Pergunta'}
                  </Button>
                </div>
              </div>
            )}

            {gameState === 'complete' && (
              <div>
                <QuizComplete
                  finalScore={userScore}
                  totalQuestions={mockQuestions?.length}
                  correctAnswers={correctAnswersCount}
                  finalPosition={finalPosition}
                  totalParticipants={mockParticipants?.length}
                  coinsEarned={coinsEarned}
                  achievements={mockAchievements}
                  quizStats={mockQuizStats}
                />
                
                <div className="mt-6 bg-muted/30 p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Distribuição de Prêmios</h3>
                  <div className="space-y-2">
                    {mockParticipants.slice(0, 3).map((participant, index) => (
                      <div key={participant.id} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium">{index + 1}</span>
                          </div>
                          <span>{participant.username}</span>
                        </div>
                        <div>
                          <span className="font-medium">
                            {index === 0 ? '100%' : index === 1 ? '0%' : '0%'} do prêmio
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-8 text-center">
                  <Button onClick={handleExitQuiz} size="lg">
                    {finalPosition === 1 ? 'Receber Prêmio' : 'Voltar às Salas'}
                  </Button>
                </div>
              </div>
            )}
          </main>

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 bg-card border-l border-border p-6">
            <LiveParticipants
              participants={mockParticipants}
              currentQuestion={currentQuestion}
              showAnswerStatus={gameState === 'active'}
            />
          </aside>
        </div>

        {/* Mobile Sidebar Overlay */}
        {showSidebar && (
          <div className="lg:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <div className="fixed right-0 top-0 h-full w-80 bg-card border-l border-border p-6 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-card-foreground">
                  Participantes
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSidebar(false)}
                >
                  <Icon name="X" size={20} />
                </Button>
              </div>
              
              <LiveParticipants
                participants={mockParticipants}
                currentQuestion={currentQuestion}
                showAnswerStatus={gameState === 'active'}
              />
            </div>
          </div>
        )}
      </div>
      {/* Network Status */}
      <NetworkStatus
        connectionStatus={connectionStatus}
        latency={latency}
        participantCount={mockParticipants?.length}
        syncStatus={syncStatus}
      />
      
      {/* Double Down Modal */}
      {showDoubleDownModal && (
        <DoubleDownModal
          isOpen={showDoubleDownModal}
          onClose={handleCloseDoubleDown}
          currentUser={mockUser}
          gameRoom={currentGameRoom}
          winnings={winnings}
        />
      )}
    </div>
  );
};

export default LiveQuiz;