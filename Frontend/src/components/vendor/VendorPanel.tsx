import { useState } from 'react';
import { VendorSidebar } from './VendorSidebar';
import { VendorDashboard } from './VendorDashboard';
import { MyListings } from './MyListings';
import { CreateListing } from './CreateListing';
import { VendorAnalytics } from './VendorAnalytics';
import { VendorOrders } from './VendorOrders';
import { CustomerReports } from './CustomerReports';
import { CorporateControl } from './CorporateControl';

export function VendorPanel() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'orders' | 'listings' | 'create' | 'analytics' | 'reports' | 'corporate'>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <VendorDashboard />;
      case 'orders':
        return <VendorOrders />;
      case 'listings':
        return <MyListings />;
      case 'create':
        return <CreateListing />;
      case 'analytics':
        return <VendorAnalytics />;
      case 'reports':
        return <CustomerReports />;
      case 'corporate':
        return <CorporateControl />;
      default:
        return <VendorDashboard />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] w-full">
      <VendorSidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 bg-gray-50">
        {renderView()}
      </main>
    </div>
  );
}