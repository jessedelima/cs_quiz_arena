import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const PrimaryNavigation = ({ 
  onNavigate = () => {},
  className = ""
}) => {
  const location = useLocation();

  // Verificar se o usuário é administrador
  const currentUser = JSON.parse(localStorage.getItem('cs_quiz_arena_current_user')) || {};
  const isAdmin = currentUser?.isAdmin === true;
  
  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'Home',
      badge: null,
      tooltip: 'View lobbies and manage your gaming economy'
    },
    { 
      label: 'Leaderboards', 
      path: '/leaderboards', 
      icon: 'Trophy',
      badge: null,
      tooltip: 'Check rankings and achievements'
    },
    { 
      label: 'Profile', 
      path: '/profile-settings', 
      icon: 'User',
      badge: null,
      tooltip: 'Account settings and Steam integration'
    },
    // Item de navegação para administradores
    ...(isAdmin ? [
      { 
        label: 'Admin', 
        path: '/admin', 
        icon: 'Settings',
        badge: null,
        tooltip: 'Painel de administração'
      }
    ] : [])
  ];

  const isActiveRoute = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    onNavigate(path);
  };

  return (
    <nav className={`flex items-center space-x-1 ${className}`}>
      {navigationItems?.map((item) => (
        <Link
          key={item?.path}
          to={item?.path}
          onClick={() => handleNavigation(item?.path)}
          className={`
            relative flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium gaming-transition
            ${isActiveRoute(item?.path)
              ? 'bg-primary text-primary-foreground gaming-glow'
              : 'text-muted-foreground hover:text-foreground hover:bg-card'
            }
          `}
          title={item?.tooltip}
        >
          <Icon name={item?.icon} size={16} />
          <span>{item?.label}</span>
          
          {item?.badge && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
              <span className="text-xs font-medium text-error-foreground">
                {item?.badge > 9 ? '9+' : item?.badge}
              </span>
            </div>
          )}
        </Link>
      ))}
    </nav>
  );
};

export default PrimaryNavigation;