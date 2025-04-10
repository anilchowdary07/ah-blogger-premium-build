
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const categories = [
    { name: "Technology", slug: "technology" },
    { name: "Science", slug: "science" },
    { name: "Culture", slug: "culture" },
    { name: "Business", slug: "business" },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white shadow-sm" : "bg-white"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <h1 className="text-2xl font-serif font-bold text-blog-purple">
              AH<span className="text-blog-dark-purple">Bloggers</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="text-gray-700 hover:text-blog-purple transition-colors font-medium"
              >
                {category.name}
              </Link>
            ))}
          </nav>

          {/* Search and Auth */}
          <div className="hidden md:flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-[180px] lg:w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </form>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate("/admin")}>
                    Dashboard
                  </Button>
                )}
                <Button variant="ghost" onClick={logout}>
                  Logout
                </Button>
              </div>
            ) : (
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="text-blog-purple hover:text-blog-dark-purple"
              >
                Admin Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <div className="flex md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 animate-fade-in">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="relative mb-4">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            </form>

            {/* Mobile Navigation */}
            <div className="flex flex-col space-y-3">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-blog-purple transition-colors py-1"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              {/* Mobile Auth */}
              <div className="pt-3 border-t border-gray-100">
                {isAuthenticated ? (
                  <div className="flex flex-col space-y-3">
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          navigate("/admin");
                          setIsMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      navigate("/login");
                      setIsMenuOpen(false);
                    }}
                    className="w-full"
                  >
                    Admin Login
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
