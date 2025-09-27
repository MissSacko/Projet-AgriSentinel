import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, createContext, useContext } from 'react';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Maps from './pages/Maps';
import Reports from './pages/Reports';
import Certifications from './pages/Certifications';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

// Auth Context pour simuler l'authentification
interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; organization: string } | null;
  login: (email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

const App = () => {
  // Pour les tests et démo, on peut commencer authentifié
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; organization: string } | null>({
    name: 'Jean Dupont',
    email: 'demo@agrosentinel.com',
    organization: 'AgriCorp France'
  });

  const login = (email: string, password: string) => {
    // Simulation d'authentification
    setIsAuthenticated(true);
    setUser({
      name: 'Jean Dupont',
      email: email,
      organization: 'AgriCorp France'
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
        <TooltipProvider>
          <Toaster />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/certifications" element={<Certifications />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthContext.Provider>
    </QueryClientProvider>
  );
};

export default App;