
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleTakeTest = () => {
    if (user) {
      navigate('/payment');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-gradient-to-br from-inuka-crimson via-[#a52323] to-inuka-crimson">
          <div className="inuka-container">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight font-poppins">
                Discover Your Unique <span className="text-inuka-gold">Strengths</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Unlock your potential with Africa's premier strength discovery assessment
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                <Button 
                  onClick={handleTakeTest}
                  size="lg" 
                  className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90 font-semibold px-8 py-6 text-lg w-full sm:w-auto"
                >
                  Take the Test
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="inuka-container">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-inuka-charcoal font-poppins">
                Why Choose Strengths Africa?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-inuka-crimson rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">
                    Scientifically Validated
                  </h3>
                  <p className="text-gray-600">
                    Our assessment is based on proven psychological research and validated across diverse African contexts.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-inuka-crimson rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">
                    Culturally Relevant
                  </h3>
                  <p className="text-gray-600">
                    Designed specifically for African professionals, incorporating cultural values and work contexts.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-inuka-crimson rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">
                    Actionable Insights
                  </h3>
                  <p className="text-gray-600">
                    Get practical recommendations for leveraging your strengths in your career and personal life.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-inuka-charcoal text-white">
          <div className="inuka-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-poppins">
                Ready to Discover Your Strengths?
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Join thousands of African professionals who have unlocked their potential
              </p>
              <Button 
                onClick={handleTakeTest}
                size="lg" 
                className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90 font-semibold px-12 py-6 text-lg"
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Welcome;
