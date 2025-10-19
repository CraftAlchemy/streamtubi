import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useApp } from '@/context/AppContext';
import { Toast, ToastClose, ToastDescription, ToastTitle } from '@/components/ui/Toast';

const MainLayout: React.FC = () => {
  const { apiError, clearApiError } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      
      {/* Global API Error Toast */}
      {apiError && (
        <div className="fixed bottom-5 right-5 z-50">
           <Toast variant="destructive">
            <div className="grid gap-1">
              <ToastTitle>An Error Occurred</ToastTitle>
              <ToastDescription>{apiError}</ToastDescription>
            </div>
            <ToastClose onClick={clearApiError} />
          </Toast>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
