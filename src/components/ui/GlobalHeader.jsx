import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const GlobalHeader = ({ 
  user = null, 
  balance = 0, 
  notifications = [], 
  onNavigate = () => {} 
}) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: 'Home',
      tooltip: 'View lobbies and manage your gaming economy'
    },
    { 
      label: 'Leaderboards', 
      path: '/leaderboards', 
      icon: 'Trophy',
      tooltip: 'Check rankings and achievements'
    },
    { 
      label: 'Profile', 
      path: '/profile-settings', 
      icon: 'User',
      tooltip: 'Account settings and Steam integration'
    }
  ];

  const isActiveRoute = (path) => location?.pathname === path;

  const handleNavigation = (path) => {
    onNavigate(path);
    setIsMobileMenuOpen(false);
  };

  const Logo = () => (
    <Link to="/dashboard" className="flex items-center space-x-2 gaming-transition hover:opacity-80">
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Zap" size={20} color="white" />
      </div>
      <span className="text-xl font-bold text-white hidden sm:block">
        CS Quiz Arena
      </span>
    </Link>
  );

  const CoinBalance = () => (
    <div className="flex items-center space-x-2 bg-card px-3 py-2 rounded-lg border border-border">
      <Icon name="Coins" size={16} color="var(--color-warning)" />
      <span className="text-sm font-mono text-warning font-medium">
        {balance?.toLocaleString()}
      </span>
    </div>
  );

  const UserMenu = () => (
    <div className="relative">
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg gaming-transition hover:bg-card"
      >
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
          <Icon name="User" size={16} color="var(--color-muted-foreground)" />
        </div>
        {user && (
          <span className="text-sm text-muted-foreground hidden md:block">
            {user?.username}
          </span>
        )}
        <Icon 
          name="ChevronDown" 
          size={16} 
          color="var(--color-muted-foreground)"
          className={`gaming-transition ${isUserMenuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isUserMenuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-1200 animate-fade-in">
          <div className="p-2">
            <Link
              to="/profile-settings"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md gaming-transition"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Icon name="Settings" size={16} />
              <span>Settings</span>
            </Link>
            <Link
              to="/steam-login"
              className="flex items-center space-x-2 px-3 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground rounded-md gaming-transition"
              onClick={() => setIsUserMenuOpen(false)}
            >
              <Icon name="LogOut" size={16} />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );

  const NotificationBadge = () => (
    notifications?.length > 0 && (
      <div className="absolute -top-1 -right-1 w-5 h-5 bg-error rounded-full flex items-center justify-center">
        <span className="text-xs font-medium text-error-foreground">
          {notifications?.length > 9 ? '9+' : notifications?.length}
        </span>
      </div>
    )
  );

  return (
    <header className="fixed top-0 left-0 right-0 z-1000 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium gaming-transition
                  ${isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground gaming-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }
                `}
                title={item?.tooltip}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <CoinBalance />
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="relative"
              >
                <Icon name="Bell" size={20} />
                <NotificationBadge />
              </Button>
            </div>

            <UserMenu />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg gaming-transition hover:bg-card"
            >
              <Icon 
                name={isMobileMenuOpen ? "X" : "Menu"} 
                size={20} 
                color="var(--color-foreground)" 
              />
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border animate-slide-in">
          <nav className="px-4 py-4 space-y-2">
            {navigationItems?.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`
                  flex items-center space-x-3 px-4 py-3 rounded-lg gaming-transition
                  ${isActiveRoute(item?.path)
                    ? 'bg-primary text-primary-foreground gaming-glow'
                    : 'text-muted-foreground hover:text-foreground hover:bg-card'
                  }
                `}
              >
                <Icon name={item?.icon} size={20} />
                <span className="font-medium">{item?.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;