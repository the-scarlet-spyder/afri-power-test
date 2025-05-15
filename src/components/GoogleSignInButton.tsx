
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

interface GoogleSignInButtonProps {
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({ 
  className,
  variant = "outline" 
}) => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={`flex items-center justify-center gap-2 w-full ${className}`}
      onClick={handleGoogleSignIn}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="animate-spin">⏳</span>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="mr-2">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12h10"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2v10"></path>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M22 12h-10"></path>
        </svg>
      )}
      {isLoading ? "Connecting..." : "Sign in with Google"}
    </Button>
  );
};

export default GoogleSignInButton;
