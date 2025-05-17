
import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkUserHasValidCode } from '@/lib/access-code-service';
import { Skeleton } from "@/components/ui/skeleton";

interface AccessCodeGuardProps {
  children: React.ReactNode;
  redirectPath?: string;
}

const AccessCodeGuard = ({
  children,
  redirectPath = '/access-code',
}: AccessCodeGuardProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [hasValidCode, setHasValidCode] = useState(false);
  
  useEffect(() => {
    const checkAccessCode = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      
      try {
        const hasCode = await checkUserHasValidCode(user.id);
        setHasValidCode(hasCode);
      } catch (error) {
        console.error("Error checking access code:", error);
        setHasValidCode(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAccessCode();
  }, [user]);
  
  // Show loading state while checking access code
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 w-full max-w-md mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If no user or no valid code, redirect to the access code entry page
  if (!hasValidCode) {
    return <Navigate to={redirectPath} state={{ from: location.pathname }} replace />;
  }

  // Has valid code, render children
  return <>{children}</>;
};

export default AccessCodeGuard;
