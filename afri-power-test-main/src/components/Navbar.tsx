
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="inuka-container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="medium" />
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/signup">
            <Button 
              className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-5 px-6 rounded-md shadow-sm transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
            >
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
