import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GlobalHeader from '../../components/ui/GlobalHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import QuestionDisplay from './components/QuestionDisplay';
import websocketService from '../../api/websocketService';
import { getQuestions, startQuiz, submitAnswer, nextQuestion, finishQuiz, getQuizResults } from '../../utils/quizService';

const LiveQuiz = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  
  // Estados do jogo
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState({
    status: 'waiting', // waiting, active, completed
    currentQuestion: 0,
    totalQuestions: 10,
    timeRemaining: 15,
    score: 0,
    questions: [],
    selectedAnswer: null,
    isAnswered: false,
    showCorrectAnswer: false,
    correctAnswer: null,
    results: null
  });
  
  // Mock do usuário atual (substituir por autenticação real)
  const currentUser = {
    id: 'user123',
    name: 'Jogador CS',
    balance: 1000,
    avatar: 'https://placehold.co/100x100'
  };

  // Participantes mockados para teste
  const mockParticipants = [
    {
      userId: 'user123',
      name: 'Jogador CS',
      avatar: 'https://placehold.co/100x100'
    },
    {
      userId: 'user456',
      name: 'Pro Player',
      avatar: 'https://placehold.co/100x100'
    },
    {
      userId: 'user789',
      name: 'Noob Master',
      avatar: 'https://placehold.co/100x100'
    }
  ];

  useEffect(() => {
    // Conectar ao WebSocket para a sala
    websocketService.connect(roomId, currentUser.id);
    
    // Inicializar o jogo
    initGame();
    
    // Configurar listeners para eventos do jogo
    const unsubscribeGameUpdated = websocketService.on('game_updated', handleGameUpdated);
    const unsubscribeGameCompleted = websocketService.on('game_completed', handleGameCompleted);
    
    // Limpar listeners quando o componente for desmontado
    return () => {
      unsubscribeGameUpdated();
      unsubscribeGameCompleted();
      websocketService.disconnect();
    };
  }, [roomId]);

  // Inicializar o jogo
  const initGame = () => {
    setLoading(true);
    try {
      // Iniciar o quiz usando o serviço
      const gameOptions = {
        timePerQuestion: 15,
        count: 10,
        difficulty: 'medium'
      };
      
      // Em um cenário real, os participantes viriam do servidor
      // Por enquanto, usamos participantes mockados
      const game = startQuiz(roomId, mockParticipants, gameOptions);
      
      setGameState(prev => ({
        ...prev,
        status: 'active',
        questions: game.questions,
        totalQuestions: game.questions.length,
        currentQuestion: 0,
        timeRemaining: game.timePerQuestion
      }));
      
      // Iniciar o cronômetro para a primeira pergunta
      startTimer();
      
      setLoading(false);
    } catch (err) {
      console.error('Erro ao inicializar o jogo:', err);
      setError('Erro ao carregar o jogo');
      setLoading(false);
    }
  };

  // Iniciar o cronômetro para a pergunta atual
  const startTimer = () => {
    // Limpar qualquer timer existente
    if (window.quizTimer) {
      clearInterval(window.quizTimer);
    }
    
    // Definir o tempo inicial
    setGameState(prev => ({
      ...prev,
      timeRemaining: 15,
      selectedAnswer: null,
      isAnswered: false,
      showCorrectAnswer: false
    }));
    
    // Iniciar o cronômetro
    window.quizTimer = setInterval(() => {
      setGameState(prev => {
        // Se o tempo acabou
        if (prev.timeRemaining <= 1) {
          clearInterval(window.quizTimer);
          
          // Mostrar a resposta correta
          const correctAnswer = prev.questions[prev.currentQuestion].correctAnswer;
          
          return {
            ...prev,
            timeRemaining: 0,
            isAnswered: true,
            showCorrectAnswer: true,
            correctAnswer
          };
        }
        
        return {
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        };
      });
    }, 1000);
  };

  // Selecionar uma resposta
  const handleAnswerSelect = (answerIndex) => {
    // Parar o cronômetro
    clearInterval(window.quizTimer);
    
    const currentQuestion = gameState.questions[gameState.currentQuestion];
    const timeSpent = 15 - gameState.timeRemaining;
    
    try {
      // Submeter a resposta usando o serviço
      const updatedGame = submitAnswer(
        roomId, 
        currentUser.id, 
        gameState.currentQuestion, 
        answerIndex, 
        timeSpent
      );
      
      // Buscar o jogador atual
      const currentPlayer = updatedGame.participants.find(p => p.userId === currentUser.id);
      const isCorrect = currentPlayer.answers[gameState.currentQuestion].isCorrect;
      const points = currentPlayer.answers[gameState.currentQuestion].points;
      
      // Atualizar o estado do jogo
      setGameState(prev => ({
        ...prev,
        selectedAnswer: answerIndex,
        isAnswered: true,
        score: currentPlayer.score
      }));
      
      // Após 2 segundos, mostrar a resposta correta
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showCorrectAnswer: true,
          correctAnswer: currentQuestion.correctAnswer
        }));
        
        // Após mais 2 segundos, avançar para a próxima pergunta ou finalizar o jogo
        setTimeout(() => {
          if (gameState.currentQuestion < gameState.totalQuestions - 1) {
            try {
              // Avançar para a próxima pergunta usando o serviço
              const nextGame = nextQuestion(roomId);
              
              setGameState(prev => ({
                ...prev,
                currentQuestion: nextGame.currentQuestion,
                selectedAnswer: null,
                isAnswered: false,
                showCorrectAnswer: false,
                correctAnswer: null
              }));
              
              // Iniciar o cronômetro para a próxima pergunta
              startTimer();
            } catch (err) {
              console.error('Erro ao avançar para a próxima pergunta:', err);
            }
          } else {
            try {
              // Finalizar o jogo usando o serviço
              const results = finishQuiz(roomId);
              
              setGameState(prev => ({
                ...prev,
                status: 'completed',
                results: results
              }));
            } catch (err) {
              console.error('Erro ao finalizar o jogo:', err);
              
              // Mesmo com erro, mostrar os resultados
              showResults();
            }
          }
        }, 2000);
      }, 2000);
      
      // Enviar a resposta para o servidor via WebSocket
      websocketService.send('submit_answer', {
        roomId,
        userId: currentUser.id,
        questionIndex: gameState.currentQuestion,
        answerIndex,
        timeSpent,
        isCorrect
      });
    } catch (err) {
      console.error('Erro ao submeter resposta:', err);
      
      // Mesmo com erro, continuar o jogo
      const isCorrect = answerIndex === currentQuestion.correctAnswer;
      const points = isCorrect ? Math.max(100, 500 - timeSpent * 20) : 0;
      
      setGameState(prev => ({
        ...prev,
        selectedAnswer: answerIndex,
        isAnswered: true,
        score: prev.score + points,
        showCorrectAnswer: true,
        correctAnswer: currentQuestion.correctAnswer
      }));
    }
  };

  // Handlers para eventos WebSocket
  const handleGameUpdated = (data) => {
    console.log('Jogo atualizado:', data);
    
    // Atualizar o estado do jogo com os dados recebidos
    if (data.status === 'active') {
      // Atualizar pontuações e estado atual do jogo
      const currentPlayer = data.participants.find(p => p.userId === currentUser.id);
      
      setGameState(prev => ({
        ...prev,
        currentQuestion: data.currentQuestion,
        score: currentPlayer?.score || prev.score,
        timeRemaining: data.timeRemaining || prev.timeRemaining
      }));
    }
  };

  const handleGameCompleted = (data) => {
    console.log('Jogo finalizado:', data);
    
    try {
      // Buscar os resultados do jogo usando o serviço
      const results = getQuizResults(roomId);
      
      if (results) {
        // Atualizar o estado do jogo com os resultados finais
        setGameState(prev => ({
          ...prev,
          status: 'completed',
          results: results
        }));
      } else {
        // Se não conseguir buscar os resultados, usar os dados recebidos
        setGameState(prev => ({
          ...prev,
          status: 'completed',
          results: data.results
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar resultados do jogo:', err);
      
      // Mesmo com erro, atualizar com os dados recebidos
      setGameState(prev => ({
        ...prev,
        status: 'completed',
        results: data.results
      }));
    }
  };

  // Mostrar os resultados do jogo
  const showResults = () => {
    try {
      // Buscar os resultados do jogo usando o serviço
      const results = getQuizResults(roomId);
      
      if (results) {
        // Formatar os resultados para exibição
        const formattedResults = {
          winner: results.winner,
          totalPrize: 1000, // Valor mockado para exemplo
          playerResults: results.playerResults.map(player => ({
            userId: player.userId,
            position: player.position,
            score: player.score,
            correctAnswers: player.correctAnswers,
            winnings: player.position === 1 ? 1000 : player.position === 2 ? 500 : player.position === 3 ? 250 : 0 // Valores mockados para exemplo
          }))
        };
        
        setGameState(prev => ({
          ...prev,
          results: formattedResults
        }));
      } else {
        // Se não conseguir buscar os resultados, usar resultados mockados
        const mockResults = {
          winner: currentUser.id,
          totalPrize: 1000,
          playerResults: [
            {
              userId: currentUser.id,
              position: 1,
              score: gameState.score,
              correctAnswers: Math.floor(gameState.score / 100),
              winnings: 1000
            }
          ]
        };
        
        setGameState(prev => ({
          ...prev,
          results: mockResults
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar resultados do jogo:', err);
      
      // Mesmo com erro, mostrar resultados mockados
      const mockResults = {
        winner: currentUser.id,
        totalPrize: 1000,
        playerResults: [
          {
            userId: currentUser.id,
            position: 1,
            score: gameState.score,
            correctAnswers: Math.floor(gameState.score / 100),
            winnings: 1000
          }
        ]
      };
      
      setGameState(prev => ({
        ...prev,
        results: mockResults
      }));
    }
  };

  // Voltar para a sala de torneio
  const handleBackToRoom = () => {
    // Enviar evento para o servidor via WebSocket para notificar que o jogador voltou para a sala
    websocketService.send('player_returned', {
      roomId,
      userId: currentUser.id
    });
    
    // Navegar de volta para a sala de torneio
    navigate(`/tournament-room/${roomId}`);
  };

  // Voltar para a lista de salas
  const handleBackToRooms = () => {
    navigate('/game-rooms');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="loader" className="mx-auto mb-4 animate-spin" size={48} />
          <h2 className="text-xl font-semibold">Carregando quiz...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Icon name="alert-triangle" className="mx-auto mb-4 text-error" size={48} />
          <h2 className="text-xl font-semibold mb-4">{error}</h2>
          <Button onClick={handleBackToRooms} variant="primary">
            Voltar para Salas
          </Button>
        </div>
      </div>
    );
  }

  // Renderizar a tela de resultados
  if (gameState.status === 'completed' && gameState.results) {
    return (
      <div className="min-h-screen bg-background">
        <GlobalHeader />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Resultados do Quiz</h1>
            <Button onClick={handleBackToRooms} variant="outline" size="sm">
              <Icon name="list" className="mr-2" size={16} />
              Voltar para Salas
            </Button>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-8 text-center mb-8">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="award" className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Quiz Concluído!</h2>
            <p className="text-muted-foreground mb-6">
              Você marcou {gameState.score} pontos
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Posição</div>
                <div className="text-2xl font-bold">
                  {gameState.results.playerResults.find(p => p.userId === currentUser.id)?.position || '-'}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Respostas Corretas</div>
                <div className="text-2xl font-bold">
                  {gameState.results.playerResults.find(p => p.userId === currentUser.id)?.correctAnswers || 0}/{gameState.totalQuestions}
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-lg">
                <div className="text-sm text-muted-foreground">Prêmio</div>
                <div className="text-2xl font-bold">
                  {gameState.results.playerResults.find(p => p.userId === currentUser.id)?.winnings || 0} moedas
                </div>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-4">
              <Button onClick={handleBackToRoom} variant="outline">
                <Icon name="arrow-left" className="mr-2" size={16} />
                Voltar para Sala
              </Button>
              <Button onClick={handleBackToRooms} variant="primary">
                <Icon name="list" className="mr-2" size={16} />
                Ver Outras Salas
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Renderizar a tela de jogo
  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Quiz ao Vivo</h1>
            <div className="px-4 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
              Pontuação: {gameState.score}
            </div>
          </div>
          
          <Button onClick={handleBackToRoom} variant="outline" size="sm" disabled={gameState.status === 'active'}>
            <Icon name="x" className="mr-2" size={16} />
            Abandonar Quiz
          </Button>
        </div>
        
        {gameState.questions.length > 0 && (
          <QuestionDisplay 
            question={gameState.questions[gameState.currentQuestion]}
            questionNumber={gameState.currentQuestion + 1}
            totalQuestions={gameState.totalQuestions}
            timeRemaining={gameState.timeRemaining}
            selectedAnswer={gameState.selectedAnswer}
            onAnswerSelect={handleAnswerSelect}
            isAnswered={gameState.isAnswered}
            showCorrectAnswer={gameState.showCorrectAnswer}
            correctAnswer={gameState.correctAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default LiveQuiz;