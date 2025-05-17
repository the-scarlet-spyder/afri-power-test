
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { verifyAccessCode } from '@/lib/access-code-service';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2 } from 'lucide-react';

const formatAccessCode = (code: string): string => {
  const cleaned = code.replace(/\D/g, '').substring(0, 8);
  return cleaned;
};

const AccessCode = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedCode = formatAccessCode(e.target.value);
    setAccessCode(formattedCode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.id) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to verify an access code.",
        variant: "destructive",
      });
      return;
    }
    
    if (accessCode.length !== 8) {
      toast({
        title: "Invalid Code Format",
        description: "Please enter a valid 8-digit access code.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await verifyAccessCode(accessCode, user.id);
      
      if (result.success) {
        toast({
          title: "Access Granted",
          description: "Begin Your Strength Discovery",
          className: "bg-green-50 border-green-200",
        });
        
        // Redirect to test page
        navigate('/test');
      } else {
        toast({
          title: "Invalid Code",
          description: result.message || "The access code is invalid or already used.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error('Error verifying code:', error);
      toast({
        title: "Verification Error",
        description: error.message || "Failed to verify access code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="border-inuka-crimson/20 shadow-lg">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-bold text-inuka-crimson">
                Enter Access Code
              </CardTitle>
              <CardDescription>
                Please enter your 8-digit access code to continue to the Strength Discovery Test
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="accessCode" className="text-sm font-medium text-gray-700 block">
                    Access Code
                  </label>
                  <Input
                    id="accessCode"
                    type="text"
                    inputMode="numeric"
                    value={accessCode}
                    onChange={handleCodeChange}
                    className="text-center text-lg tracking-widest"
                    placeholder="Enter 8-digit code"
                    maxLength={8}
                    autoComplete="off"
                  />
                  <p className="text-xs text-gray-500">
                    Enter the 8-digit code provided by Strengths Africa.
                  </p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-inuka-crimson hover:bg-inuka-crimson/90"
                  disabled={isSubmitting || accessCode.length !== 8}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="justify-center text-center text-sm text-gray-600 pt-0">
              <p>
                Don't have an access code? Contact the Strengths Africa team.
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessCode;
