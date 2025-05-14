
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="inuka-container">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-inuka-brown mb-6">
              Your Profile
            </h1>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your account details and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Name</h3>
                  <p className="text-lg">{user.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="text-lg">{user.email}</p>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold text-inuka-brown mb-4">
              Your Test History
            </h2>
            
            {/* In a real app, we'd fetch test history from a database */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Inuka Strength Test</CardTitle>
                <CardDescription>Last taken: Today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>Top Strengths:</p>
                <ul className="list-disc pl-5">
                  <li>Strategic Mind</li>
                  <li>Community Builder</li>
                  <li>Resilient Achiever</li>
                  <li>Insight Seeker</li>
                  <li>Connector</li>
                </ul>
              </CardContent>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/test')}
                className="bg-inuka-terracotta hover:bg-opacity-90"
              >
                Retake Test
              </Button>
              <Button 
                onClick={() => navigate('/results')}
                className="bg-inuka-green hover:bg-opacity-90"
              >
                View Last Results
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-inuka-brown text-inuka-brown hover:bg-inuka-brown hover:text-white"
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;
