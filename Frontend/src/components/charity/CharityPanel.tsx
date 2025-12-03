import { useState } from 'react';
import { CharitySidebar } from './CharitySidebar';
import { CharityDashboard } from './CharityDashboard';
import { VerificationRequests } from './VerificationRequests';
import { ApprovedUsers } from './ApprovedUsers';
import { FreeListings } from './FreeListings';
import { CharityAnalytics } from './CharityAnalytics';

export function CharityPanel() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'requests' | 'approved' | 'listings' | 'analytics'>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <CharityDashboard />;
      case 'requests':
        return <VerificationRequests />;
      case 'approved':
        return <ApprovedUsers />;
      case 'listings':
        return <FreeListings />;
      case 'analytics':
        return <CharityAnalytics />;
      default:
        return <CharityDashboard />;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-57px)] w-full">
      <CharitySidebar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-1 bg-gray-50">
        {renderView()}
      </main>
    </div>
  );
}
