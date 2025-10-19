
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto py-6 px-4 sm:px-8 md:px-16 text-center text-muted-foreground">
        <p className="text-sm">&copy; {new Date().getFullYear()} StreamTubi. All Rights Reserved. A demo app.</p>
      </div>
    </footer>
  );
};

export default Footer;