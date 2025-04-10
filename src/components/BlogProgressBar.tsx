
import { useEffect, useState } from "react";

const BlogProgressBar = () => {
  const [width, setWidth] = useState(0);

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

  return (
    <div 
      className="reading-progress-bar" 
      style={{ width: `${width}%` }}
      role="progressbar"
      aria-valuenow={width}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default BlogProgressBar;
