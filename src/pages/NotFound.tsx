
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileX, Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[70vh] py-20"
    >
      <div className="relative">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="text-blog-purple mb-6 rounded-full bg-blog-light-purple p-6 dark:bg-gray-800"
        >
          <FileX className="w-20 h-20" />
        </motion.div>
      </div>
      
      <h1 className="text-7xl font-serif font-bold mb-4 text-blog-purple dark:text-blog-light-purple">404</h1>
      <h2 className="text-2xl font-semibold mb-6 text-gray-700 dark:text-gray-300">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-center">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button 
            variant="default" 
            className="bg-blog-purple hover:bg-blog-dark-purple flex gap-2"
          >
            <Home size={18} />
            <span>Return Home</span>
          </Button>
        </Link>
        <Button 
          variant="outline" 
          className="border-blog-purple text-blog-purple hover:bg-blog-light-purple dark:border-blog-light-purple dark:text-blog-light-purple flex gap-2"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={18} />
          <span>Go Back</span>
        </Button>
      </div>
    </motion.div>
  );
};

export default NotFound;
