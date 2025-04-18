
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostsByCategory, BlogPost, getAllPosts } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);

  // Use React Query with proper configuration for v5
  const { isLoading, data, error, isError } = useQuery({
    queryKey: ['posts', category],
    queryFn: () => category ? getPostsByCategory(category) : Promise.resolve([]),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false
  });

  // Fallback query to get all posts if category-specific query fails
  const { data: allPostsData } = useQuery({
    queryKey: ['allPosts'],
    queryFn: getAllPosts,
    retry: 3,
    enabled: isError, // Only run this query if the category-specific query fails
    staleTime: 30000
  });

  // Handle errors with useEffect
  useEffect(() => {
    if (isError) {
      toast.error(`Failed to load ${category} posts. Showing available content.`, {
        id: "category-posts-error",
        duration: 3000
      });
      console.error(`Error fetching posts by category ${category}:`, error);
      
      // If we have all posts data, filter by category as fallback
      if (allPostsData) {
        const filteredPosts = allPostsData.filter(post => 
          post.category === category
        );
        setPosts(filteredPosts);
      }
    }
  }, [isError, error, category, allPostsData]);

  // Update posts when data changes
  useEffect(() => {
    if (data && data.length > 0) {
      setPosts(data);
      // Scroll to top with smooth animation
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  // Try to get posts from localStorage if we have no posts
  useEffect(() => {
    if (posts.length === 0 && !isLoading) {
      try {
        const savedPosts = localStorage.getItem('blogPosts');
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          if (Array.isArray(parsedPosts)) {
            const filteredPosts = parsedPosts.filter(post => post.category === category);
            if (filteredPosts.length > 0) {
              setPosts(filteredPosts);
            }
          }
        }
      } catch (e) {
        console.warn('Failed to read from localStorage:', e);
      }
    }
  }, [posts.length, isLoading, category]);

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
