import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import Button from './ui/Button';
import Icon from './AppIcon';

const GoogleLoginButton = ({ onSuccess, onError, text, className }) => {
  return (
    <GoogleLogin
      onSuccess={onSuccess}
      onError={onError}
      useOneTap={false}
      theme="filled_blue"
      shape="rectangular"
      text="signin_with"
      locale="pt-BR"
      render={({ onClick, disabled }) => (
        <Button
          onClick={onClick}
          disabled={disabled}
          variant="outline"
          fullWidth
          className={`flex items-center justify-center ${className}`}
        >
          <Icon name="LogIn" className="mr-2" size={16} />
          {text || "Entrar com Google"}
        </Button>
      )}
    />
  );
};

export default GoogleLoginButton;