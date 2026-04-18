import React, { useState, useEffect } from 'react';
import { Badge } from '../../components/ui/Badge';
import { Plane, Search, Calendar, Filter, Loader2 } from 'lucide-react';
import { fetchApi } from '../../lib/apiClient';

export const TripLog: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tripsData, companiesData] = await Promise.all([
          fetchApi('/trips'),
          fetchApi('/companies')
        ]);

        if (tripsData && Array.isArray(tripsData)) setTrips(tripsData);
        if (companiesData && Array.isArray(companiesData)) setCompanies(companiesData);
      } catch (error) {
        console.error('Failed to fetch trip log data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const getCompany = (id: string) => companies.find(c => c.id === id);

  const filteredTrips = trips.filter(trip => {
    const flightMatch = trip.flightNumber ? trip.flightNumber.toLowerCase().includes(search.toLowerCase()) : false;
    const passengerMatch = trip.passengerName ? trip.passengerName.toLowerCase().includes(search.toLowerCase()) : false;
    const matchSearch = flightMatch || passengerMatch;

    const matchCompany = companyFilter ? trip.companyId === companyFilter : true;
    const matchDate = dateFilter ? trip.pickupTime && trip.pickupTime.startsWith(dateFilter) : true;

    return matchSearch && matchCompany && matchDate;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Airport Transfers</h1>
          <p className="text-sm text-slate-500 mt-1">Master log of all platform bookings</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Flight or Passenger..."
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
              value={companyFilter}
              onChange={(e) => setCompanyFilter(e.target.value)}
            >
              <option value="">All Companies</option>
              {companies.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-600"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Flight / ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Passenger</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
                    جاري جلب سجل الرحلات من الخادم...
                  </td>
                </tr>
              ) : filteredTrips.length > 0 ? (
                filteredTrips.map((trip) => {
                  const company = getCompany(trip.companyId);
                  const date = trip.pickupTime ? new Date(trip.pickupTime) : new Date();

                  return (
                    <tr key={trip.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center">
                            <Plane className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="font-bold text-slate-800">{trip.flightNumber || 'N/A'}</div>
                            <div className="text-xs text-slate-400 font-mono">#{trip.id ? trip.id.toString().slice(0, 6).toUpperCase() : 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{trip.passengerName || 'Unknown'}</div>
                        <div className="text-xs text-slate-500">{trip.passengerPhone || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-700 truncate max-w-[150px]">{trip.pickupLocation || 'N/A'}</div>
                        <div className="text-xs text-slate-400 mt-1 truncate max-w-[150px]">→ {trip.dropoffLocation || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">{trip.pickupTime ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</div>
                        <div className="text-xs text-slate-500">{trip.pickupTime ? date.toLocaleDateString() : '--/--/----'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          {company?.name || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            trip.status === 'completed' ? 'success' :
                              trip.status === 'ongoing' ? 'warning' :
                                trip.status === 'canceled' ? 'danger' : 'slate'
                          }
                        >
                          {trip.status ? trip.status.replace('-', ' ') : 'N/A'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="font-bold text-slate-800">${trip.price ? trip.price.toFixed(2) : '0.00'}</div>
                        <div className="text-xs text-slate-400 uppercase">{trip.paymentMethod || 'N/A'}</div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                    لا توجد رحلات مطابقة للفلاتر الحالية.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};