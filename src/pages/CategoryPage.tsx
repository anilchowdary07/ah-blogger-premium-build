
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostsByCategory, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Use React Query with better retry logic and proper error handling
  const { isLoading, data, error } = useQuery({
    queryKey: ['posts', category],
    queryFn: () => category ? getPostsByCategory(category) : Promise.resolve([]),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    // Handle errors with onSettled instead of onError
    onSettled: (data, error) => {
      if (error) {
        toast.error(`Failed to load ${category} posts. Showing available content.`, {
          id: "category-posts-error",
          duration: 3000
        });
        console.error(`Error fetching posts by category ${category}:`, error);
      }
    }
  });

  // Update posts when data changes
  useEffect(() => {
    if (data) {
      setPosts(data);
      // Scroll to top with smooth animation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  // Handle errors with useEffect
  useEffect(() => {
    if (error) {
      console.error(`Error fetching posts by category ${category}:`, error);
    }
  }, [error, category]);

  if (isLoading) {
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
    <div className="pb-12">
      <div className="mb-8">
        <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2 capitalize 
                      bg-gradient-to-r from-blog-purple to-blog-dark-purple bg-clip-text text-transparent
                      relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] 
                      after:w-24 after:bg-blog-purple after:rounded">
          {category}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Explore our collection of articles about {category}.
        </p>
      </div>

      <div className="mb-10">
        <CategoryList />
      </div>

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id}>
              <BlogCard post={post} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <h2 className="text-xl font-medium mb-2">No posts found</h2>
          <p className="text-gray-600 dark:text-gray-400">
            There are currently no posts in the {category} category.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
