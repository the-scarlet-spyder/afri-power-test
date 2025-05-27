
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { ForcedChoiceTestProvider } from '@/context/ForcedChoiceTestContext';
import PaymentGuard from '@/components/PaymentGuard';

// Import pages
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Payment from './pages/Payment';
import ForcedChoiceTest from './pages/ForcedChoiceTest';
import ForcedChoiceResults from './pages/ForcedChoiceResults';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ForcedChoiceTestProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                
                {/* Payment route */}
                <Route path="/payment" element={<Payment />} />
                
                {/* Protected routes that require payment */}
                <Route 
                  path="/test" 
                  element={
                    <PaymentGuard>
                      <ForcedChoiceTest />
                    </PaymentGuard>
                  } 
                />
                <Route 
                  path="/results" 
                  element={
                    <PaymentGuard>
                      <ForcedChoiceResults />
                    </PaymentGuard>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PaymentGuard>
                      <Profile />
                    </PaymentGuard>
                  } 
                />
                
                {/* Admin route */}
                <Route path="/admin" element={<Admin />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </ForcedChoiceTestProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
