
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";
import { PairedTestProvider } from "./context/PairedTestContext";
import AuthGuard from "./components/AuthGuard";
import PaymentGuard from "./components/PaymentGuard";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Test from "./pages/Test";
import PairedTest from "./pages/PairedTest";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment";
import NotFound from "./pages/NotFound";
import VerifyCertificate from "./pages/VerifyCertificate";
import Admin from "./pages/Admin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TestProvider>
        <PairedTestProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/signup" element={
                  <AuthGuard requireAuth={false} redirectPath="/payment">
                    <Signup />
                  </AuthGuard>
                } />
                <Route path="/login" element={
                  <AuthGuard requireAuth={false} redirectPath="/payment">
                    <Login />
                  </AuthGuard>
                } />
                <Route path="/payment" element={
                  <AuthGuard>
                    <Payment />
                  </AuthGuard>
                } />
                <Route path="/welcome" element={
                  <AuthGuard>
                    <PaymentGuard>
                      <Welcome />
                    </PaymentGuard>
                  </AuthGuard>
                } />
                <Route path="/test" element={
                  <AuthGuard>
                    <PaymentGuard>
                      <PairedTest />
                    </PaymentGuard>
                  </AuthGuard>
                } />
                <Route path="/results" element={
                  <AuthGuard>
                    <PaymentGuard>
                      <Results />
                    </PaymentGuard>
                  </AuthGuard>
                } />
                <Route path="/profile" element={
                  <AuthGuard>
                    <Profile />
                  </AuthGuard>
                } />
                <Route path="/admin" element={
                  <AuthGuard>
                    <Admin />
                  </AuthGuard>
                } />
                <Route path="/certificate/:certificateId" element={<VerifyCertificate />} />
                <Route path="/verify" element={<VerifyCertificate />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </PairedTestProvider>
      </TestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
