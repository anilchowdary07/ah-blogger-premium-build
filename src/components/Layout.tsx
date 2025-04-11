
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";

const Layout = () => {
  const location = useLocation();
  
  // Reset scroll position when navigating to a new page
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Performance optimization: Use passive event listeners
  useEffect(() => {
    const scrollOptions = { passive: true };
    
    // Clean up event listeners when component unmounts
    return () => {
      // Any cleanup code can go here
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <Header />
      <main className="flex-grow relative">
        <motion.div 
          className="container mx-auto px-4 py-8 md:py-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="py-4"
            >
              <ScrollArea className="h-full">
                <Outlet />
              </ScrollArea>
            </motion.div>
          </AnimatePresence>
          
          {/* Floating theme toggle */}
          <div className="fixed bottom-8 right-8 z-40">
            <ThemeToggle />
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
