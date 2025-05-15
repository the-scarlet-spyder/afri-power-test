
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";
import AuthGuard from "./components/AuthGuard";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Test from "./pages/Test";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import VerifyCertificate from "./pages/VerifyCertificate";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TestProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={
                <AuthGuard requireAuth={false} redirectPath="/test">
                  <Signup />
                </AuthGuard>
              } />
              <Route path="/login" element={
                <AuthGuard requireAuth={false} redirectPath="/test">
                  <Login />
                </AuthGuard>
              } />
              <Route path="/welcome" element={
                <AuthGuard>
                  <Welcome />
                </AuthGuard>
              } />
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
              <Route path="/certificate/:certificateId" element={<VerifyCertificate />} />
              <Route path="/verify" element={<VerifyCertificate />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
