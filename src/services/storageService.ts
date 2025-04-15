import { BlogPost } from './blogService';

const API_URL = '/api/posts';

class StorageService {
  private static instance: StorageService;
  private initialized: boolean = false;

  private constructor() {
    this.initialized = true;
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async initialize(): Promise<void> {
    if (!this.initialized) {
      this.initialized = true;
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  async getPost(id: string): Promise<BlogPost | undefined> {
    try {
      const posts = await this.getAllPosts();
      return posts.find(post => post.id === id);
    } catch (error) {
      console.error('Error fetching post:', error);
      return undefined;
    }
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    try {
      const posts = await this.getAllPosts();
      return posts.find(post => post.slug === slug);
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      return undefined;
    }
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter(post => post.featured);
    } catch (error) {
      console.error('Error fetching featured posts:', error);
      return [];
    }
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    try {
      const posts = await this.getAllPosts();
      return posts.filter(post => post.category === category);
    } catch (error) {
      console.error('Error fetching posts by category:', error);
      return [];
    }
  }

  async savePost(post: BlogPost): Promise<void> {
    try {
      const method = post.id ? 'PUT' : 'POST';
      const response = await fetch(API_URL, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post),
      });

      if (!response.ok) {
        throw new Error('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      throw error;
    }
  }

  async deletePost(id: string): Promise<void> {
    try {
      const response = await fetch(API_URL, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}

export const storageService = StorageService.getInstance(); 