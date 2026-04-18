import React, { useState, useEffect } from 'react';
import { Wallet, Landmark, Receipt, Download, Calendar, ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { fetchApi } from '../../lib/apiClient';

export const FinancialSettlement: React.FC = () => {
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSettlements = async () => {
      try {
        const data = await fetchApi('/api/trips');
        if (data && Array.isArray(data)) {
          const completedTrips = data.filter((t: any) => t.status === 'completed');
          setTrips(completedTrips);
        }
      } catch (error) {
        console.error('Failed to fetch settlement data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSettlements();
  }, []);

  const cashCollected = trips
    .filter(t => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + (t.price || 0), 0);

  const onlinePaymentsHeld = trips
    .filter(t => t.paymentMethod === 'online')
    .reduce((sum, t) => sum + (t.price || 0), 0);

  const totalGmv = cashCollected + onlinePaymentsHeld;
  const platformCommission = totalGmv * 0.15;
  const netBalance = onlinePaymentsHeld - platformCommission;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Financial Settlements</h1>
          <p className="text-sm text-slate-500 mt-1">Track cash collected by drivers vs online payments</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            This Month
          </Button>
          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
          <p className="text-sm font-medium text-slate-500">جاري حساب البيانات المالية من الخادم...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                  <Wallet className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-700">Cash Collected</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">${cashCollected.toFixed(2)}</div>
              <p className="text-sm text-slate-500 mt-2">Held by drivers directly</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-indigo-100 text-indigo-500 rounded-lg flex items-center justify-center">
                  <Landmark className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-700">Online Payments</h3>
              </div>
              <div className="text-3xl font-bold text-slate-800">${onlinePaymentsHeld.toFixed(2)}</div>
              <p className="text-sm text-slate-500 mt-2">Held by platform</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-slate-200 text-slate-700 rounded-lg flex items-center justify-center border border-slate-300">
                  <Receipt className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-slate-700">Net Platform Balance</h3>
              </div>
              <div className={`text-3xl font-bold ${netBalance >= 0 ? 'text-indigo-500' : 'text-rose-600'}`}>
                ${Math.abs(netBalance).toFixed(2)}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {netBalance >= 0 ? 'Platform owes vendors' : 'Vendors owe platform'}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
              <p className="text-sm text-slate-500">Log of all completed trips and payment flows</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-medium">Trip ID</th>
                    <th className="px-6 py-4 font-medium">Method</th>
                    <th className="px-6 py-4 font-medium">Driver</th>
                    <th className="px-6 py-4 font-medium font-medium text-right">Amount</th>
                    <th className="px-6 py-4 font-medium font-medium text-right">Commission</th>
                    <th className="px-6 py-4 font-medium text-right">Flow</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {trips.length > 0 ? trips.slice(0, 5).map(trip => {
                    const comm = (trip.price || 0) * 0.15;
                    return (
                      <tr key={trip.id || Math.random()} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-slate-700">
                          #{trip.id ? trip.id.toString().slice(0, 6).toUpperCase() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {trip.paymentMethod === 'cash' ? (
                            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-emerald-50 text-emerald-700">
                              Cash
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700">
                              Online
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-600">{trip.driverName || 'Unknown Driver'}</td>
                        <td className="px-6 py-4 text-slate-800 font-medium text-right">${(trip.price || 0).toFixed(2)}</td>
                        <td className="px-6 py-4 text-slate-600 text-right">
                          ${comm.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {trip.paymentMethod === 'cash' ? (
                            <div className="flex items-center justify-end gap-1 text-emerald-600 text-xs font-medium">
                              Driver Held <ArrowUpRight className="h-3 w-3" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1 text-indigo-600 text-xs font-medium">
                              Platform Held <ArrowDownRight className="h-3 w-3" />
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                        لا توجد معاملات لعرضها.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};