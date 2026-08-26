'use client';

import React, { createContext, useContext, useState } from 'react';
import { TabType } from '@/types';

interface AppStateContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isSimulatingCall: boolean;
  toggleCallSimulation: () => void;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  activeLocale: string;
  setActiveLocale: (locale: string) => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSimulatingCall, setIsSimulatingCall] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('Aveon Urban');
  const [activeLocale, setActiveLocale] = useState<string>('hi-IN-Hinglish');

  const toggleCallSimulation = () => {
    setIsSimulatingCall((prev) => !prev);
  };

  return (
    <AppStateContext.Provider
      value={{
        activeTab,
        setActiveTab,
        isSimulatingCall,
        toggleCallSimulation,
        selectedModel,
        setSelectedModel,
        activeLocale,
        setActiveLocale,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
