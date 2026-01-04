
import React from 'react';

interface NavigationProps {
  activeTab: 'dashboard' | 'schedule' | 'pharmacy' | 'history' | 'prescriptions' | 'ai-doctor';
  setActiveTab: (tab: 'dashboard' | 'schedule' | 'pharmacy' | 'history' | 'prescriptions' | 'ai-doctor') => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'schedule', label: 'Schedule', icon: '🕒' },
    { id: 'ai-doctor', label: 'AI Doctor', icon: '🩺' },
    { id: 'prescriptions', label: 'Rx Vault', icon: '📂' },
    { id: 'pharmacy', label: 'Pharmacy', icon: '📍' },
    { id: 'history', label: 'History', icon: '📝' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-1 py-2 flex justify-around items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as any)}
          className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all flex-1 ${
            activeTab === tab.id ? 'text-blue-600 scale-105' : 'text-slate-400'
          }`}
        >
          <span className="text-xl mb-1">{tab.icon}</span>
          <span className="text-[9px] font-black uppercase tracking-tighter truncate w-full text-center">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
