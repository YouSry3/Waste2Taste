import { useState } from 'react';
import { SidebarProvider } from './components/ui/sidebar';
import { Button } from './components/ui/button';
import { Shield, Store, Heart, LogOut } from 'lucide-react';
import { AdminPanel } from './components/admin/AdminPanel';
import { VendorPanel } from './components/vendor/VendorPanel';
import { CharityPanel } from './components/charity/CharityPanel';
import { LoginPage } from './components/auth/LoginPage';

type PanelType = 'admin' | 'vendor' | 'charity';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPanel, setCurrentPanel] = useState<PanelType | null>(null);

  const handleLogin = (panelType: PanelType) => {
    setCurrentPanel(panelType);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPanel(null);
  };

  // Show login page if not authenticated
  if (!isAuthenticated || !currentPanel) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Panel Switcher */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center">
              <Store className="h-5 w-5 text-white" />
            </div>
            <h2>Food Rescue Platform</h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant={currentPanel === 'admin' ? 'default' : 'outline'}
                onClick={() => setCurrentPanel('admin')}
                size="sm"
              >
                <Shield className="h-4 w-4 mr-2" />
                Moderation
              </Button>
              <Button
                variant={currentPanel === 'vendor' ? 'default' : 'outline'}
                onClick={() => setCurrentPanel('vendor')}
                size="sm"
              >
                <Store className="h-4 w-4 mr-2" />
                Corporate
              </Button>
              <Button
                variant={currentPanel === 'charity' ? 'default' : 'outline'}
                onClick={() => setCurrentPanel('charity')}
                size="sm"
              >
                <Heart className="h-4 w-4 mr-2" />
                Charity
              </Button>
            </div>
            <div className="h-6 w-px bg-gray-300 mx-2" />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <SidebarProvider>
        {currentPanel === 'admin' && <AdminPanel />}
        {currentPanel === 'vendor' && <VendorPanel />}
        {currentPanel === 'charity' && <CharityPanel />}
      </SidebarProvider>
    </div>
  );
}