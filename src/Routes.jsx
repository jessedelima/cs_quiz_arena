import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import QuizLobby from './pages/quiz-lobby';
import LiveQuiz from './pages/live-quiz';
import SteamLoginPage from './pages/steam-login';
import Dashboard from './pages/dashboard';
import LeaderboardsPage from './pages/leaderboards';
import ProfileSettings from './pages/profile-settings';
import RegisterPage from './pages/register';
import EmailConfirmationPage from './pages/email-confirmation';
import GameRoomsPage from './pages/game-rooms';
import AdminDashboard from './pages/admin';
import AdminLogin from './pages/admin-login';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/quiz-lobby/:lobbyId" element={<QuizLobby />} />
        <Route path="/quiz-lobby" element={<QuizLobby />} />
        <Route path="/live-quiz/:quizId" element={<LiveQuiz />} />
        <Route path="/live-quiz" element={<LiveQuiz />} />
        <Route path="/steam-login" element={<SteamLoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/game-rooms" element={<GameRoomsPage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
