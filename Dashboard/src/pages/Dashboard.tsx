import React, { useState, useEffect } from 'react';
import { Download, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { OverviewCards } from '../features/dashboard/OverviewCards';
import { RevenueChart } from '../features/dashboard/RevenueChart';
import { LiveMap } from '../features/dashboard/LiveMap';
import { useToastStore } from '../store/useToastStore';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { fetchApi } from '../lib/apiClient'; 

export const Dashboard: React.FC = () => {
  const addToast = useToastStore(state => state.addToast);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleExport = async () => {
    addToast('Generating PDF system report...', 'info');
    
    try {
      // Dynamic import to reduce bundle size
      const { jsPDF } = await import('jspdf');
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
      console.error('PDF Export Error:', error);
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
            <button className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-lg shadow-sm border border-primary/20">Today</button>
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <LiveMap />
      </div>
    </div>
  );
};