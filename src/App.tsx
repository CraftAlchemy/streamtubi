
import React from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from '@/context/AppContext';

// Layout Imports from new location
import MainLayout from '@/pages/_layouts/MainLayout';
import AdminLayout from '@/pages/_layouts/AdminLayout';

// Page Imports from new locations
import HomePage from '@/pages/user/HomePage';
import WatchPage from '@/pages/user/WatchPage';
import LoginPage from '@/pages/LoginPage';
import MyListPage from '@/pages/user/MyListPage';
import SubscriptionPage from '@/pages/user/SubscriptionPage';
import AnalyticsPage from '@/pages/admin/AnalyticsPage';
import VideoManagementPage from '@/pages/admin/VideoManagementPage';
import UserManagementPage from '@/pages/admin/UserManagementPage';


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
              <Route path="/subscribe" element={<SubscriptionPage />} />
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
