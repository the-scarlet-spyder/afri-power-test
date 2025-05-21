
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaymentComponent from '@/components/PaymentComponent';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Payment = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Set your price in the lowest currency unit (e.g., kobo for NGN, cents for USD)
  const price = 25000000; // ₦25,0000.00
  
  const handlePaymentSuccess = () => {
    navigate('/test');
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-inuka-offwhite">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="mb-6 text-inuka-charcoal"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-inuka-charcoal mb-4 font-poppins">
                Complete Your Purchase
              </h1>
              <p className="text-lg text-gray-700 font-inter">
                Unlock the full Strengths Africa assessment and discover your unique strengths.
              </p>
            </div>
            
            <PaymentComponent 
              amount={price}
              email={user?.email}
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Payment;
