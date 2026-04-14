import React, { useState, useEffect } from 'react';
import { DollarSign, WalletCards, Building2, Car, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/api';

export const OverviewCards: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    totalGmv: 0,
    totalCommission: 0,
    activeCompaniesCount: 0,
    totalTripsToday: 0
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [tripsData, companiesData] = await Promise.all([
          fetchApi('/api/trips'),
          fetchApi('/api/companies')
        ]);

        let gmv = 0;
        let tripsToday = 0;
        const today = new Date().toISOString().split('T')[0];

        if (tripsData && Array.isArray(tripsData)) {
          gmv = tripsData.reduce((sum, t) => sum + (t.price || 0), 0);
          tripsToday = tripsData.filter(t => t.pickupTime && t.pickupTime.startsWith(today)).length;
        }

        let activeCompanies = 0;
        if (companiesData && Array.isArray(companiesData)) {
          activeCompanies = companiesData.filter(c => c.status === 'active').length;
        }

        setStatsData({
          totalGmv: gmv,
          totalCommission: gmv * 0.15, 
          activeCompaniesCount: activeCompanies,
          totalTripsToday: tripsToday
        });

      } catch (error) {
        console.error('Failed to fetch overview stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const stats = [
    {
      label: 'Total GMV',
      value: `$${statsData.totalGmv.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-indigo-500',
      bg: 'bg-indigo-100',
    },
    {
      label: 'Total Commission',
      value: `$${statsData.totalCommission.toFixed(2)}`,
      icon: WalletCards,
      color: 'text-emerald-600',
      bg: 'bg-emerald-100',
    },
    {
      label: 'Active Companies',
      value: statsData.activeCompaniesCount.toString(),
      icon: Building2,
      color: 'text-amber-600',
      bg: 'bg-amber-100',
    },
    {
      label: 'Trips Today',
      value: statsData.totalTripsToday.toString(),
      icon: Car,
      color: 'text-rose-600',
      bg: 'bg-rose-100',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center h-[120px]">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-2xl font-bold tracking-tight text-slate-800 mt-1">{stat.value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};