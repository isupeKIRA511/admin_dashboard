import React from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { ToastContainer } from '../components/ui/Toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen relative">
        <TopBar />
        <main className="flex-1 p-8 overflow-auto">
          {children}
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

