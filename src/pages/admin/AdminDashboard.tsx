
import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { checkIsAdmin } from '@/lib/access-code-service';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('codes');

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user?.id) {
        navigate('/login');
        return;
      }
      
      try {
        const admin = await checkIsAdmin(user.id);
        setIsAdmin(admin);
        
        if (!admin) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, navigate]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate(`/admin/${tab === 'dashboard' ? '' : tab}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-inuka-crimson" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center p-4">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access the admin area.</p>
          <Button onClick={() => navigate('/')}>Return to Home</Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4 flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-inuka-crimson mb-4 md:mb-0">
            Admin Dashboard
          </h1>
          
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Return to Site
          </Button>
        </div>
        
        <Tabs 
          value={activeTab} 
          onValueChange={handleTabChange}
          className="space-y-6"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="codes">Access Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0 h-full">
            <Outlet />
          </TabsContent>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
