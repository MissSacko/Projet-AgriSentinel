import React, { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WithRole, type UserRole } from '@/guards/withRole';

// Pages
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import ParcellesList from './pages/ParcellesList';
import ParcelleNew from './pages/ParcelleNew';
import ParcelleDetail from './pages/ParcelleDetail';
import RecoltesForm from './pages/RecoltesForm';
import LotsList from './pages/LotsList';
import LotNew from './pages/LotNew';
import LotDetail from './pages/LotDetail';
import PublicLot from './pages/PublicLot';
import Detections from './pages/Detections';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

interface User {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
}

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data (mock authentication)
    const storedUser = localStorage.getItem('agrisentinel_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('agrisentinel_user');
      }
    }
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('agrisentinel_user');
    setUser(null);
  };

  // Add logout function to window for easy access
  useEffect(() => {
    (window as any).logout = logout;
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Index />} />
            <Route path="/auth" element={user ? <Navigate to="/dashboard" /> : <Auth />} />
            <Route path="/v/:lotId" element={<PublicLot />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur', 'coop', 'etat', 'ong', 'cert']} userRole={user.role}>
                    <Dashboard />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* Planteur routes */}
            <Route 
              path="/parcelles" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur', 'coop', 'etat']} userRole={user.role}>
                    <ParcellesList />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            <Route 
              path="/parcelles/new" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur']} userRole={user.role}>
                    <ParcelleNew />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            <Route 
              path="/parcelles/:id" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur', 'coop', 'etat']} userRole={user.role}>
                    <ParcelleDetail />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* Harvest routes */}
            <Route 
              path="/recoltes/:parcelleId" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur']} userRole={user.role}>
                    <RecoltesForm />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* Lot routes */}
            <Route 
              path="/lots" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur', 'coop', 'ong', 'cert']} userRole={user.role}>
                    <LotsList />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            <Route 
              path="/lots/new" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur']} userRole={user.role}>
                    <LotNew />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            <Route 
              path="/lots/:id" 
              element={
                user ? (
                  <WithRole allowedRoles={['planteur', 'coop', 'ong', 'cert']} userRole={user.role}>
                    <LotDetail />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* Detection routes */}
            <Route 
              path="/detections" 
              element={
                user ? (
                  <WithRole allowedRoles={['etat', 'ong', 'cert']} userRole={user.role}>
                    <Detections />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* Admin routes */}
            <Route 
              path="/admin" 
              element={
                user ? (
                  <WithRole allowedRoles={['etat']} userRole={user.role}>
                    <Admin />
                  </WithRole>
                ) : (
                  <Navigate to="/auth" />
                )
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;