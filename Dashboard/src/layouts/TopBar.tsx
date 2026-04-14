import React from 'react';
import { Bell, Search, Menu } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10 w-full z-50">
      <div className="flex items-center gap-4">
        <button className="lg:hidden text-slate-500 hover:text-slate-700">
          <Menu className="h-6 w-6" />
        </button>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search flights, companies..."
            className="pl-10 pr-4 py-2 w-80 rounded-full bg-slate-50 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm text-slate-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 rounded-full border border-white"></span>
        </button>
      </div>
    </header>
  );
};
