
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileX } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="flex flex-col items-center justify-center py-20">
      <FileX className="text-blog-purple w-16 h-16 mb-6" />
      <h1 className="text-4xl font-serif font-bold mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-6">Oops! This page doesn't exist</p>
      <p className="text-gray-500 mb-8 max-w-md text-center">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button className="bg-blog-purple hover:bg-blog-dark-purple">Return to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
