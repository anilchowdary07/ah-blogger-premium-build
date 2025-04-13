
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsByCategory, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";
import { motion } from "framer-motion";
import { toast } from "sonner";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      const fetchPosts = async () => {
        setLoading(true);
        try {
          // Get posts by category
          const categoryPosts = await getPostsByCategory(category);
          setPosts(categoryPosts);
        } catch (error) {
          console.error("Error fetching posts by category:", error);
          toast.error(`Failed to load ${category} posts. Showing cached content.`);
          setPosts([]);
        } finally {
          setLoading(false);
        }
      };

      fetchPosts();
      // Scroll to top with smooth animation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [category]);

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

  const titleAnimation = {
    hidden: { opacity: 0, y: -20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="pb-12"
    >
      <motion.div
        variants={titleAnimation}
        initial="hidden"
        animate="show"
        className="mb-8"
      >
        <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2 capitalize 
                      bg-gradient-to-r from-blog-purple to-blog-dark-purple bg-clip-text text-transparent
                      relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                      after:w-24 after:bg-blog-purple after:rounded">
          {category}
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-600 dark:text-gray-300"
        >
          Explore our collection of articles about {category}.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mb-10"
      >
        <CategoryList />
      </motion.div>

      {posts.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {posts.map((post) => (
            <motion.div 
              key={post.id} 
              variants={item}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 }
              }}
            >
              <BlogCard post={post} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          <h2 className="text-xl font-medium mb-2">No posts found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no posts in the {category} category.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CategoryPage;
