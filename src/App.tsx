
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./pages/Home";
import BlogPost from "./pages/BlogPost";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEditor from "./pages/AdminEditor";
import CategoryPage from "./pages/CategoryPage";
import SearchResults from "./pages/SearchResults";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="blog/:slug" element={<BlogPost />} />
              <Route path="category/:category" element={<CategoryPage />} />
              <Route path="search" element={<SearchResults />} />
              <Route path="login" element={<Login />} />
              <Route element={<ProtectedRoute />}>
                <Route path="admin" element={<AdminDashboard />} />
                <Route path="admin/edit/:slug" element={<AdminEditor />} />
                <Route path="admin/new" element={<AdminEditor />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
