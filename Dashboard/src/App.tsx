import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { CompaniesPage } from './pages/CompaniesPage';
import { DriversPage } from './pages/DriversPage';
import { VehiclesPage } from './pages/VehiclesPage';
import { TripsPage } from './pages/TripsPage';
import { SettlementsPage } from './pages/SettlementsPage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';
import { CustomersPage } from './pages/CustomersPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<CompaniesPage />} />
                <Route path="/drivers" element={<DriversPage />} />
                <Route path="/customers" element={<CustomersPage />} />
                {/* Other pages can be kept or removed based on needs */}
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/trips" element={<TripsPage />} />
                <Route path="/settlements" element={<SettlementsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
