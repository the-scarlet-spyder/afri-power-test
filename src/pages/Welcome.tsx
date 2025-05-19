
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
      
      <main className="flex-grow py-12 md:py-20">
        <div className="inuka-container">
          <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-md animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-inuka-charcoal text-center mb-4 font-poppins">
              Welcome to Strength Africa!
            </h1>
            
            <h2 className="text-xl md:text-2xl text-inuka-crimson text-center mb-6 font-poppins">
              Let's discover what makes you extraordinary.
            </h2>
            
            <p className="text-lg text-gray-700 mb-10 text-center">
              This free test will help you uncover your top strengths — the personal traits that make you shine. 
              It only takes a few minutes, and at the end, you'll get a personalized certificate highlighting 
              your Top 5 strengths.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-inuka-offwhite p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Clock className="h-7 w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins">Time</h3>
                <p className="text-gray-700">Takes about 5–7 minutes</p>
              </div>
              
              <div className="bg-inuka-offwhite p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <Brain className="h-7 w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins">Be Honest</h3>
                <p className="text-gray-700">There are no right or wrong answers</p>
              </div>
              
              <div className="bg-inuka-offwhite p-6 rounded-lg flex flex-col items-center text-center">
                <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <FileCheck className="h-7 w-7 text-inuka-crimson" />
                </div>
                <h3 className="font-medium text-inuka-charcoal mb-2 font-poppins">Get Your Certificate</h3>
                <p className="text-gray-700">Free PDF at the end</p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Link to="/test">
                <Button 
                  className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-6 px-10 rounded-md text-lg shadow-md transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  Start Test <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Welcome;
