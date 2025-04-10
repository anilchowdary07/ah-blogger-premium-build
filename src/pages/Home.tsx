
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
    // Get featured posts
    const featured = getFeaturedPosts();
    setFeaturedPosts(featured);
    
    // Get all posts and sort by date
    const all = getAllPosts();
    const sorted = [...all].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setRecentPosts(sorted);
    setIsLoaded(true);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <h1 className="font-serif font-bold text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-blog-purple to-blog-dark-purple bg-clip-text text-transparent">
            AH<span className="text-blog-purple">Bloggers</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Premium insights and analysis from industry experts, curated just for you.
          </p>
        </motion.div>
      </motion.section>
      
      {/* Categories */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <CategoryList />
      </motion.section>
      
      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center mb-6">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold">Featured Posts</h2>
            <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
          </div>
          <motion.div 
            variants={container}
            initial="hidden"
            animate={isLoaded ? "show" : "hidden"}
            className="space-y-8"
          >
            {featuredPosts.map((post) => (
              <motion.div key={post.id} variants={item}>
                <BlogCard post={post} featured={true} />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      )}
      
      {/* Recent Posts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center mb-6">
          <h2 className="font-serif text-2xl md:text-3xl font-semibold">Recent Posts</h2>
          <div className="ml-4 h-px bg-gradient-to-r from-blog-purple to-transparent flex-grow"></div>
        </div>
        <motion.div 
          variants={container}
          initial="hidden"
          animate={isLoaded ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {recentPosts.slice(0, 6).map((post) => (
            <motion.div key={post.id} variants={item}>
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Home;
