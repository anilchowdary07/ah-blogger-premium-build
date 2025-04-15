
import { useEffect, useState } from "react";
import { getAllPosts, getFeaturedPosts, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";
import { toast } from "sonner"; 
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  
  // Use React Query for featured posts
  const { data: featuredData, isError: isFeaturedError } = useQuery({
    queryKey: ['featuredPosts'],
    queryFn: getFeaturedPosts,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // Use React Query for all posts
  const { data: allPostsData, isError: isAllPostsError } = useQuery({
    queryKey: ['allPosts'],
    queryFn: getAllPosts,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
  
  // Handle errors and update state
  useEffect(() => {
    if (isFeaturedError) {
      toast.error("Couldn't load featured posts. Showing available content.", {
        id: "featured-posts-error",
        duration: 3000
      });
    }
    
    if (isAllPostsError) {
      toast.error("Couldn't load recent posts. Showing available content.", {
        id: "recent-posts-error",
        duration: 3000
      });
    }
  }, [isFeaturedError, isAllPostsError]);
  
  // Update state when data is available
  useEffect(() => {
    if (featuredData) {
      setFeaturedPosts(featuredData);
    }
    
    if (allPostsData) {
      // Sort by date (newest first)
      const sorted = [...allPostsData].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentPosts(sorted);
    }
  }, [featuredData, allPostsData]);
  
  // Force update if we have no posts but there are posts in localStorage
  useEffect(() => {
    if (recentPosts.length === 0) {
      try {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          if (Array.isArray(parsedPosts) && parsedPosts.length > 0) {
            setRecentPosts(parsedPosts);
          }
        }
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
      }
    }
  }, [recentPosts.length]);
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <div>
          <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blog-purple to-blog-dark-purple bg-clip-text text-transparent">
            AH<span className="text-blog-purple">Bloggers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Premium insights and analysis from industry experts, curated just for you.
          </p>
        </div>
      </section>
      
      {/* Categories */}
      <section>
        <CategoryList />
      </section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <div className="flex items-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Featured Posts</h2>
            <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
          </div>
          <div className="space-y-8">
            {featuredPosts.map((post) => (
              <div key={post.id}>
                <BlogCard post={post} featured={true} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Recent Posts */}
      <section>
        <div className="flex items-center mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Recent Posts</h2>
          <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
        </div>
        {recentPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.slice(0, 6).map((post) => (
              <div key={post.id}>
                <BlogCard post={post} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h2 className="text-xl font-medium mb-2">No posts available</h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check back soon for new content!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
