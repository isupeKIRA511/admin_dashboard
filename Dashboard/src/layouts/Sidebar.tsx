import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  PlaneTakeoff,
  Coins,
  Users,
  Car,
  Settings
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Drivers', path: '/drivers', icon: Car },
    { name: 'Companies', path: '/companies', icon: Building2 },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'Trips Log', path: '/trips', icon: Coins },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];


  return (
    <aside className="w-64 bg-white h-screen fixed top-0 left-0 flex flex-col border-r border-slate-200 z-40">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-2xl font-black font-sans text-slate-800 tracking-tight flex items-center gap-2">
          <PlaneTakeoff className="h-6 w-6 text-primary" />
          TransPay
        </h1>
        <p className="text-slate-400 text-[10px] uppercase font-bold tracking-widest mt-1">Infrastructure Control</p>
      </div>

      <nav className="flex-1 py-6 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                ? 'bg-primary/10 text-slate-900 border border-primary/20 font-bold'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
              }`
            }
          >
            <link.icon className="h-5 w-5" />
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
            <span className="text-sm font-semibold text-slate-700">AD</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Admin User</p>
            <p className="text-xs text-slate-500">admin@transpay.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
