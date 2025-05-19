import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTest } from '@/context/TestContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { getUserCertificates } from '@/lib/test-service';
import { Certificate } from '@/lib/database.types';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { LogOut, User, FileDown } from 'lucide-react';
import ProfileCertificateDownload from '@/components/results/ProfileCertificateDownload';

const Profile = () => {
  const { user, logout } = useAuth();
  const { testHistory, fetchTestHistory, loadingHistory } = useTest();
  const navigate = useNavigate();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  
  useEffect(() => {
    if (user) {
      fetchTestHistory();
      loadCertificates();
    }
  }, [user]);
  
  const loadCertificates = async () => {
    if (!user) return;
    
    setLoadingCertificates(true);
    console.log("Fetching certificates for user:", user.id);
    
    try {
      const userCertificates = await getUserCertificates(user.id);
      console.log("Certificates received:", userCertificates);
      setCertificates(userCertificates);
    } catch (error) {
      console.error("Failed to load certificates:", error);
      toast({
        title: "Error",
        description: "Failed to load your certificates.",
        variant: "destructive",
      });
    } finally {
      setLoadingCertificates(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      console.log("Logout button clicked");
      // Show toast before logout to indicate process has started
      toast({
        title: "Logging out...",
        description: "Please wait while we log you out.",
      });
      
      await logout();
      
      // Force navigation to home page after logout
      navigate('/', { replace: true });
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      console.error("Logout failed:", error);
      toast({
        title: "Logout Failed",
        description: "There was an issue logging you out. Please try again.",
        variant: "destructive",
      });
    }
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
            <h1 className="text-3xl font-bold text-inuka-crimson mb-6 font-poppins">
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
            
            <h2 className="text-2xl font-bold text-inuka-crimson mb-4 font-poppins">
              Your Test History
            </h2>
            
            {loadingHistory ? (
              <Card className="mb-8 p-6 text-center">
                <p>Loading your test history...</p>
              </Card>
            ) : testHistory && testHistory.length > 0 ? (
              testHistory.map((test, index) => (
                <Card key={test.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>Strength Africa Assessment</CardTitle>
                    <CardDescription>Taken on: {formatDate(test.testDate)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p>Top Strengths:</p>
                    <ul className="list-disc pl-5">
                      {test.results.topStrengths.map((strength, idx) => (
                        <li key={idx}>{strength.strength.name}</li>
                      ))}
                    </ul>
                    <div className="flex">
                      <Button 
                        onClick={() => navigate(`/results?test=${test.id}`)}
                        className="bg-inuka-crimson hover:bg-opacity-90 mt-2"
                        size="sm"
                      >
                        View Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="mb-8 p-6 text-center">
                <p>You haven't taken any tests yet.</p>
                <Button 
                  onClick={() => navigate('/access-code')}
                  className="bg-inuka-crimson hover:bg-opacity-90 mt-4"
                >
                  Take the Test Now
                </Button>
              </Card>
            )}
            
            <h2 className="text-2xl font-bold text-inuka-crimson mb-4 mt-8 font-poppins">
              Your Certificates
            </h2>
            
            {loadingCertificates ? (
              <div className="space-y-3">
                <Skeleton className="h-[100px] w-full rounded-lg" />
                <Skeleton className="h-[100px] w-full rounded-lg" />
              </div>
            ) : certificates && certificates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {certificates.map(cert => (
                  <Card key={cert.id} className="overflow-hidden">
                    <CardHeader className="bg-inuka-crimson text-white">
                      <CardTitle className="text-lg">Certificate</CardTitle>
                      <CardDescription className="text-white text-opacity-90">
                        ID: {cert.certificate_id}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p><strong>Name:</strong> {cert.name_on_certificate}</p>
                      <p><strong>Date:</strong> {formatDate(cert.created_at)}</p>
                      <p className="flex items-center mt-1">
                        <span className={`h-2 w-2 rounded-full ${cert.verified ? 'bg-green-500' : 'bg-yellow-500'} mr-2`}></span>
                        <span>{cert.verified ? 'Verified' : 'Pending Verification'}</span>
                      </p>
                      
                      <div className="flex flex-col gap-2 mt-3">
                        <Button 
                          onClick={() => navigate(`/certificate/${cert.certificate_id}`)}
                          className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90 w-full"
                          size="sm"
                        >
                          View Certificate
                        </Button>
                        
                        <ProfileCertificateDownload certificateId={cert.certificate_id} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="mb-8 p-6 text-center">
                <p>No certificates found.</p>
                <p className="text-sm text-gray-500 mt-1">Complete the test to generate your certificate.</p>
              </Card>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                onClick={() => navigate('/access-code')}
                className="bg-inuka-crimson hover:bg-opacity-90"
              >
                Take New Test
              </Button>
              {testHistory && testHistory.length > 0 && (
                <Button 
                  onClick={() => navigate('/results')}
                  className="bg-inuka-gold text-inuka-charcoal hover:bg-opacity-90"
                >
                  View Latest Results
                </Button>
              )}
              <Button 
                onClick={handleLogout}
                variant="outline" 
                className="border-inuka-crimson text-inuka-crimson hover:bg-inuka-crimson hover:text-white flex items-center gap-2"
              >
                <LogOut size={16} />
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
