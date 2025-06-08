
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Brain, FileCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Welcome = () => {
  return (
    <div className="min-h-screen flex flex-col bg-inuka-offwhite">
      <Navbar />
      
      <main className="flex-grow py-8 md:py-20 px-4">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto bg-white p-6 md:p-12 rounded-xl shadow-md animate-fade-in">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-inuka-charcoal text-center mb-4 font-poppins">
              Welcome to Strengths Africa!
            </h1>
            
            <h2 className="text-lg md:text-xl lg:text-2xl text-inuka-crimson text-center mb-6 font-poppins">
              Discover what makes you extraordinary.
            </h2>
            
            <p className="text-base md:text-lg text-gray-700 mb-8 md:mb-10 text-center leading-relaxed">
              Our comprehensive strengths assessment will help you uncover your top 5 strengths — the personal traits that make you shine. 
              Get a detailed report with personalized insights and a professional certificate highlighting your unique strengths.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
              <div className="bg-inuka-offwhite p-4 md:p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                  <Clock className="h-6 w-6 md:h-7 md:w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins text-sm md:text-base">Quick Assessment</h3>
                <p className="text-gray-700 text-sm md:text-base">Takes about 10–15 minutes</p>
              </div>
              
              <div className="bg-inuka-offwhite p-4 md:p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                  <Brain className="h-6 w-6 md:h-7 md:w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins text-sm md:text-base">Expert Insights</h3>
                <p className="text-gray-700 text-sm md:text-base">Professional analysis & recommendations</p>
              </div>
              
              <div className="bg-inuka-offwhite p-4 md:p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-12 w-12 md:h-14 md:w-14 bg-white rounded-full flex items-center justify-center mb-3 md:mb-4 shadow-sm">
                  <FileCheck className="h-6 w-6 md:h-7 md:w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins text-sm md:text-base">Professional Certificate</h3>
                <p className="text-gray-700 text-sm md:text-base">Downloadable PDF certificate</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-inuka-crimson/5 to-inuka-gold/5 border border-inuka-crimson/20 rounded-lg p-4 md:p-6 mb-8 md:mb-10">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-inuka-crimson mb-2 font-poppins">Complete Assessment</h3>
                <p className="text-2xl md:text-3xl font-bold text-inuka-charcoal mb-2">₦25,000</p>
                <p className="text-sm md:text-base text-gray-600">One-time payment • Lifetime access to your results</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/payment">
                <Button 
                  className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-4 md:py-6 px-8 md:px-10 rounded-md text-base md:text-lg shadow-md transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px] w-full md:w-auto"
                >
                  Get Started <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
            </div>
            
            <p className="text-xs md:text-sm text-gray-500 text-center mt-4 md:mt-6">
              Secure payment • 30-day money-back guarantee
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Welcome;
