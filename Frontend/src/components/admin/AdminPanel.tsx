import { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Dashboard } from './Dashboard';
import { ListingsView } from './ListingsView';
import { UsersView } from './UsersView';
import { VendorsView } from './VendorsView';
import { OrdersView } from './OrdersView';
import { MapView } from './MapView';
import { ModerationView } from './ModerationView';

export function AdminPanel() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'listings' | 'users' | 'vendors' | 'orders' | 'map' | 'moderation'>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'listings':
        return <ListingsView />;
      case 'users':
        return <UsersView />;
      case 'vendors':
        return <VendorsView />;
      case 'orders':
        return <OrdersView />;
      case 'map':
        return <MapView />;
      case 'moderation':
        return <ModerationView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] w-full">
      <AdminSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 bg-gray-50">
        {renderView()}
      </main>
    </div>
  );
}
