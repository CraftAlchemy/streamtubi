import React from 'react';
import { Button } from './ui/Button';
import { useApp } from '../context/AppContext';

const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useApp();

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark');
    } else if (theme === 'dark') {
      setTheme('system');
    } else {
      setTheme('light');
    }
  };

  const nextTheme = theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light';

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label={`Switch to ${nextTheme} mode`}>
      {theme === 'light' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[1.2rem] w-[1.2rem]">
          <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.106a.75.75 0 0 1 0 1.06l-1.591 1.59a.75.75 0 1 1-1.06-1.061l1.59-1.59a.75.75 0 0 1 1.06 0ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.803 17.803a.75.75 0 0 1-1.06 0l-1.59-1.591a.75.75 0 1 1 1.06-1.06l1.59 1.59a.75.75 0 0 1 0 1.06ZM12 18a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V18.75a.75.75 0 0 1 .75-.75ZM5.197 17.803a.75.75 0 0 1 0-1.06l1.59-1.59a.75.75 0 1 1 1.06 1.06l-1.59 1.591a.75.75 0 0 1-1.06 0ZM3 12a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12ZM6.106 5.106a.75.75 0 0 1 1.06 0l1.59 1.591a.75.75 0 1 1-1.06 1.06l-1.59-1.59a.75.75 0 0 1 0-1.06Z" />
        </svg>
      )}
      {theme === 'dark' && (
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[1.2rem] w-[1.2rem]">
          <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.981A10.503 10.503 0 0 1 18 18a10.5 10.5 0 0 1-10.5-10.5c0-1.25.223-2.45.635-3.572a.75.75 0 0 1 .819-.162Z" clipRule="evenodd" />
        </svg>
      )}
      {theme === 'system' && (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-[1.2rem] w-[1.2rem]">
          <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
          <path fillRule="evenodd" d="M3.087 9l.54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087Zm6.163 3.75A.75.75 0 0 1 10 12h4a.75.75 0 0 1 0 1.5h-4a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" />
        </svg>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};

export default ThemeToggle;
