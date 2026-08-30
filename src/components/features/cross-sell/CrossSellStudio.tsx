'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, Car, Mic, Terminal } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { MultiProductCatalogMatrix, CarModel } from './MultiProductCatalogMatrix';
import { DecisionTreeVisualizer } from './DecisionTreeVisualizer';
import { ObjectionSimulator } from './ObjectionSimulator';
import { CrossSellPromptInspector } from './CrossSellPromptInspector';

export const CrossSellStudio: React.FC = () => {
  const [subTab, setSubTab] = useState<'inventory' | 'playground' | 'prompt'>('playground');
  
  // Shared inventory state
  const [cars, setCars] = useState<CarModel[]>([
    {
      id: 'aveon-e1',
      name: 'Aveon E1',
      type: 'Premium SUV (Primary Hero)',
      price: '₹18.99L - ₹24.99L',
      range: '480 km',
      seating: '5-Seater SUV Layout',
      audience: 'Tech-forward urban families',
      badge: 'Primary Hero',
      badgeVariant: 'violet',
      valueProps: ['Zero battery maintenance', 'Running cost of ₹1.20/km', 'Panoramic glass roof']
    },
    {
      id: 'aveon-urban',
      name: 'Aveon Urban',
      type: 'Budget Compact Hatchback',
      price: '₹11.49L - ₹14.29L',
      range: '315 km',
      seating: '4-Seater Compact',
      audience: 'Budget-conscious daily commuters',
      badge: 'Budget Pivot',
      badgeVariant: 'emerald',
      valueProps: ['Fits tight parking spaces', 'Regenerative urban braking', 'Low down payment options']
    },
    {
      id: 'aveon-max',
      name: 'Aveon Max',
      type: 'Premium 7-Seater family SUV',
      price: '₹26.50L - ₹31.00L',
      range: '520 km',
      seating: '7-Seater 3-Row Layout',
      audience: 'Large joint families & long distance travels',
      badge: 'Size Pivot',
      badgeVariant: 'amber',
      valueProps: ['Active All-Wheel Drive', 'Fast charge 10-80% in 35 mins', 'Captain seats with ventilation']
    }
  ]);

  // Shared simulator tracking states for flowchart highlight
  const [activeState, setActiveState] = useState<'idle' | 'reframe' | 'pivot' | 'hold'>('idle');
  const [objectionType, setObjectionType] = useState<'budget' | 'size' | 'feature' | null>(null);
  const [reframeCount, setReframeCount] = useState(0);

  const handleUpdateCar = (id: string, updatedFields: Partial<CarModel>) => {
    setCars(prev => prev.map(car => car.id === id ? { ...car, ...updatedFields } : car));
  };

  const handleStateUpdate = (
    state: 'idle' | 'reframe' | 'pivot' | 'hold',
    type: 'budget' | 'size' | 'feature' | null,
    count: number
  ) => {
    setActiveState(state);
    setObjectionType(type);
    setReframeCount(count);
  };

  return (
    <div className="space-y-8">
      {/* Sub Tabs Navigation Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <GitCompare className="h-6 w-6 text-emerald-400" />
            Multi-Product Cross-Selling Studio
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Part 1: Solving Problem 3 (Objection Classification, Reframing Constraints, & Catalog Pivots).
          </p>
        </div>

        {/* Sub Navigation Tabs */}
        <div className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 p-1">
          <button
            onClick={() => setSubTab('inventory')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'inventory' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'inventory' && (
              <motion.div
                layoutId="crossSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Car className="h-3.5 w-3.5" />
              🚗 Inventory
            </span>
          </button>
          
          <button
            onClick={() => setSubTab('playground')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'playground' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'playground' && (
              <motion.div
                layoutId="crossSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Mic className="h-3.5 w-3.5" />
              🤖 Objection Playground
            </span>
          </button>

          <button
            onClick={() => setSubTab('prompt')}
            className={`relative rounded-md px-3.5 py-2 text-xs font-semibold transition-all ${
              subTab === 'prompt' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            {subTab === 'prompt' && (
              <motion.div
                layoutId="crossSubTabPill"
                className="absolute inset-0 rounded-md bg-zinc-800 shadow border border-zinc-700/50"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-1">
              <Terminal className="h-3.5 w-3.5" />
              📜 Prompt Rules
            </span>
          </button>
        </div>
      </div>

      {/* Rendering tab contents */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {subTab === 'inventory' ? (
            <motion.div
              key="inventory-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
            >
              <MultiProductCatalogMatrix cars={cars} onUpdateCar={handleUpdateCar} />
            </motion.div>
          ) : subTab === 'playground' ? (
            <motion.div
              key="playground-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
              className="space-y-10"
            >
              {/* Objection Simulator */}
              <ObjectionSimulator cars={cars} onStateUpdate={handleStateUpdate} />
              
              {/* Decision Flowchart Visualizer */}
              <div className="border-t border-zinc-900 pt-8">
                <DecisionTreeVisualizer 
                  activeState={activeState} 
                  objectionType={objectionType} 
                  reframeCount={reframeCount} 
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="prompt-tab"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.18 }}
            >
              <CrossSellPromptInspector />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
export default CrossSellStudio;
