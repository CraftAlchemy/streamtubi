
import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import ThemeToggle from '@/components/ThemeToggle';
import { Button } from '@/components/ui/Button';

const Header: React.FC = () => {
  const { isAuthenticated, isAdmin, currentUser, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isFreeUser = isAuthenticated && !isAdmin && currentUser?.subscriptionPlan === 'Free';

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center px-4 sm:px-8 md:px-16">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-brand-red">
            <path d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3h-15Zm-1.5 3a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5-1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-9Z" />
            <path d="M8.25 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Z" />
            <path d="M12 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Z" />
            <path d="M15.75 8.25a.75.75 0 0 0-1.5 0v7.5a.75.75 0 0 0 1.5 0v-7.5Z" />
          </svg>
          <span className="font-bold">StreamTubi</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <NavLink to="/" className={navLinkClass}>Home</NavLink>
          {isAuthenticated && <NavLink to="/mylist" className={navLinkClass}>My List</NavLink>}
          {isAdmin && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
           {isFreeUser && (
            <Link to="/subscribe">
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black">Go Premium</Button>
            </Link>
          )}
          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>Logout</Button>
          ) : (
             <Link to="/login">
                <Button variant="ghost" size="sm">Login</Button>
             </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;