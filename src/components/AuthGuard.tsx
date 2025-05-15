
import React, { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectPath?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  requireAuth = true,
  redirectPath = '/login'
}) => {
  const { user, isLoading, hasCompletedTest, checkTestCompletion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) return;

      if (requireAuth && !user) {
        // User is not authenticated but page requires auth
        toast({
          title: "Authentication required",
          description: "Please log in to access this page.",
        });
        navigate(redirectPath, { state: { from: location.pathname } });
        return;
      }

      if (user && !isLoading) {
        // User is authenticated, handle smart routing
        const testTaken = await checkTestCompletion();
        
        // Smart routing based on test completion
        if (location.pathname === '/login' || location.pathname === '/signup') {
          // If logged in, redirect from auth pages
          if (testTaken) {
            navigate('/results');
          } else {
            navigate('/test');
          }
        } else if (location.pathname === '/') {
          // From landing page
          if (testTaken) {
            navigate('/results');
          } else {
            navigate('/test');
          }
        }
      }
    };

    checkAuth();
  }, [user, isLoading, location.pathname, navigate, checkTestCompletion, hasCompletedTest]);

  // Show nothing while checking auth status
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  // If we require auth and there's no user, the useEffect will handle redirection
  if (requireAuth && !user) {
    return null;
  }

  // If we don't want authenticated users (like on login page) and have a user
  if (!requireAuth && user) {
    // Redirection will be handled by useEffect
    return null;
  }

  return <>{children}</>;
};

export default AuthGuard;
