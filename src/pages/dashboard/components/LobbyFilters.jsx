import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const LobbyFilters = ({ 
  onFilterChange = () => {},
  activeFilters = {},
  lobbyCount = 0
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = {
    difficulty: [
      { value: 'all', label: 'Todas', icon: 'Circle' },
      { value: 'fácil', label: 'Fácil', icon: 'Circle', color: 'var(--color-success)' },
      { value: 'médio', label: 'Médio', icon: 'CircleDot', color: 'var(--color-warning)' },
      { value: 'difícil', label: 'Difícil', icon: 'Zap', color: 'var(--color-error)' }
    ],
    entryFee: [
      { value: 'all', label: 'Todas', icon: 'Coins' },
      { value: 'free', label: 'Grátis', icon: 'Gift' },
      { value: 'low', label: '< 100', icon: 'Coins' },
      { value: 'medium', label: '100-500', icon: 'Coins' },
      { value: 'high', label: '> 500', icon: 'Coins' }
    ],
    players: [
      { value: 'all', label: 'Todos', icon: 'Users' },
      { value: 'available', label: 'Vagas', icon: 'UserPlus' },
      { value: 'filling', label: 'Enchendo', icon: 'Users' },
      { value: 'almost-full', label: 'Quase Cheio', icon: 'UserCheck' }
    ]
  };

  const handleFilterClick = (category, value) => {
    const newFilters = {
      ...activeFilters,
      [category]: activeFilters?.[category] === value ? 'all' : value
    };
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange({
      difficulty: 'all',
      entryFee: 'all',
      players: 'all'
    });
  };

  const hasActiveFilters = Object.values(activeFilters)?.some(filter => filter !== 'all');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-card-foreground">
            Filtros
          </h3>
          <div className="bg-muted px-2 py-1 rounded-full">
            <span className="text-xs font-medium text-muted-foreground">
              {lobbyCount} lobbies
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              iconName="X"
              iconPosition="left"
            >
              Limpar
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          >
            {isExpanded ? 'Menos' : 'Mais'}
          </Button>
        </div>
      </div>
      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {filterOptions?.difficulty?.slice(0, 4)?.map((option) => (
          <button
            key={option?.value}
            onClick={() => handleFilterClick('difficulty', option?.value)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium gaming-transition
              ${activeFilters?.difficulty === option?.value
                ? 'bg-primary text-primary-foreground gaming-glow'
                : 'bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground'
              }
            `}
          >
            <Icon 
              name={option?.icon} 
              size={14} 
              color={activeFilters?.difficulty === option?.value ? 'white' : option?.color}
            />
            <span>{option?.label}</span>
          </button>
        ))}
      </div>
      {/* Expanded Filters */}
      {isExpanded && (
        <div className="space-y-4 animate-fade-in">
          {/* Entry Fee Filters */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">Taxa de Entrada</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions?.entryFee?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterClick('entryFee', option?.value)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm gaming-transition
                    ${activeFilters?.entryFee === option?.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground'
                    }
                  `}
                >
                  <Icon name={option?.icon} size={14} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Player Count Filters */}
          <div>
            <h4 className="text-sm font-medium text-card-foreground mb-2">Disponibilidade</h4>
            <div className="flex flex-wrap gap-2">
              {filterOptions?.players?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleFilterClick('players', option?.value)}
                  className={`
                    flex items-center space-x-2 px-3 py-2 rounded-lg text-sm gaming-transition
                    ${activeFilters?.players === option?.value
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-card hover:text-card-foreground'
                    }
                  `}
                >
                  <Icon name={option?.icon} size={14} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LobbyFilters;