
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentGuardProps {
  children: React.ReactNode;
}

const PaymentGuard = ({ children }: PaymentGuardProps) => {
  const [checkingPayment, setCheckingPayment] = React.useState(true);
  const [hasPaid, setHasPaid] = React.useState(false);
  
  React.useEffect(() => {
    // Check if the user has paid
    const paymentStatus = localStorage.getItem('strengthsTest_paymentStatus');
    setHasPaid(paymentStatus === 'paid');
    setCheckingPayment(false);
  }, []);
  
  // Show loading state when checking payment status
  if (checkingPayment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 w-full max-w-md mx-auto">
        <Skeleton className="h-12 w-full mb-4" />
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // If user hasn't paid, redirect to payment page
  if (!hasPaid) {
    return <Navigate to="/payment" replace />;
  }

  // If user has paid, render the children
  return <>{children}</>;
};

export default PaymentGuard;
