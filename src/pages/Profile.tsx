
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTest } from '@/context/TestContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

const Profile = () => {
  const { user, logout } = useAuth();
  const { testHistory, fetchTestHistory, loadingHistory } = useTest();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      fetchTestHistory();
    }
  }, [user, fetchTestHistory]);
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    navigate('/login');
    return null;
  }
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'PPP');
    } catch (e) {
      return 'Invalid date';
    }
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
            
            {loadingHistory ? (
              <Card className="mb-8">
                <CardContent className="p-6">
                  <p className="text-center">Loading your test history...</p>
                </CardContent>
              </Card>
            ) : testHistory && testHistory.length > 0 ? (
              testHistory.map((test) => (
                <Card key={test.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>Inuka Strength Test</CardTitle>
                    <CardDescription>Taken on: {formatDate(test.testDate)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Top Strengths:</p>
                    <ul className="list-disc pl-5">
                      {test.results.topStrengths.map((strength, idx) => (
                        <li key={idx}>{strength.strength.name}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="mb-8">
                <CardContent className="p-6 text-center">
                  <p>You haven't taken any tests yet.</p>
                  <Button 
                    onClick={() => navigate('/test')}
                    className="bg-inuka-terracotta hover:bg-opacity-90 mt-4"
                  >
                    Take a Test Now
                  </Button>
                </CardContent>
              </Card>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => navigate('/test')}
                className="bg-inuka-terracotta hover:bg-opacity-90"
              >
                Take New Test
              </Button>
              {testHistory && testHistory.length > 0 && (
                <Button 
                  onClick={() => navigate('/results')}
                  className="bg-inuka-green hover:bg-opacity-90"
                >
                  View Latest Results
                </Button>
              )}
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
