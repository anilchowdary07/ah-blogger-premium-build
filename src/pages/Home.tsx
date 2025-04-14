
import { useEffect, useState } from "react";
import { getAllPosts, getFeaturedPosts, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";
import { motion } from "framer-motion";

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Get featured posts
        const featured = await getFeaturedPosts();
        setFeaturedPosts(featured);
        
        // Get all posts and sort by date
        const all = await getAllPosts();
        const sorted = [...all].sort((a, b) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setRecentPosts(sorted);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setIsLoaded(true);
      }
    };
    
    fetchPosts();
  }, []);
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center mb-12 animate-fade-in">
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
      <section className="animate-fade-in">
        <CategoryList />
      </section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="animate-fade-in">
          <div className="flex items-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Featured Posts</h2>
            <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
          </div>
          <div className="space-y-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="animate-fade-in">
                <BlogCard post={post} featured={true} />
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Recent Posts */}
      <section className="animate-fade-in">
        <div className="flex items-center mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Recent Posts</h2>
          <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.slice(0, 6).map((post) => (
            <div key={post.id} className="animate-fade-in">
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
