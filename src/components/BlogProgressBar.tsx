
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const BlogProgressBar = () => {
  const [width, setWidth] = useState(0);
  const location = useLocation();
  const isBlogPost = location.pathname.startsWith('/blog/');

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      
      // Calculate scroll progress as a percentage
      const scrolled = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setWidth(scrolled);
    };

    // Add event listener for scroll
    window.addEventListener('scroll', updateScrollProgress);
    
    // Initial calculation
    updateScrollProgress();
    
    // Clean up event listener
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Only show on blog posts
  if (!isBlogPost) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-gray-200 dark:bg-gray-800">
      <motion.div 
        className="h-full"
        style={{ 
          background: `linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)`,
          transformOrigin: "left"
        }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: width / 100 }}
        transition={{ duration: 0.1 }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default BlogProgressBar;
