// Blog service that uses local storage
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

// Get all posts
export const getAllPosts = async (): Promise<BlogPost[]> => {
  try {
    return await storageService.getAllPosts();
  } catch (error) {
    console.error('Error getting posts:', error);
    return [];
  }
};

// Get a post by its slug
export const getPostBySlug = async (slug: string): Promise<BlogPost | undefined> => {
  try {
    return await storageService.getPostBySlug(slug);
  } catch (error) {
    console.error('Error getting post by slug:', error);
    return undefined;
  }
};

// Get featured posts
export const getFeaturedPosts = async (): Promise<BlogPost[]> => {
  try {
    return await storageService.getFeaturedPosts();
  } catch (error) {
    console.error('Error getting featured posts:', error);
    return [];
  }
};

// Get posts by category
export const getPostsByCategory = async (category: string): Promise<BlogPost[]> => {
  try {
    return await storageService.getPostsByCategory(category);
  } catch (error) {
    console.error('Error getting posts by category:', error);
    return [];
  }
};

// Get all unique categories from posts
export const getCategories = async (): Promise<string[]> => {
  try {
    const posts = await storageService.getAllPosts();
    const categories = new Set(posts.map(post => post.category));
    return Array.from(categories);
  } catch (error) {
    console.error('Error getting categories:', error);
    return [];
  }
};

// Initialize the service
export const initializeDatabase = async () => {
  try {
    await storageService.initialize();
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
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
