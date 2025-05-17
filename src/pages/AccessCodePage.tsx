
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AccessCodeVerification from '@/components/AccessCodeVerification';

const AccessCodePage = () => {
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
          
          <AccessCodeVerification />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AccessCodePage;
