
import { Link } from "react-router-dom";
import { CalendarIcon, Clock } from "lucide-react";
import { BlogPost } from "@/services/blogService";
import { Badge } from "@/components/ui/badge";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

const BlogCard = ({ post, featured = false }: BlogCardProps) => {
  return (
    <article 
      className={`overflow-hidden transition-all duration-200 rounded-lg ${
        featured 
          ? "md:grid md:grid-cols-2 gap-6 shadow-smooth" 
          : "flex flex-col h-full hover:shadow-smooth"
      }`}
    >
      {/* Image */}
      <Link 
        to={`/blog/${post.slug}`} 
        className={`block overflow-hidden ${featured ? "h-full max-h-[350px]" : "h-48"}`}
      >
        <img 
          src={`${post.coverImage}?w=800&auto=format&q=75`} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </Link>
      
      {/* Content */}
      <div className={`flex flex-col ${featured ? "p-6" : "p-4"} flex-grow`}>
        {/* Category */}
        <div className="mb-2">
          <Link to={`/category/${post.category}`}>
            <Badge variant="outline" className="text-xs font-medium bg-blog-light-purple text-blog-purple hover:bg-blog-purple hover:text-white">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </Badge>
          </Link>
        </div>
        
        {/* Title */}
        <Link to={`/blog/${post.slug}`} className="group">
          <h2 
            className={`font-serif font-semibold text-gray-900 group-hover:text-blog-purple transition-colors ${
              featured ? "text-2xl md:text-3xl mb-3" : "text-xl mb-2"
            }`}
          >
            {post.title}
          </h2>
        </Link>
        
        {/* Excerpt */}
        <p className={`text-gray-600 mb-4 ${featured ? "" : "line-clamp-3"}`}>
          {post.excerpt}
        </p>
        
        {/* Meta */}
        <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <CalendarIcon size={14} className="mr-1" />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
