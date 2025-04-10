
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, Bookmark, Layers, Compass, 
  Newspaper, Library, BookOpen, Users, Tag
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = ({ isOpen }: SidebarProps) => {
  const categories = [
    { name: "Technology", slug: "technology", icon: <Layers size={18} /> },
    { name: "Science", slug: "science", icon: <Compass size={18} /> },
    { name: "Culture", slug: "culture", icon: <Newspaper size={18} /> },
    { name: "Business", slug: "business", icon: <Library size={18} /> },
  ];
  
  const menuItems = [
    { name: "Home", slug: "/", icon: <Home size={18} /> },
    { name: "Featured", slug: "/featured", icon: <Bookmark size={18} /> },
    { name: "Latest", slug: "/latest", icon: <BookOpen size={18} /> },
    { name: "Authors", slug: "/authors", icon: <Users size={18} /> },
    { name: "Tags", slug: "/tags", icon: <Tag size={18} /> },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 z-30 w-64 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'
      }`}
    >
      <ScrollArea className="h-[calc(100vh-4rem)] py-6">
        <div className="px-3">
          <div className="space-y-6">
            <div>
              <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${!isOpen && 'md:hidden'}`}>
                Navigation
              </h3>
              <ul className="mt-2 space-y-1">
                {menuItems.map((item) => (
                  <li key={item.slug}>
                    <Link
                      to={item.slug}
                      className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-blog-purple">
                        {item.icon}
                      </span>
                      <span className={`${!isOpen && 'md:hidden'}`}>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={`text-sm font-medium text-gray-500 dark:text-gray-400 ${!isOpen && 'md:hidden'}`}>
                Categories
              </h3>
              <ul className="mt-2 space-y-1">
                {categories.map((category) => (
                  <li key={category.slug}>
                    <Link
                      to={`/category/${category.slug}`}
                      className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <span className="mr-3 text-gray-500 dark:text-gray-400 group-hover:text-blog-purple">
                        {category.icon}
                      </span>
                      <span className={`${!isOpen && 'md:hidden'}`}>{category.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
};

export default Sidebar;
