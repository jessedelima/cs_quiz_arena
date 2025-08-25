import React from 'react';
import Icon from '../../../components/AppIcon';

const NetworkStatus = ({ 
  connectionStatus = 'connected',
  latency = 0,
  participantCount = 0,
  syncStatus = 'synced'
}) => {
  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return { name: 'Wifi', color: 'var(--color-success)' };
      case 'reconnecting':
        return { name: 'WifiOff', color: 'var(--color-warning)' };
      case 'disconnected':
        return { name: 'WifiOff', color: 'var(--color-error)' };
      default:
        return { name: 'Wifi', color: 'var(--color-muted-foreground)' };
    }
  };

  const getSyncIcon = () => {
    switch (syncStatus) {
      case 'synced':
        return { name: 'CheckCircle', color: 'var(--color-success)' };
      case 'syncing':
        return { name: 'RotateCw', color: 'var(--color-warning)' };
      case 'error':
        return { name: 'AlertCircle', color: 'var(--color-error)' };
      default:
        return { name: 'Circle', color: 'var(--color-muted-foreground)' };
    }
  };

  const connectionIcon = getConnectionIcon();
  const syncIcon = getSyncIcon();

  const getLatencyColor = () => {
    if (latency < 50) return 'text-success';
    if (latency < 100) return 'text-warning';
    return 'text-error';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-card border border-border rounded-lg p-3 shadow-modal z-50">
      <div className="flex items-center space-x-4 text-sm">
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={connectionIcon?.name} 
            size={16} 
            color={connectionIcon?.color}
            className={syncStatus === 'syncing' ? 'animate-spin' : ''}
          />
          <span className="text-muted-foreground">
            {connectionStatus === 'connected' && 'Online'}
            {connectionStatus === 'reconnecting' && 'Reconectando...'}
            {connectionStatus === 'disconnected' && 'Desconectado'}
          </span>
        </div>

        {/* Latency */}
        {connectionStatus === 'connected' && (
          <div className="flex items-center space-x-1">
            <span className={`font-mono ${getLatencyColor()}`}>
              {latency}ms
            </span>
          </div>
        )}

        {/* Sync Status */}
        <div className="flex items-center space-x-2">
          <Icon 
            name={syncIcon?.name} 
            size={16} 
            color={syncIcon?.color}
            className={syncStatus === 'syncing' ? 'animate-spin' : ''}
          />
        </div>

        {/* Participant Count */}
        <div className="flex items-center space-x-2">
          <Icon name="Users" size={16} color="var(--color-primary)" />
          <span className="text-primary font-medium">
            {participantCount}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NetworkStatus;