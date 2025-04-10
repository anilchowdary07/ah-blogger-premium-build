
import { useState, useEffect } from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

const TableOfContents = () => {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Find all heading elements in the blog content
    const elements = Array.from(document.querySelectorAll('.blog-content h2, .blog-content h3'));
    
    // Create TOC items from headings
    const items = elements.map((element) => {
      const id = element.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
      
      // Assign IDs to headings without them
      if (!element.id) {
        element.id = id;
      }
      
      return {
        id,
        text: element.textContent || "",
        level: parseInt(element.tagName.substring(1)) // Get heading level (2 for h2, 3 for h3)
      };
    });
    
    setHeadings(items);
    
    // Setup intersection observer to highlight active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );
    
    elements.forEach((element) => observer.observe(element));
    
    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, []);
  
  if (headings.length === 0) return null;

  return (
    <div className="relative bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm">
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
          <ArrowDownWideNarrow size={16} className="mr-2" />
          Table of Contents
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isOpen ? 'Hide' : 'Show'}
        </span>
      </div>
      
      {isOpen && (
        <nav className="mt-3 text-sm">
          <ul className="space-y-1 ml-4">
            {headings.map((heading) => (
              <li 
                key={heading.id} 
                className={`py-1 ${heading.level === 3 ? 'pl-4' : ''}`}
              >
                <a 
                  href={`#${heading.id}`}
                  className={`text-gray-600 dark:text-gray-300 hover:text-blog-purple dark:hover:text-blog-light-purple transition-colors ${
                    activeId === heading.id ? 'text-blog-purple dark:text-blog-light-purple font-medium' : ''
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth'
                    });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;
