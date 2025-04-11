
import React, { lazy, Suspense } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Lazy load components for better performance
const Home = lazy(() => import("./pages/Home"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Login = lazy(() => import("./pages/Login"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminEditor = lazy(() => import("./pages/AdminEditor"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Company = lazy(() => import("./pages/Company"));
const Terms = lazy(() => import("./pages/Terms"));
const Layout = lazy(() => import("./components/Layout"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const BlogProgressBar = lazy(() => import("./components/BlogProgressBar"));

import { ThemeProvider } from "./components/ThemeProvider";

// Loading fallback for lazy-loaded components
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
    </div>
  </div>
);

// Create a client for React Query with persistence and better cache handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnMount: true,
      cacheTime: 15 * 60 * 1000, // 15 minutes
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
                  <Suspense fallback={<LoadingFallback />}>
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
                        <Route path="terms" element={<Terms />} />
                        <Route element={<ProtectedRoute />}>
                          <Route path="admin" element={<AdminDashboard />} />
                          <Route path="admin/edit/:slug" element={<AdminEditor />} />
                          <Route path="admin/new" element={<AdminEditor />} />
                        </Route>
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Suspense>
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
