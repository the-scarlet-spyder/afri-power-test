import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';

// Replace with your Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_d9df47d0da706f295ed9ac775e08e55e26709f61';

interface PaymentComponentProps {
  amount: number; // amount in the lowest currency unit (e.g., kobo, cents)
  email?: string;
  onSuccess?: () => void;
  onClose?: () => void;
}

const PaymentComponent: React.FC<PaymentComponentProps> = ({ 
  amount, 
  email, 
  onSuccess,
  onClose
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  
  useEffect(() => {
    // Load Paystack script
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.async = true;
    script.onload = () => setIsInitializing(false);
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handlePayment = () => {
    if (!window.PaystackPop) {
      toast({
        title: "Payment Error",
        description: "Payment module failed to load. Please refresh the page and try again.",
        variant: "destructive"
      });
      return;
    }
    
    const userEmail = email || user?.email || '';
    
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please log in to make a payment",
        variant: "destructive"
      });
      return;
    }
    
    const reference = 'ST_' + Math.floor(Math.random() * 1000000000 + 1) + '_' + Date.now();
    
    // Initialize Paystack payment
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: userEmail,
      amount: amount, // In kobo/cents
      ref: reference,
      currency: 'NGN', // Change according to your currency
      onClose: () => {
        toast({
          title: "Payment Cancelled",
          description: "You cancelled the payment",
        });
        if (onClose) onClose();
      },
      callback: (response: any) => {
        // Validate the payment on your server
        console.log('Payment complete! Reference:', response.reference);
        
        toast({
          title: "Payment Successful",
          description: "Your payment was processed successfully",
        });
        
        // Update local storage to mark user as paid
        localStorage.setItem('strengthsTest_paymentStatus', 'paid');
        
        // Call onSuccess callback if provided
        if (onSuccess) onSuccess();
        else {
          // Otherwise, redirect to test page
          navigate('/test');
        }
      },
    });
    
    handler.openIframe();
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-poppins text-center">Strengths Test Payment</CardTitle>
        <CardDescription className="text-center">
          Unlock your unique strengths assessment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-inuka-offwhite p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Strengths Assessment</span>
              <span className="font-semibold">₦{amount/100}.00</span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Discover your unique strengths with our comprehensive assessment designed specifically for African contexts.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handlePayment}
          disabled={isInitializing}
          className="w-full bg-inuka-crimson hover:bg-opacity-90"
        >
          {isInitializing ? "Loading Payment..." : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentComponent;
