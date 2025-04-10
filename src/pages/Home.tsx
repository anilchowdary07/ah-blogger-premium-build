
import { useEffect, useState } from "react";
import { getAllPosts, getFeaturedPosts, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";

const Home = () => {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<BlogPost[]>([]);
  
  useEffect(() => {
    // Get featured posts
    const featured = getFeaturedPosts();
    setFeaturedPosts(featured);
    
    // Get all posts and sort by date
    const all = getAllPosts();
    const sorted = [...all].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentPosts(sorted);
  }, []);
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center mb-12">
        <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
          AH<span className="text-blog-purple">Bloggers</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600">
          Premium insights and analysis from industry experts, curated just for you.
        </p>
      </section>
      
      {/* Categories */}
      <section>
        <CategoryList />
      </section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section>
          <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">Featured Posts</h2>
          <div className="space-y-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.id} post={post} featured={true} />
            ))}
          </div>
        </section>
      )}
      
      {/* Recent Posts */}
      <section>
        <h2 className="font-serif text-2xl md:text-3xl font-semibold mb-6">Recent Posts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.slice(0, 6).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
