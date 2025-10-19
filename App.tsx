
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import WatchPage from './pages/WatchPage';
import LoginPage from './pages/LoginPage';
import MyListPage from './pages/MyListPage';
import SubscriptionPage from './pages/SubscriptionPage'; // New Import

// New Admin Imports
import AdminLayout from './pages/admin/AdminLayout';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import VideoManagementPage from './pages/admin/VideoManagementPage';
import UserManagementPage from './pages/admin/UserManagementPage';


const PrivateRoute: React.FC<{ adminOnly?: boolean }> = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useApp();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const MainLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/watch/:id" element={<WatchPage />} />
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<PrivateRoute />}>
              <Route path="/mylist" element={<MyListPage />} />
              <Route path="/subscribe" element={<SubscriptionPage />} /> {/* New Route */}
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
          
          {/* Admin Routes */}
          <Route element={<PrivateRoute adminOnly={true} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="analytics" replace />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="videos" element={<VideoManagementPage />} />
              <Route path="users" element={<UserManagementPage />} />
            </Route>
          </Route>

        </Routes>
      </HashRouter>
    </AppProvider>
  );
};

export default App;
