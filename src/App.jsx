import React, { useEffect } from 'react';
import { AppProvider, useApp } from './contexts/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import BillList from './components/BillList';
import CalendarView from './components/CalendarView';
import AccountManager from './components/AccountManager';
import { notifications } from './utils/notifications';

const AppContent = () => {
  const { currentView, deleteBill } = useApp();

  // Handle delete bill event from BillList
  useEffect(() => {
    const handleDeleteBill = (event) => {
      deleteBill(event.detail);
    };

    window.addEventListener('deleteBill', handleDeleteBill);
    return () => window.removeEventListener('deleteBill', handleDeleteBill);
  }, [deleteBill]);

  // Request notification permission on mount
  useEffect(() => {
    notifications.requestPermission();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'bills':
        return <BillList />;
      case 'calendar':
        return <CalendarView />;
      case 'accounts':
        return <AccountManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Prism Bills - A tribute to the original Prism app 💜
          </p>
          <p className="text-center text-xs text-gray-400 mt-1">
            Your data is stored locally in your browser
          </p>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
