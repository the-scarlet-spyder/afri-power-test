
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from './context/AuthContext';
import { TestProvider } from './context/TestContext';
import './App.css';

// Routes
import Landing from './pages/Landing';
import Index from './pages/Index';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Welcome from './pages/Welcome';
import Test from './pages/Test';
import Results from './pages/Results';
import Profile from './pages/Profile';
import AccessCodePage from './pages/AccessCodePage';
import NotFound from './pages/NotFound';
import AuthGuard from './components/AuthGuard';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TestProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/home" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/welcome" element={<Welcome />} />
                
                <Route path="/test" element={
                  <AuthGuard>
                    <Test />
                  </AuthGuard>
                } />
                
                <Route path="/results" element={
                  <AuthGuard>
                    <Results />
                  </AuthGuard>
                } />
                
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                
                <Route path="/access-code" element={
                  <AuthGuard>
                    <AccessCodePage />
                  </AuthGuard>
                } />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </TestProvider>
        </AuthProvider>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
