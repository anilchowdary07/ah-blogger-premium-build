
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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
      setWidth(Math.min(Math.max(scrolled, 0), 100)); // Ensure value is between 0-100
    };

    // Add event listener for scroll with passive option for better performance
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    
    // Initial calculation
    updateScrollProgress();
    
    // Clean up event listener
    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  // Only show on blog posts
  if (!isBlogPost) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-50 h-1 bg-muted">
      <div 
        className="h-full bg-gradient-to-r from-blog-purple to-blog-dark-purple"
        style={{ 
          width: `${width}%`,
          transition: "width 0.1s ease-out"
        }}
        role="progressbar"
        aria-valuenow={width}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};

export default BlogProgressBar;
