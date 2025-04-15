// Blog service that connects to SQLite database via Netlify Functions
import { toast } from "sonner";
import { storageService } from './storageService';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readingTime: number;
  featured: boolean;
  published?: boolean;
  publishedAt?: string;
  updatedAt?: string;
}

// Use relative API URL for both development and production
const API_URL = '/api/posts';

// Add direct posts endpoint as a fallback
const POSTS_URL = "/posts";

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback to initial blog posts if the API is not available
export const initialBlogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Artificial Intelligence in Content Creation",
    slug: "future-ai-content-creation",
    excerpt: "Exploring how AI is revolutionizing content creation and what it means for writers and creators in the digital age.",
    content: `<p>Artificial Intelligence (AI) has rapidly transformed numerous industries, and content creation is no exception. Advanced language models like GPT-4 have demonstrated remarkable abilities in generating human-like text, sparking both excitement and concern among professional writers.</p>`,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad695",
    author: "Dr. Sarah Chen",
    date: "2024-04-05",
    category: "technology",
    tags: ["artificial intelligence", "content creation", "digital media"],
    readingTime: 6,
    featured: true,
    published: true,
    publishedAt: "2024-04-05T10:30:00Z",
    updatedAt: "2024-04-05T10:30:00Z",
  },
  // ... rest of the initial posts ...
];

// Get all unique categories from posts
export const getCategories = async (): Promise<string[]> => {
  try {
    const posts = await storageService.getAllPosts();
    const categories = new Set(posts.map(post => post.category));
    return Array.from(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Get a post by its slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    return await storageService.getPostBySlug(slug);
  } catch (error) {
    console.error('Error fetching post by slug:', error);
    return undefined;
  }
};

// Get featured posts
export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    return await storageService.getFeaturedPosts();
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
};

// Initialize the database with initial posts if empty
export const initializeDatabase = async () => {
  try {
    await storageService.initialize();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Helper function to handle errors
const handleError = (error: Error) => {
  console.error('Error:', error);
  toast.error(error.message || 'An error occurred');
  throw error;
};

// Get all posts
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const posts = await storageService.getAllPosts();
    if (posts.length > 0) {
      return posts;
    }
    return initialBlogPosts;
  } catch (error) {
    console.error('Error in getAllPosts:', error);
    return initialBlogPosts;
  }
};

// Search posts by query
export const searchPosts = async (query: string): Promise<BlogPost[]> => {
  try {
    const posts = await storageService.getAllPosts();
    const searchTerms = query.toLowerCase().split(' ');
    return posts.filter(post => {
      const searchableText = `${post.title} ${post.content} ${post.excerpt} ${post.tags.join(' ')}`.toLowerCase();
      return searchTerms.every(term => searchableText.includes(term));
    });
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
};

// Get posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    return await storageService.getPostsByCategory(category);
  } catch (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }
};

// Create a new blog post
export const createPost = async (post: Omit<BlogPost, 'id'>): Promise<BlogPost> => {
  try {
    const newPost: BlogPost = {
      ...post,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      publishedAt: post.published ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString()
    };
    await storageService.savePost(newPost);
    return newPost;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// Update an existing blog post
export const updatePost = async (post: BlogPost): Promise<BlogPost> => {
  try {
    const updatedPost = {
      ...post,
      updatedAt: new Date().toISOString()
    };
    await storageService.savePost(updatedPost);
    return updatedPost;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// Delete a blog post
export const deletePost = async (id: string): Promise<void> => {
  try {
    await storageService.deletePost(id);
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};
