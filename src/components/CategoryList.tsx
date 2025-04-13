
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCategories } from '@/services/blogService';

const CategoryList = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const location = useLocation();

  useEffect(() => {
    // Fetch all categories
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <Link
        to="/"
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          location.pathname === '/'
            ? 'bg-blog-purple text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
};

export default CategoryList;
