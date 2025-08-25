import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationSystem = ({ 
  notifications = [],
  onDismiss = () => {},
  onAction = () => {},
  position = 'top-right',
  maxVisible = 5
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications?.slice(0, maxVisible));
  }, [notifications, maxVisible]);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => 
      prev?.filter(notification => notification?.id !== notificationId)
    );
    onDismiss(notificationId);
  };

  const handleAction = (notificationId, action) => {
    onAction(notificationId, action);
    handleDismiss(notificationId);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-20 left-4';
      case 'top-right':
        return 'top-20 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-20 right-4';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      case 'warning':
        return { name: 'AlertTriangle', color: 'var(--color-warning)' };
      case 'error':
        return { name: 'XCircle', color: 'var(--color-error)' };
      case 'info':
        return { name: 'Info', color: 'var(--color-accent)' };
      case 'lobby-invite':
        return { name: 'Users', color: 'var(--color-primary)' };
      case 'trade-offer':
        return { name: 'ArrowRightLeft', color: 'var(--color-warning)' };
      case 'quiz-result':
        return { name: 'Trophy', color: 'var(--color-success)' };
      default:
        return { name: 'Bell', color: 'var(--color-muted-foreground)' };
    }
  };

  const NotificationToast = ({ notification }) => {
    const [isVisible, setIsVisible] = useState(false);
    const icon = getNotificationIcon(notification?.type);

    useEffect(() => {
      setIsVisible(true);
      
      if (notification?.autoClose !== false) {
        const timer = setTimeout(() => {
          handleDismiss(notification?.id);
        }, notification?.duration || 5000);
        
        return () => clearTimeout(timer);
      }
    }, []);

    return (
      <div 
        className={`
          w-80 bg-card border border-border rounded-lg shadow-modal p-4 mb-3
          gaming-transition animate-slide-in
          ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'}
        `}
      >
        <div className="flex items-start space-x-3">
          <Icon 
            name={icon?.name} 
            size={20} 
            color={icon?.color}
            className="flex-shrink-0 mt-0.5"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {notification?.title && (
                  <h4 className="text-sm font-medium text-card-foreground mb-1">
                    {notification?.title}
                  </h4>
                )}
                <p className="text-sm text-muted-foreground">
                  {notification?.message}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDismiss(notification?.id)}
                className="h-6 w-6 text-muted-foreground hover:text-foreground ml-2"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>

            {/* Action Buttons */}
            {notification?.actions && notification?.actions?.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                {notification?.actions?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.variant || 'outline'}
                    size="sm"
                    onClick={() => handleAction(notification?.id, action)}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            )}

            {/* Progress Bar for timed notifications */}
            {notification?.showProgress && (
              <div className="mt-3">
                <div className="w-full bg-muted rounded-full h-1">
                  <div 
                    className="bg-primary h-1 rounded-full gaming-transition"
                    style={{ 
                      width: `${notification?.progress || 0}%`,
                      transition: 'width 1s linear'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (visibleNotifications?.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-1200 ${getPositionClasses()}`}>
      {visibleNotifications?.map((notification) => (
        <NotificationToast 
          key={notification?.id} 
          notification={notification}
        />
      ))}
    </div>
  );
};

export default NotificationSystem;