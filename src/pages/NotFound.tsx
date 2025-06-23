
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9] font-inter">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="text-center max-w-md mx-auto p-8 bg-white rounded-lg shadow-md">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-inuka-crimson mb-4 font-poppins">404</h1>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-6">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Path: {location.pathname}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              onClick={handleGoHome}
              className="w-full bg-inuka-crimson hover:bg-opacity-90"
            >
              Go to Home
            </Button>
            <Button 
              onClick={handleGoBack}
              variant="outline"
              className="w-full"
            >
              Go Back
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
