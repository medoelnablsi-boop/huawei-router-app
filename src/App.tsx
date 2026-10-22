import { useState, useEffect } from 'react';
import { RouterProvider, useRouter } from '@/context/RouterContext';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Dashboard } from '@/pages/Dashboard';
import { Frequencies } from '@/pages/Frequencies';
import { Devices } from '@/pages/Devices';
import { NetworkSettings } from '@/pages/NetworkSettings';
import { GuestNetwork } from '@/pages/GuestNetwork';
import { Login } from '@/pages/Login';
import type { Page } from '@/types';

function AppContent() {
  const { credentials, setCredentials, setAuth, token, refreshStatus } = useRouter();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogin = (
    routerIP: string,
    username: string,
    password: string,
    authToken: string,
    authCookie: string
  ) => {
    setCredentials({ routerIP, username, password });
    setAuth(authToken, authCookie);
  };

  useEffect(() => {
    if (credentials && token) {
      refreshStatus().catch(() => {
        // Status fetch failure is non-fatal — dashboard shows last known state
      });
    }
  }, [credentials, token, refreshStatus]);

  if (!credentials) {
    return <Login onLogin={handleLogin} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />;
      case 'frequencies':
        return <Frequencies />;
      case 'devices':
        return <Devices />;
      case 'network':
        return <NetworkSettings />;
      case 'guest':
        return <GuestNetwork />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" dir="rtl">
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="lg:mr-72">
        <Topbar currentPage={currentPage} onMenuClick={() => setSidebarOpen(true)} />
        <main className="px-5 py-6 lg:px-8">{renderPage()}</main>
      </div>
    </div>
  );
}

function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}

export default App;
