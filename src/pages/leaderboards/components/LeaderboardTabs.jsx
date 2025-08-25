import React from 'react';
import Button from '../../../components/ui/Button';

const LeaderboardTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'daily', label: 'Diário', icon: 'Calendar' },
    { id: 'weekly', label: 'Semanal', icon: 'CalendarDays' },
    { id: 'monthly', label: 'Mensal', icon: 'CalendarRange' },
    { id: 'all-time', label: 'Todos os Tempos', icon: 'Trophy' }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs?.map((tab) => (
        <Button
          key={tab?.id}
          variant={activeTab === tab?.id ? 'default' : 'outline'}
          onClick={() => onTabChange(tab?.id)}
          iconName={tab?.icon}
          iconPosition="left"
          iconSize={16}
          className="flex-1 sm:flex-none"
        >
          {tab?.label}
        </Button>
      ))}
    </div>
  );
};

export default LeaderboardTabs;