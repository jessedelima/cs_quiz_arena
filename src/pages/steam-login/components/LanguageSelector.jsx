import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const LanguageSelector = ({ onLanguageChange = () => {} }) => {
  const [currentLanguage, setCurrentLanguage] = useState('pt-BR');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'pt-BR', name: 'Português (BR)', flag: '🇧🇷' },
    { code: 'en-US', name: 'English (US)', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    const savedLanguage = localStorage.getItem('cs-quiz-language') || 'pt-BR';
    setCurrentLanguage(savedLanguage);
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    localStorage.setItem('cs-quiz-language', languageCode);
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const currentLang = languages?.find(lang => lang?.code === currentLanguage);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-card border border-border rounded-lg gaming-transition hover:bg-card/80"
      >
        <span className="text-lg">{currentLang?.flag}</span>
        <span className="text-sm text-foreground hidden sm:block">
          {currentLang?.name?.split(' ')?.[0]}
        </span>
        <Icon 
          name="ChevronDown" 
          size={16} 
          color="var(--color-muted-foreground)"
          className={`gaming-transition ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-modal z-50 animate-fade-in">
          <div className="p-2">
            {languages?.map((language) => (
              <button
                key={language?.code}
                onClick={() => handleLanguageChange(language?.code)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 text-sm rounded-md gaming-transition
                  ${currentLanguage === language?.code
                    ? 'bg-primary text-primary-foreground'
                    : 'text-popover-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                <span className="text-lg">{language?.flag}</span>
                <span>{language?.name}</span>
                {currentLanguage === language?.code && (
                  <Icon name="Check" size={16} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;