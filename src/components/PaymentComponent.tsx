import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [finalAmount, setFinalAmount] = useState(amount);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  
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

  const applyDiscountCode = async () => {
    if (!discountCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a discount code",
        variant: "destructive"
      });
      return;
    }

    setIsApplyingDiscount(true);
    
    try {
      // Check if discount code exists and is valid
      const { data: discountData, error } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('code', discountCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !discountData) {
        toast({
          title: "Invalid Code",
          description: "The discount code you entered is not valid or has expired.",
          variant: "destructive"
        });
        return;
      }

      // Check usage limit
      if (discountData.usage_limit && discountData.times_used >= discountData.usage_limit) {
        toast({
          title: "Code Expired",
          description: "This discount code has reached its usage limit.",
          variant: "destructive"
        });
        return;
      }

      // Check validity dates
      const now = new Date();
      if (discountData.valid_from && new Date(discountData.valid_from) > now) {
        toast({
          title: "Code Not Active",
          description: "This discount code is not active yet.",
          variant: "destructive"
        });
        return;
      }

      if (discountData.valid_until && new Date(discountData.valid_until) < now) {
        toast({
          title: "Code Expired",
          description: "This discount code has expired.",
          variant: "destructive"
        });
        return;
      }

      // Calculate discount
      let discountAmount = 0;
      if (discountData.discount_percentage) {
        discountAmount = Math.round((amount * discountData.discount_percentage) / 100);
      } else if (discountData.discount_amount) {
        discountAmount = discountData.discount_amount;
      }

      const newFinalAmount = Math.max(0, amount - discountAmount);
      
      setAppliedDiscount(discountData);
      setFinalAmount(newFinalAmount);

      toast({
        title: "Discount Applied!",
        description: `${discountData.discount_percentage ? `${discountData.discount_percentage}%` : `₦${discountAmount/100}`} discount applied successfully.`,
      });

    } catch (error) {
      console.error('Error applying discount code:', error);
      toast({
        title: "Error",
        description: "Failed to apply discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsApplyingDiscount(false);
    }
  };

  const removeDiscount = () => {
    setAppliedDiscount(null);
    setFinalAmount(amount);
    setDiscountCode('');
    toast({
      title: "Discount Removed",
      description: "Discount code has been removed.",
    });
  };

  const handlePayment = async () => {
    const userEmail = email || user?.email || '';
    
    if (!userEmail) {
      toast({
        title: "Error",
        description: "Please log in to make a payment",
        variant: "destructive"
      });
      return;
    }

    // If final amount is 0 (free), skip Paystack and process directly
    if (finalAmount === 0) {
      await processFreePayment();
      return;
    }

    if (!window.PaystackPop) {
      toast({
        title: "Payment Error",
        description: "Payment module failed to load. Please refresh the page and try again.",
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
      callback: async (response: any) => {
        // Validate the payment on your server
        console.log('Payment complete! Reference:', response.reference);
        
        // Update discount code usage if applied
        if (appliedDiscount) {
          await updateDiscountUsage();
        }
        
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
          navigate('/welcome');
        }
      },
    });
    
    handler.openIframe();
  };

  const processFreePayment = async () => {
    try {
      // Update discount code usage
      if (appliedDiscount) {
        await updateDiscountUsage();
      }

      // Mark as paid in local storage
      localStorage.setItem('strengthsTest_paymentStatus', 'paid');

      toast({
        title: "Success!",
        description: "Your discount code has been applied. You can now take the test for free!",
      });

      // Redirect to welcome page
      if (onSuccess) onSuccess();
      else {
        navigate('/welcome');
      }
    } catch (error) {
      console.error('Error processing free payment:', error);
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateDiscountUsage = async () => {
    if (!appliedDiscount) return;

    try {
      await supabase
        .from('discount_codes')
        .update({ 
          times_used: appliedDiscount.times_used + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', appliedDiscount.id);
    } catch (error) {
      console.error('Error updating discount usage:', error);
    }
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
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium text-sm mb-3">Have a discount code?</h3>
            {!appliedDiscount ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter discount code"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={applyDiscountCode}
                  disabled={isApplyingDiscount}
                  className="px-4"
                >
                  {isApplyingDiscount ? "..." : "Apply"}
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between bg-green-50 p-3 rounded border border-green-200">
                <div>
                  <p className="text-sm font-medium text-green-800">
                    Code: {appliedDiscount.code}
                  </p>
                  <p className="text-xs text-green-600">
                    {appliedDiscount.discount_percentage}% discount applied
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeDiscount}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </Button>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-inuka-offwhite p-4 rounded-md">
            <div className="flex justify-between items-center">
              <span className="font-medium">Strengths Assessment</span>
              <span className="font-semibold">₦{amount/100}.00</span>
            </div>
            {appliedDiscount && (
              <div className="flex justify-between items-center text-green-600 mt-1">
                <span className="text-sm">Discount ({appliedDiscount.discount_percentage}%)</span>
                <span className="text-sm">-₦{(amount - finalAmount)/100}.00</span>
              </div>
            )}
            <hr className="my-2" />
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span className={finalAmount === 0 ? "text-green-600" : ""}>
                {finalAmount === 0 ? "FREE" : `₦${finalAmount/100}.00`}
              </span>
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
          {isInitializing ? "Loading Payment..." : finalAmount === 0 ? "Start Free Test" : "Pay Now"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentComponent;
