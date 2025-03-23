
import React from 'react';
import { Link } from 'react-router-dom';
import CreAItiveLogo from './CreAItiveLogo';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-vidsmith-border backdrop-blur-sm bg-vidsmith-darker/70 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <CreAItiveLogo />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
            <Link to="/upload" className="btn-primary">Get Started</Link>
          </nav>
          <button className="block md:hidden text-white">
            <Menu size={24} />
          </button>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="border-t border-vidsmith-border py-6">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} CreAItive. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
