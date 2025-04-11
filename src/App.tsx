
import React from "react";
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
import AboutUs from "./pages/AboutUs";
import Company from "./pages/Company";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import BlogProgressBar from "./components/BlogProgressBar";
import { ThemeProvider } from "./components/ThemeProvider";

// Create a client for React Query with persistence
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 10 * 60 * 1000, // 10 minutes
      // This will help with blog post persistence
      refetchOnMount: true,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="system" storageKey="blog-theme">
          <AuthProvider>
            <TooltipProvider>
              <BrowserRouter>
                <div className="relative">
                  <Sonner position="top-right" closeButton />
                  <BlogProgressBar />
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Home />} />
                      <Route path="blog/:slug" element={<BlogPost />} />
                      <Route path="category/:category" element={<CategoryPage />} />
                      <Route path="search" element={<SearchResults />} />
                      <Route path="login" element={<Login />} />
                      <Route path="featured" element={<Home />} />
                      <Route path="latest" element={<Home />} />
                      <Route path="authors" element={<Home />} />
                      <Route path="tags" element={<Home />} />
                      <Route path="about-us" element={<AboutUs />} />
                      <Route path="company" element={<Company />} />
                      <Route element={<ProtectedRoute />}>
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/edit/:slug" element={<AdminEditor />} />
                        <Route path="admin/new" element={<AdminEditor />} />
                      </Route>
                      <Route path="*" element={<NotFound />} />
                    </Route>
                  </Routes>
                </div>
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
