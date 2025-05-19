
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { KeyRound } from 'lucide-react';

const AccessCodeVerification = () => {
  const [accessCode, setAccessCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const verifyAccessCode = async () => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to verify an access code.",
        variant: "destructive",
      });
      return;
    }

    if (!accessCode || accessCode.trim().length !== 8) {
      toast({
        title: "Invalid Code Format",
        description: "Please enter a valid 8-digit access code.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Using the verify_access_code function to validate the code
      const { data, error } = await supabase.rpc('verify_access_code', {
        _code: accessCode.trim(),
        _user_id: user.id
      });

      if (error) {
        throw error;
      }

      if (data && data.success) {
        toast({
          title: "Success!",
          description: "Your access code has been verified.",
        });
        
        // Force a small delay before navigation to ensure the toast is visible
        setTimeout(() => {
          console.log("Redirecting to /test after successful verification");
          navigate('/test');
        }, 500);
      } else {
        toast({
          title: "Invalid Code",
          description: data?.message || "Invalid or already used code.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error verifying access code:", error);
      toast({
        title: "Verification Failed",
        description: error.message || "An error occurred while verifying your access code.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-inuka-crimson/10 rounded-full flex items-center justify-center">
            <KeyRound className="h-9 w-9 text-inuka-crimson" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center">Enter Access Code</CardTitle>
        <CardDescription className="text-center">
          Please enter the 8-digit code you received to access the Strength Africa assessment.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessCode">Access Code</Label>
          <Input
            id="accessCode"
            placeholder="Enter your 8-digit code"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            maxLength={8}
            className="text-center text-lg tracking-wider"
            autoFocus
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                verifyAccessCode();
              }
            }}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={verifyAccessCode} 
          disabled={isVerifying || accessCode.trim().length !== 8}
          className="w-full bg-inuka-crimson hover:bg-inuka-crimson/90"
        >
          {isVerifying ? "Verifying..." : "Verify & Continue"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessCodeVerification;
