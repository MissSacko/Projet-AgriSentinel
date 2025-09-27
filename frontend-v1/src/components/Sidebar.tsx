import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Map, 
  FileText, 
  Shield, 
  Settings, 
  Satellite,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/App';

const navigation = [
  { name: 'Accueil', href: '/dashboard', icon: Home },
  { name: 'Cartes', href: '/maps', icon: Map },
  { name: 'Rapports', href: '/reports', icon: FileText },
  { name: 'Certifications', href: '/certifications', icon: Shield },
  { name: 'Paramètres', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-agro-green rounded-lg flex items-center justify-center">
            <Satellite className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold agro-green">AgroSentinel</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          
          return (
            <Button
              key={item.name}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-green-50 text-green-700 border-green-200"
              )}
              onClick={() => navigate(item.href)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </div>
  );
}