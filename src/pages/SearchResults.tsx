
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchPosts, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Get the search query from URL
  useEffect(() => {
    const searchQuery = searchParams.get("q") || "";
    setQuery(searchQuery);
    
    if (searchQuery) {
      setIsSearching(true);
      // Search posts
      const results = searchPosts(searchQuery);
      setPosts(results);
      setIsSearching(false);
    } else {
      setPosts([]);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  return (
    <div>
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-6">
        Search Results
      </h1>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles..."
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={isSearching}>
          {isSearching ? "Searching..." : "Search"}
        </Button>
      </form>

      {/* Results count */}
      {query && (
        <p className="text-gray-600 mb-6">
          {posts.length} {posts.length === 1 ? "result" : "results"} for "{query}"
        </p>
      )}

      {/* Results */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : query ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No results found</h2>
          <p className="text-gray-600">
            Try adjusting your search terms or browse categories for relevant content.
          </p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-600">
            Enter a search term to find relevant articles.
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
