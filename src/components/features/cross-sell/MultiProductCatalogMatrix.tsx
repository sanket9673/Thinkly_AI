'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Sliders, Sparkles, User, Car, BatteryCharging, Info } from 'lucide-react';

export interface CarModel {
  id: string;
  name: string;
  type: string;
  price: string;
  range: string;
  seating: string;
  audience: string;
  badge: string;
  badgeVariant: 'violet' | 'emerald' | 'amber';
  valueProps: string[];
}

interface MultiProductCatalogMatrixProps {
  cars: CarModel[];
  onUpdateCar: (id: string, updatedFields: Partial<CarModel>) => void;
}

export const MultiProductCatalogMatrix: React.FC<MultiProductCatalogMatrixProps> = ({
  cars,
  onUpdateCar,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Car className="h-5 w-5 text-emerald-400" />
            Dynamic Dealership Inventory Matrix
          </h3>
          <p className="text-xs text-zinc-400">
            Edit specifications and price points in real-time. Changes are dynamically compiled into the simulator prompts.
          </p>
        </div>
        <Badge variant="outline" className="bg-zinc-950/40 border-zinc-800 text-zinc-400 font-mono text-[10px]">
          Target Model: Aveon E1
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cars.map((car) => {
          const isHero = car.id === 'aveon-e1';

          return (
            <Card
              key={car.id}
              glowing={isHero}
              className={`flex flex-col justify-between transition-all duration-200 border-zinc-800 bg-zinc-900/10 ${
                isHero ? 'border-violet-500/30 shadow-violet-950/20 shadow-xl' : 'hover:border-zinc-700'
              }`}
            >
              <CardHeader className="pb-3.5 relative">
                {isHero && (
                  <div className="absolute top-4 right-4 animate-pulse">
                    <Sparkles className="h-4 w-4 text-violet-400 fill-violet-400" />
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge variant={car.badgeVariant} className="text-[10px] uppercase font-mono tracking-wider font-bold">
                    {car.badge}
                  </Badge>
                  {isHero && (
                    <Badge variant="zinc" className="text-[10px] bg-violet-500/10 border-violet-500/30 text-violet-400 uppercase font-mono">
                      Primary Hero
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg mt-3 flex items-center gap-2">
                  {car.name}
                </CardTitle>
                <CardDescription className="text-xs">{car.type}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {/* Spec inputs */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Price Range</label>
                    <input
                      type="text"
                      value={car.price}
                      onChange={(e) => onUpdateCar(car.id, { price: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-emerald-400 focus:border-zinc-750 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Certified Range</label>
                    <input
                      type="text"
                      value={car.range}
                      onChange={(e) => onUpdateCar(car.id, { range: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 font-mono text-xs text-violet-400 focus:border-zinc-750 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Seating & Layout</label>
                    <input
                      type="text"
                      value={car.seating}
                      onChange={(e) => onUpdateCar(car.id, { seating: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-zinc-750 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Target Demographic</label>
                    <input
                      type="text"
                      value={car.audience}
                      onChange={(e) => onUpdateCar(car.id, { audience: e.target.value })}
                      className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs text-zinc-300 focus:border-zinc-750 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Key value props list */}
                <div className="rounded-lg bg-zinc-950/50 border border-zinc-800/80 p-3 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider block">Key Value Props</span>
                  <div className="space-y-1">
                    {car.valueProps.map((prop, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                        <span>{prop}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {/* Help info footer */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-3.5 flex items-start gap-2.5 text-xs text-zinc-400">
        <Info className="h-4.5 w-4.5 text-zinc-400 shrink-0 mt-0.5" />
        <div>
          Updating specs directly changes the context parameters fed to the voice dialogue generation model. When a client dealership switches car specs, the cross-selling scripts pivot their math models dynamically (e.g. comparing the price gap between E1 and Urban).
        </div>
      </div>
    </div>
  );
};
export default MultiProductCatalogMatrix;
