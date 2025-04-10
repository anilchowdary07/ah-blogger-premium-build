
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostsByCategory, BlogPost } from "@/services/blogService";
import BlogCard from "@/components/BlogCard";
import CategoryList from "@/components/CategoryList";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (category) {
      // Get posts by category
      const categoryPosts = getPostsByCategory(category);
      setPosts(categoryPosts);
      setLoading(false);

      // Scroll to top
      window.scrollTo(0, 0);
    }
  }, [category]);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="h-48 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-serif font-bold text-3xl md:text-4xl mb-4 capitalize">
        {category}
      </h1>
      <p className="text-gray-600 mb-8">
        Explore our collection of articles about {category}.
      </p>

      <CategoryList />

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No posts found</h2>
          <p className="text-gray-600">
            There are currently no posts in the {category} category.
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
