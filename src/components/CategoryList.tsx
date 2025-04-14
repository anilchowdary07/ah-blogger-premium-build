
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '@/services/blogService';
import { useQuery } from '@tanstack/react-query';

const CategoryList = () => {
  const [categories, setCategories] = useState<string[]>(["technology", "science", "culture", "business"]);
  const location = useLocation();

  // Use React Query for better caching and error handling
  const { data: fetchedCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    onError: (error) => {
      console.error("Error fetching categories:", error);
      // Already using default categories from state initialization
    },
    // Don't retry too many times to avoid overwhelming the server
    retry: 1,
    // Use stale data if available while revalidating
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update categories when data is fetched successfully
  useEffect(() => {
    if (fetchedCategories && fetchedCategories.length > 0) {
      setCategories(fetchedCategories);
    }
  }, [fetchedCategories]);

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          location.pathname === '/'
            ? 'bg-blog-purple text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
        }`}
      >
        All
      </Link>
      {categories.map((category) => (
        <Link
          key={category}
          to={`/category/${category}`}
          className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
            location.pathname === `/category/${category}`
              ? 'bg-blog-purple text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
