
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodesManagement from '@/components/admin/CodesManagement';

const AdminCodesPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect non-admin users away from this page
  React.useEffect(() => {
    // Check if user is loaded and not admin
    const checkAdminAccess = async () => {
      if (user === null) {
        toast({
          title: "Access denied",
          description: "You need to be logged in to access this page.",
          variant: "destructive",
        });
        navigate('/login');
      }
    };

    checkAdminAccess();
  }, [user, navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-inuka-crimson">Access Code Management</h1>
            <p className="text-gray-600 mt-2">
              Create, manage, and distribute access codes for the Strength Africa assessment.
            </p>
          </div>
          
          <CodesManagement />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminCodesPage;
