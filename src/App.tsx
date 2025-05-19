
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { TestProvider } from "./context/TestContext";

import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Welcome from "./pages/Welcome";
import Test from "./pages/Test";
import Results from "./pages/Results";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminCodesPage from "./pages/AdminCodesPage";

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
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/test" element={<Test />} />
              <Route path="/results" element={<Results />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/codes" element={<AdminCodesPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TestProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
