
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, Edit, User } from "lucide-react";
import { getPostBySlug, BlogPost } from "@/services/blogService";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (slug) {
      const fetchedPost = getPostBySlug(slug);
      setPost(fetchedPost || null);
      setLoading(false);

      // Scroll to top when post changes
      window.scrollTo(0, 0);
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-3xl">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="text-2xl font-semibold mb-4">Post Not Found</h1>
        <p className="text-gray-600 mb-6">The blog post you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto">
      {/* Admin Actions */}
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => navigate(`/admin/edit/${post.slug}`)}
          >
            <Edit size={16} />
            Edit Post
          </Button>
        </div>
      )}

      {/* Header */}
      <header className="mb-8">
        <Link to={`/category/${post.category}`}>
          <Badge variant="outline" className="mb-4 text-sm font-medium bg-blog-light-purple text-blog-purple hover:bg-blog-purple hover:text-white">
            {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
          </Badge>
        </Link>

        <h1 className="font-serif font-bold text-3xl md:text-4xl lg:text-5xl text-gray-900 mb-6">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-6 text-gray-600">
          <div className="flex items-center gap-2">
            <User size={18} />
            <span>{post.author}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon size={18} />
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{post.readingTime} min read</span>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="mb-8 rounded-lg overflow-hidden">
        <img 
          src={`${post.coverImage}?w=1200&auto=format&q=75`}
          alt={post.title}
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Content */}
      <div 
        className="blog-content prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="mt-10 pt-6 border-t">
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span 
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BlogPost;
