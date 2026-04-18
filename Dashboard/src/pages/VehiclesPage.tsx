import React, { useState, useEffect } from 'react';
import { Badge } from '../components/ui/Badge';
import {
  Car,
  Fuel,
  ShieldCheck,
  Activity,
  Truck,
  Accessibility,
  Users2,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { fetchApi } from '../lib/apiClient';

export const VehiclesPage: React.FC = () => {

  const [fleets, setFleets] = useState<any[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const data = await fetchApi('/vehicles');
        if (data && Array.isArray(data)) {
          setFleets(data);
        }
      } catch (error) {
        console.error('Failed to fetch vehicles:', error);
      }
    };
    loadVehicles();
  }, []);

  const getIcon = (iconData: any) => {
    if (typeof iconData === 'function' || typeof iconData === 'object') return iconData;
    switch (iconData) {
      case 'Users2': return Users2;
      case 'Monitor': return Monitor;
      case 'Truck': return Truck;
      case 'Accessibility': return Accessibility;
      default: return Car;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Fleet Intelligence</h1>
          <p className="text-sm text-slate-500 mt-1">Specialized vehicle monitoring across partner network</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="slate" className="h-8 px-4 border border-slate-200">
            System Capacity: {fleets.reduce((acc, g) => acc + (g.vehicles?.length || 0), 0)} Vehicles
          </Badge>
        </div>
      </div>

      <div className="space-y-16">
        {fleets.length > 0 ? (
          fleets.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="border-l-4 border-primary pl-4 py-1">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {group.company}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </h2>
                <p className="text-xs text-slate-500 font-medium">{group.desc}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.vehicles && group.vehicles.map((v: any) => {
                  const IconComponent = getIcon(v.icon);

                  return (
                    <div key={v.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <IconComponent className="h-20 w-20" />
                      </div>

                      <div className="flex justify-between items-start mb-4">
                        <Badge variant={v.status === 'active' ? 'success' : 'danger'}>
                          {v.status ? v.status.toUpperCase() : 'UNKNOWN'}
                        </Badge>
                        <div className="h-10 w-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                          <IconComponent className="h-5 w-5" />
                        </div>
                      </div>

                      <h3 className="font-bold text-slate-800 text-lg mb-1">{v.model}</h3>
                      <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded w-fit mb-6">
                        <ShieldCheck className="h-3.5 w-3.5" /> {v.plate}
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-slate-400">
                              <Fuel className="h-3 w-3" /> Specification
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{v.type}</span>
                          </div>
                          <div className="flex flex-col gap-1 text-right">
                            <div className="flex items-center justify-end gap-1 text-[10px] uppercase font-bold text-slate-400">
                              <Activity className="h-3 w-3" /> Usage
                            </div>
                            <span className="text-sm font-semibold text-slate-700">{v.mileage}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            لا توجد مركبات لعرضها حالياً.
          </div>
        )}
      </div>
    </div>
  );
};