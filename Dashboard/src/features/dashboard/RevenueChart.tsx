import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import { getDashboardChart, type ActivityPoint } from '../../services/dashboardService';
import { logError } from '../../lib/logger';

export const RevenueChart: React.FC = () => {
  const [data, setData] = useState<ActivityPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    const loadChartData = async () => {
      try {
        const chartData = await getDashboardChart();
        if (isActive && chartData && Array.isArray(chartData)) {
          setData(chartData);
        }
      } catch (error) {
        logError('Failed to fetch chart data', error);
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    void loadChartData();
    return () => { isActive = false; };
  }, []);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-96">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800">Booking Activity</h3>
        <p className="text-sm text-slate-500">Airport booking volume over the last 7 days.</p>
      </div>
      <div className="h-72">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
            <span className="text-sm text-slate-500">جاري تحميل بيانات المخطط البياني...</span>
          </div>
        ) : data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FAC445" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FAC445" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#1e293b', fontSize: '14px', fontWeight: 500 }}
              />
              <Area type="monotone" dataKey="bookings" stroke="#FAC445" fillOpacity={1} fill="url(#colorBookings)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-slate-500">
            لا توجد بيانات كافية لرسم المخطط البياني.
          </div>
        )}
      </div>
    </div>
  );
};
