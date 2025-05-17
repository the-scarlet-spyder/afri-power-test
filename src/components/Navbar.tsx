
import React from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

// Admin emails that can see the admin link
const ADMIN_EMAILS = ['adrian.m.adepoju@gmail.com']; // Make sure this matches the one in AuthGuard.tsx

const Navbar = () => {
  const { user } = useAuth();
  const isAdmin = user && ADMIN_EMAILS.includes(user.email);

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="inuka-container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo size="medium" />
        </Link>
        <div className="flex items-center gap-4">
          {user && isAdmin && (
            <Link to="/admin" className="text-inuka-terracotta hover:text-inuka-crimson font-medium">
              Admin Dashboard
            </Link>
          )}
          {user ? (
            <Link to="/profile">
              <Button 
                variant="outline"
                className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson/10"
              >
                My Profile
              </Button>
            </Link>
          ) : (
            <Link to="/signup">
              <Button 
                className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-5 px-6 rounded-md shadow-sm transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
              >
                Get Started
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
