import React, { useState, useEffect } from 'react';
import { Download, Calendar, Bell, TrendingUp, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OverviewCards } from '../features/dashboard/OverviewCards';
import { RevenueChart } from '../features/dashboard/RevenueChart';
import { LiveMap } from '../features/dashboard/LiveMap';
import { useToastStore } from '../store/useToastStore';
import { jsPDF } from 'jspdf';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchApi } from '../lib/api'; 


export const Dashboard: React.FC = () => {
  const addToast = useToastStore(state => state.addToast);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [alerts, setAlerts] = useState<any[]>([
    { title: "System Initialized", time: "10:00 AM", desc: "All core services are running optimally.", color: "text-emerald-500", bg: "bg-emerald-100", icon: AlertCircle },
    { title: "New Drivers Available", time: "11:30 AM", desc: "Drivers have been onboarded.", color: "text-blue-500", bg: "bg-blue-100", icon: AlertCircle },
    { title: "High Demand", time: "01:00 PM", desc: "High passenger demand detected.", color: "text-amber-500", bg: "bg-amber-100", icon: AlertCircle }
  ]);

  const handleExport = () => {
    addToast('Generating PDF system report...', 'info');
    
    try {
      const doc = new jsPDF();
      doc.setFontSize(22);
      doc.text('TransPay Dashboard Report', 20, 20);
      doc.setFontSize(12);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      doc.text(`Period: ${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`, 20, 40);
      
      doc.text('Operational Stats:', 20, 60);
      doc.text('- Active Vendors: 12', 30, 70);
      doc.text('- Total Trips: 1,245', 30, 80);
      doc.text('- Total GMV: $45,280.00', 30, 90);
      
      doc.save('transpay-system-report.pdf');
      addToast('Report generated successfully! Check your downloads.', 'success');
    } catch (error) {
      addToast('Failed to generate PDF. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-visible z-50">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Overview</h1>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-time performance metrics and insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
            <button className="px-4 py-1.5 text-xs font-semibold bg-white text-indigo-600 rounded-lg shadow-sm border border-slate-100">Today</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">7 Days</button>
            <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">30 Days</button>
          </div>
          
          <div className="relative">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 h-9 text-xs font-bold border-slate-200"
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <Calendar className="h-4 w-4" /> 
              {startDate ? `${startDate.toLocaleDateString()} - ${endDate?.toLocaleDateString() || '...'}` : 'Select Dates'}
            </Button>
            
            {isCalendarOpen && (
              <div className="absolute top-full mt-2 right-0 shadow-2xl border border-slate-200 rounded-2xl bg-white p-2 z-[60]">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => {
                    setDateRange(update);
                    if (update[1]) setIsCalendarOpen(false);
                  }}
                  inline
                />
              </div>
            )}
          </div>

          <Button 
            variant="secondary" 
            size="sm" 
            className="gap-2 h-9 text-xs font-bold"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      <OverviewCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RevenueChart />
          <LiveMap />
        </div>
        
        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Bell className="h-4 w-4 text-indigo-500" />
                Live Alerts
              </h3>
              <span className="text-[10px] font-bold bg-indigo-500 text-white px-2 py-0.5 rounded-full">{alerts.length} NEW</span>
            </div>
            <div className="divide-y divide-slate-50">
              {alerts.length > 0 ? alerts.map((item, i) => {
                const IconComponent = item.icon || AlertCircle;
                return (
                  <div key={i} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className="flex gap-4">
                      <div className={`h-10 w-10 rounded-xl ${item.bg || 'bg-slate-100'} flex items-center justify-center shrink-0`}>
                        <IconComponent className={`h-5 w-5 ${item.color || 'text-slate-500'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between mb-0.5">
                          <p className="text-sm font-bold text-slate-800 truncate">{item.title}</p>
                          <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-1">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="p-8 text-center text-slate-500 text-sm">
                  لا توجد تنبيهات حالياً
                </div>
              )}
            </div>
            <div className="p-3 bg-slate-50/50 text-center border-t border-slate-100">
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest">View All Notifications</button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <TrendingUp className="h-24 w-24" />
            </div>
            <h4 className="text-sm font-medium text-indigo-100 mb-1">Growth Metric</h4>
            <div className="text-3xl font-bold mb-4">+24.5% <span className="text-xs font-normal text-indigo-200 block">vs last month</span></div>
            <p className="text-xs text-indigo-100 leading-relaxed opacity-80">
              Your platform volume is increasing steadily. Consider adjusting commission rates for top-performing vendors.
            </p>
            <Button variant="secondary" className="w-full mt-6 bg-white/20 hover:bg-white/30 border-none text-white font-bold h-10 shadow-none backdrop-blur-md">
              Optimize Performance
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};