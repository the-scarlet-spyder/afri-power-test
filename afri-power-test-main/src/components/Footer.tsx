
import React from 'react';
import Logo from './Logo';

const Footer = () => {
  return (
    <footer className="bg-inuka-beige py-12">
      <div className="inuka-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-gray-600">
              Discover your strengths through a culturally relevant, science-inspired 
              assessment tailored to African contexts.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-inuka-brown">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-inuka-terracotta transition-colors">Home</a></li>
              <li><a href="/signup" className="text-gray-600 hover:text-inuka-terracotta transition-colors">Get Started</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-inuka-terracotta transition-colors">About Us</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-inuka-brown">Contact</h3>
            <p className="text-gray-600">Powered by Strength Africa</p>
            <p className="text-gray-600 mt-2">info@strengthafrica.com</p>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Inuka. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
