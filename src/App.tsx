
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";
import AuthGuard from "./components/AuthGuard";
import AccessCodeGuard from "./components/AccessCodeGuard";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AccessCode from "./pages/AccessCode";
import Welcome from "./pages/Welcome";
import Test from "./pages/Test";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import VerifyCertificate from "./pages/VerifyCertificate";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import CodesManagement from "./pages/admin/CodesManagement";

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
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/signup" element={
                <AuthGuard requireAuth={false} redirectPath="/access-code">
                  <Signup />
                </AuthGuard>
              } />
              <Route path="/login" element={
                <AuthGuard requireAuth={false} redirectPath="/access-code">
                  <Login />
                </AuthGuard>
              } />
              <Route path="/access-code" element={
                <AuthGuard>
                  <AccessCode />
                </AuthGuard>
              } />
              <Route path="/welcome" element={
                <AuthGuard>
                  <AccessCodeGuard>
                    <Welcome />
                  </AccessCodeGuard>
                </AuthGuard>
              } />
              <Route path="/test" element={
                <AuthGuard>
                  <AccessCodeGuard>
                    <Test />
                  </AccessCodeGuard>
                </AuthGuard>
              } />
              <Route path="/results" element={
                <AuthGuard>
                  <AccessCodeGuard>
                    <Results />
                  </AccessCodeGuard>
                </AuthGuard>
              } />
              <Route path="/profile" element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              } />
              <Route path="/admin" element={
                <AuthGuard requireAdmin={true}>
                  <AdminDashboard />
                </AuthGuard>
              }>
                <Route index element={<AdminHome />} />
                <Route path="codes" element={<CodesManagement />} />
              </Route>
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
