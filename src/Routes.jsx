import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import QuizLobby from './pages/quiz-lobby';
import LiveQuiz from './pages/live-quiz';
import SteamLoginPage from './pages/steam-login';
import Dashboard from './pages/dashboard';
import LeaderboardsPage from './pages/leaderboards';
import ProfileSettings from './pages/profile-settings';
import GameRoomsPage from './pages/game-rooms';
import WaitingRoom from './components/WaitingRoom/WaitingRoom';
import { getCurrentUser } from './utils/authService';

// Componente para proteger rotas que requerem autenticação
const ProtectedRoute = ({ children }) => {
  const currentUser = getCurrentUser();
  
  if (!currentUser) {
    // Redirecionar para a página de login se não estiver autenticado
    return <Navigate to="/steam-login" replace />;
  }
  
  return children;
};

const Routes = () => {
  // Obter o ID do cliente do Google das variáveis de ambiente
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  
  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <BrowserRouter>
        <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Rotas públicas */}
          <Route path="/steam-login" element={<SteamLoginPage />} />
          
          {/* Rotas protegidas (requerem autenticação) */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/quiz-lobby/:lobbyId" element={
            <ProtectedRoute>
              <QuizLobby />
            </ProtectedRoute>
          } />
          <Route path="/quiz-lobby" element={
            <ProtectedRoute>
              <QuizLobby />
            </ProtectedRoute>
          } />
          <Route path="/live-quiz/:quizId" element={
            <ProtectedRoute>
              <LiveQuiz />
            </ProtectedRoute>
          } />
          <Route path="/live-quiz" element={
            <ProtectedRoute>
              <LiveQuiz />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/game-rooms" element={
            <ProtectedRoute>
              <GameRoomsPage />
            </ProtectedRoute>
          } />
          <Route path="/waiting-room/:roomId" element={
            <ProtectedRoute>
              <WaitingRoom />
            </ProtectedRoute>
          } />
          <Route path="/leaderboards" element={
            <ProtectedRoute>
              <LeaderboardsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile-settings" element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          } />
          
          {/* Rota 404 */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
        </ErrorBoundary>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default Routes;
