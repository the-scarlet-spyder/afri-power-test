
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccessCodeVerification from '@/components/AccessCodeVerification';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AccessCodePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [checkingCode, setCheckingCode] = useState(true);
  const [hasValidCode, setHasValidCode] = useState(false);

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Check if user already has a valid code
    const checkAccessCode = async () => {
      try {
        const { data, error } = await supabase.rpc('has_valid_access_code', {
          _user_id: user.id
        });
        
        if (error) {
          console.error('Error checking access code:', error);
        } else {
          setHasValidCode(data);
          
          // If user already has a valid code, redirect to test page
          if (data) {
            console.log("User already has valid code, redirecting to test");
            navigate('/test', { replace: true });
          }
        }
      } catch (err) {
        console.error('Error checking access code:', err);
      } finally {
        setCheckingCode(false);
      }
    };
    
    checkAccessCode();
  }, [user, navigate]);
  
  // Show loading while checking access code
  if (checkingCode) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
        <Navbar />
        <div className="flex-grow py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-4">
              <Skeleton className="h-12 w-full max-w-md mb-4" />
              <Skeleton className="h-8 w-3/4 max-w-md mb-4" />
              <Skeleton className="h-64 w-full max-w-md" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-inuka-crimson mb-4">Access Code Required</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              To proceed with the Strength Africa assessment, please enter your unique access code below.
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-none">
              <AccessCodeVerification />
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessCodePage;
