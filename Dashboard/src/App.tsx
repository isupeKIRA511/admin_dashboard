import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { MainLayout } from './layouts/MainLayout';
import { LoginPage } from './pages/LoginPage';

// Lazy-load pages to reduce initial bundle size
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage').then(m => ({ default: m.CompaniesPage })));
const CustomersPage = lazy(() => import('./pages/CustomersPage').then(m => ({ default: m.CustomersPage })));
const DriversPage = lazy(() => import('./pages/DriversPage').then(m => ({ default: m.DriversPage })));
const SettlementsPage = lazy(() => import('./pages/SettlementsPage').then(m => ({ default: m.SettlementsPage })));
const BookingsPage = lazy(() => import('./pages/BookingsPage').then(m => ({ default: m.BookingsPage })));
const DriverRegisterPage = lazy(() => import('./pages/DriverRegisterPage'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-full min-h-[300px]">
    <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = sessionStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        {/* Public driver registration (OTP -> verify -> register) */}
        <Route path="/driver-register" element={<Suspense fallback={<PageLoader />}><DriverRegisterPage /></Suspense>} />

        <Route path="/*" element={
          <ProtectedRoute>
            <MainLayout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/companies" element={<CompaniesPage />} />
                  <Route path="/drivers" element={<DriversPage />} />
                  <Route path="/customers" element={<CustomersPage />} />
                  <Route path="/bookings" element={<BookingsPage />} />
                  <Route path="/settlements" element={<SettlementsPage />} />
                </Routes>
              </Suspense>
            </MainLayout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
