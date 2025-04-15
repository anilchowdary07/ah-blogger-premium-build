
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '@/services/blogService';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

const CategoryList = () => {
  // Define default categories in case API fails
  const [categories, setCategories] = useState<string[]>(["technology", "science", "culture", "business"]);
  const location = useLocation();

  // Use React Query with better retry logic
  const { data: fetchedCategories, isError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    retry: 3,
    retryDelay: 1000,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchInterval: false,
    onError: () => {
      toast.error("Couldn't load categories. Using defaults.", {
        id: "categories-error",
        duration: 3000
      });
    }
  });

  // Update categories when data is available
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
