
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Sidebar from "./Sidebar";
import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for saved theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark' : ''}`}>
      <Navbar 
        isSidebarOpen={isSidebarOpen} 
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={isSidebarOpen} />
        <main className={`transition-all duration-300 flex-grow ${isSidebarOpen ? 'md:ml-64' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full shadow-lg bg-white dark:bg-gray-800"
                onClick={toggleDarkMode}
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
            </div>
            <ScrollArea className="h-full">
              <Outlet />
            </ScrollArea>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
