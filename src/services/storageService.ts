import { BlogPost } from './blogService';
import { toast } from 'sonner';

// Use the correct Netlify Functions endpoint
const API_URL = '/.netlify/functions/server';

// Local storage key for posts
const LOCAL_STORAGE_KEY = 'blog_posts';

// Local data that will always work
const localPosts: BlogPost[] = [
  {
    id: "1",
    title: "Welcome to Our Blog",
    slug: "welcome-to-our-blog",
    content: "Welcome to our blog! This is a sample post that shows how the blog works.",
    excerpt: "A welcome post to get you started",
    coverImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643",
    author: "Admin",
    date: new Date().toISOString(),
    category: "general",
    tags: ["welcome"],
    readingTime: 2,
    featured: true,
    published: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

class StorageService {
  private static instance: StorageService;
  private posts: BlogPost[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Try to load posts from local storage first
      const savedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedPosts) {
        this.posts = JSON.parse(savedPosts);
      } else {
        this.posts = [...localPosts];
      }

      // Try to fetch from API
      const apiPosts = await this.fetchFromApi();
      if (apiPosts.length > 0) {
        this.posts = apiPosts;
        this.saveToLocalStorage();
      }

      this.isInitialized = true;
      console.log('Storage service initialized with', this.posts.length, 'posts');
    } catch (error) {
      console.error('Error initializing storage service:', error);
      this.posts = [...localPosts];
      this.isInitialized = true;
    }
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this.posts));
    } catch (error) {
      console.error('Error saving to local storage:', error);
    }
  }

  private async fetchFromApi(): Promise<BlogPost[]> {
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          return posts;
        }
      }
      return [];
    } catch (error) {
      console.error('API fetch error:', error);
      return [];
    }
  }

  async getAllPosts(): Promise<BlogPost[]> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const response = await fetch(`${API_URL}/posts`);
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          this.posts = posts;
          this.saveToLocalStorage();
          return posts;
        }
      }
    } catch (error) {
      console.log('Using cached posts data due to error:', error);
    }
    
    return this.posts;
  }

  async getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const response = await fetch(`${API_URL}/posts/${slug}`);
      if (response.ok) {
        const post = await response.json();
        return post;
      }
    } catch (error) {
      console.log(`Could not fetch post ${slug} from API:`, error);
    }
    
    return this.posts.find(post => post.slug === slug);
  }

  async getFeaturedPosts(): Promise<BlogPost[]> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const response = await fetch(`${API_URL}/posts?featured=true`);
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          return posts;
        }
      }
    } catch (error) {
      console.log('Error fetching featured posts:', error);
    }
    
    return this.posts.filter(post => post.featured);
  }

  async getPostsByCategory(category: string): Promise<BlogPost[]> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const response = await fetch(`${API_URL}/posts?category=${encodeURIComponent(category)}`);
      if (response.ok) {
        const posts = await response.json();
        if (Array.isArray(posts)) {
          return posts;
        }
      }
    } catch (error) {
      console.log(`Error fetching posts for category ${category}:`, error);
    }
    
    return this.posts.filter(post => post.category === category);
  }

  async savePost(post: BlogPost): Promise<boolean> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      // Validate required fields before saving
      if (!post.title || !post.slug || !post.content) {
        throw new Error('Post must have title, slug, and content');
      }
      
      // If updating an existing post, use PUT, otherwise POST
      const isUpdate = this.posts.some(p => p.id === post.id);
      const method = isUpdate ? 'PUT' : 'POST';
      const url = isUpdate ? `${API_URL}/posts/${post.id}` : `${API_URL}/posts`;
      
      // Ensure post has required timestamps
      if (!post.date) post.date = new Date().toISOString();
      post.updatedAt = new Date().toISOString();
      if (!post.publishedAt && post.published) {
        post.publishedAt = new Date().toISOString();
      }
      
      // Send to API
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(post),
        credentials: 'include', // Include cookies for auth if needed
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Server error:', errorData);
        throw new Error(`Failed to save post: ${response.status} ${response.statusText}`);
      }
      
      // Update local cache
      if (isUpdate) {
        this.posts = this.posts.map(p => p.id === post.id ? post : p);
      } else {
        this.posts.push(post);
      }
      
      this.saveToLocalStorage();
      toast.success(`Post "${post.title}" saved successfully`);
      return true;
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error(`Failed to save post: ${error.message}`);
      
      // Save to local storage anyway as backup
      const existingIndex = this.posts.findIndex(p => p.id === post.id);
      if (existingIndex >= 0) {
        this.posts[existingIndex] = post;
      } else {
        this.posts.push(post);
      }
      this.saveToLocalStorage();
      
      return false;
    }
  }

  async deletePost(id: string): Promise<boolean> {
    if (!this.isInitialized) await this.initialize();
    
    try {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        credentials: 'include', // Include cookies for auth if needed
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete post: ${response.status} ${response.statusText}`);
      }
      
      // Update local cache
      this.posts = this.posts.filter(post => post.id !== id);
      this.saveToLocalStorage();
      toast.success('Post deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error(`Failed to delete post: ${error.message}`);
      
      // Remove from local storage anyway
      this.posts = this.posts.filter(post => post.id !== id);
      this.saveToLocalStorage();
      
      return false;
    }
  }
}

export const storageService = StorageService.getInstance(); 