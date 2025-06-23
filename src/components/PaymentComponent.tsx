
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';

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
  const [discountCode, setDiscountCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discount_percentage?: number;
    discount_amount?: number;
  } | null>(null);
  const [finalAmount, setFinalAmount] = useState(amount);
  
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

  useEffect(() => {
    if (appliedDiscount) {
      let discountAmount = 0;
      if (appliedDiscount.discount_percentage) {
        discountAmount = Math.round((amount * appliedDiscount.discount_percentage) / 100);
      } else if (appliedDiscount.discount_amount) {
        discountAmount = appliedDiscount.discount_amount;
      }
      setFinalAmount(Math.max(0, amount - discountAmount));
    } else {
      setFinalAmount(amount);
    }
  }, [appliedDiscount, amount]);

  const validateDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive"
      });
      return;
    }

    setIsValidatingCode(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('validate-discount-code', {
        body: { code: discountCode.trim() }
      });

      if (error) {
        throw error;
      }

      if (data.valid) {
        setAppliedDiscount({
          code: data.code,
          discount_percentage: data.discount_percentage,
          discount_amount: data.discount_amount
        });
        toast({
          title: "Success",
          description: data.message,
        });
      } else {
        toast({
          title: "Invalid Code",
          description: data.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        title: "Error",
        description: "Failed to validate discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsValidatingCode(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
    toast({
      title: "Discount Removed",
      description: "Discount code has been removed",
    });
  };
  
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
      amount: finalAmount, // In kobo/cents
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
        
        // Store discount information if applied
        if (appliedDiscount) {
          localStorage.setItem('strengthsTest_discountApplied', JSON.stringify({
            code: appliedDiscount.code,
            originalAmount: amount,
            discountAmount: amount - finalAmount,
            finalAmount: finalAmount
          }));
        }
        
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

  const getDiscountAmount = () => {
    if (!appliedDiscount) return 0;
    if (appliedDiscount.discount_percentage) {
      return Math.round((amount * appliedDiscount.discount_percentage) / 100);
    }
    return appliedDiscount.discount_amount || 0;
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
          {/* Discount Code Section */}
          <div className="space-y-2">
            <Label htmlFor="discount-code">Discount Code (Optional)</Label>
            <div className="flex gap-2">
              <Input
                id="discount-code"
                type="text"
                placeholder="Enter discount code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                disabled={!!appliedDiscount}
              />
              {appliedDiscount ? (
                <Button 
                  onClick={removeDiscount}
                  variant="outline"
                  size="sm"
                >
                  Remove
                </Button>
              ) : (
                <Button 
                  onClick={validateDiscountCode}
                  disabled={isValidatingCode || !discountCode.trim()}
                  size="sm"
                >
                  {isValidatingCode ? "Validating..." : "Apply"}
                </Button>
              )}
            </div>
            {appliedDiscount && (
              <p className="text-sm text-green-600 font-medium">
                ✓ Code "{appliedDiscount.code}" applied successfully!
              </p>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-inuka-offwhite p-4 rounded-md space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-medium">Strengths Assessment</span>
              <span className="font-semibold">₦{(amount/100).toFixed(2)}</span>
            </div>
            
            {appliedDiscount && (
              <div className="flex justify-between items-center text-green-600">
                <span>Discount ({appliedDiscount.code})</span>
                <span>-₦{(getDiscountAmount()/100).toFixed(2)}</span>
              </div>
            )}
            
            <hr className="border-gray-300" />
            
            <div className="flex justify-between items-center font-bold text-lg">
              <span>Total</span>
              <span>₦{(finalAmount/100).toFixed(2)}</span>
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
          {isInitializing ? "Loading Payment..." : `Pay ₦${(finalAmount/100).toFixed(2)} Now`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentComponent;
