
import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Lightbulb, LineChart, ArrowRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-inuka-offwhite">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          {/* Subtle geometric pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-64 h-64 rounded-full border-8 border-inuka-gold"></div>
            <div className="absolute bottom-20 right-40 w-80 h-80 rounded-full border-8 border-inuka-crimson"></div>
            <div className="absolute top-40 right-20 w-40 h-40 rounded-full border-4 border-inuka-charcoal"></div>
          </div>
          
          <div className="inuka-container relative z-10">
            <div className="max-w-3xl mx-auto text-center animate-fade-in">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-inuka-charcoal mb-6 font-poppins leading-tight">
                Discover the Strengths That Power You
              </h1>
              
              <p className="text-xl text-gray-700 mb-8 font-inter">
                A free tool to unlock your unique potential, designed for African individuals at every stage of life.
              </p>
              
              <Link to="/signup" className="inline-block">
                <Button 
                  className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-6 px-10 rounded-md text-lg shadow-md transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  Take the Free Test <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              {/* Sample Strengths Tags */}
              <div className="mt-12 flex flex-wrap gap-3 justify-center">
                <span className="strength-tag strength-tag-visionary">Visionary</span>
                <span className="strength-tag strength-tag-strategic">Strategic Thinker</span>
                <span className="strength-tag strength-tag-resilient">Resilient Spirit</span>
                <span className="strength-tag strength-tag-mentor">Community Builder</span>
                <span className="strength-tag strength-tag-innovator">Innovator</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="inuka-container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-inuka-offwhite p-8 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: '0.1s'}}>
                <div className="h-14 w-14 bg-inuka-crimson/10 rounded-full flex items-center justify-center mb-4">
                  <Compass className="h-7 w-7 text-inuka-crimson" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">Discover Your Path</h3>
                <p className="text-gray-700 font-inter">
                  Uncover your unique strengths and understand how they shape your approach to life, work, and relationships.
                </p>
              </div>
              
              <div className="bg-inuka-offwhite p-8 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: '0.2s'}}>
                <div className="h-14 w-14 bg-inuka-gold/10 rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="h-7 w-7 text-inuka-gold" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">Gain Clarity</h3>
                <p className="text-gray-700 font-inter">
                  Get scientifically validated insights that help you understand your natural talents and how to leverage them.
                </p>
              </div>
              
              <div className="bg-inuka-offwhite p-8 rounded-lg shadow-sm animate-fade-in" style={{animationDelay: '0.3s'}}>
                <div className="h-14 w-14 bg-inuka-crimson/10 rounded-full flex items-center justify-center mb-4">
                  <LineChart className="h-7 w-7 text-inuka-crimson" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-inuka-charcoal font-poppins">Unlock Growth</h3>
                <p className="text-gray-700 font-inter">
                  Use your strength profile to make better decisions, improve relationships, and find more fulfillment.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-inuka-crimson/5 to-inuka-gold/5">
          <div className="inuka-container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-inuka-charcoal mb-6 font-poppins">
                Ready to discover your strengths?
              </h2>
              <p className="text-lg text-gray-700 mb-8 font-inter">
                Take the Inuka Strength Test today and start your journey to personal and professional growth.
              </p>
              <Link to="/signup" className="inline-block">
                <Button 
                  className="bg-inuka-crimson hover:bg-opacity-90 text-white font-semibold py-6 px-10 rounded-md text-lg shadow-md transition-all duration-300 hover:translate-y-[-2px] active:translate-y-[1px]"
                >
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Landing;
