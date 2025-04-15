import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';
import { 
  Sun, 
  Moon, 
  Plus, 
  Edit, 
  Trash, 
  Save, 
  X, 
  Bold, 
  Italic, 
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Settings,
  LayoutDashboard,
  FileText,
  Users,
  BarChart2,
  Loader2
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Input, 
  Textarea, 
  Select, 
  Switch, 
  Toggle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Label,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui';
import { ColorPicker } from '@/components/ui/color-picker';
import { cn } from '@/lib/utils';
import { storageService } from '@/services/storageService';
import { getAllPosts, createPost, updatePost, deletePost, getFeaturedPosts } from '@/services/blogService';
import { BlogPost } from '@/services/storageService';
import { toast } from 'sonner';

// Modern color palette
const COLORS = {
  primary: {
    light: '#6366f1',
    dark: '#818cf8'
  },
  secondary: {
    light: '#8b5cf6',
    dark: '#a78bfa'
  },
  accent: {
    light: '#ec4899',
    dark: '#f472b6'
  },
  background: {
    light: '#ffffff',
    dark: '#0f172a'
  },
  text: {
    light: '#1e293b',
    dark: '#f8fafc'
  },
  border: {
    light: '#e2e8f0',
    dark: '#334155'
  }
};

// Font options
const FONT_OPTIONS = [
  { value: 'inter', label: 'Inter' },
  { value: 'poppins', label: 'Poppins' },
  { value: 'roboto', label: 'Roboto' },
  { value: 'montserrat', label: 'Montserrat' },
  { value: 'open-sans', label: 'Open Sans' }
];

// Template options
const TEMPLATE_OPTIONS = [
  { value: 'modern', label: 'Modern' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'classic', label: 'Classic' },
  { value: 'creative', label: 'Creative' }
];

const AdminDashboard: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: '',
    tags: [],
    featured: false,
    published: false
  });
  const [selectedFont, setSelectedFont] = useState('inter');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [textColor, setTextColor] = useState(COLORS.text[theme as keyof typeof COLORS.text]);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState('left');
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('posts');

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from API first
      try {
        const [allPosts, featured] = await Promise.all([
          getAllPosts(),
          getFeaturedPosts()
        ]);
        
        if (allPosts && featured) {
          setPosts(allPosts);
          setFeaturedPosts(featured);
          setRetryCount(0);
          setLoading(false);
          return;
        }
      } catch (apiError) {
        console.warn('API fetch failed, trying storage service:', apiError);
      }

      // If API fails, try storage service
      try {
        const storedPosts = await storageService.getAllPosts();
        const storedFeatured = storedPosts.filter(post => post.featured);
        
        if (storedPosts.length > 0) {
          setPosts(storedPosts);
          setFeaturedPosts(storedFeatured);
          setRetryCount(0);
          setLoading(false);
          return;
        }
      } catch (storageError) {
        console.error('Storage service failed:', storageError);
      }

      // If both fail, show error and retry if possible
      if (retryCount < MAX_RETRIES) {
        setError('Failed to fetch data. Retrying...');
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          fetchData();
        }, RETRY_DELAY);
      } else {
        setError('Failed to fetch data after multiple retries.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setFormData(prev => ({ ...prev, content: value }));
    setPreviewContent(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (selectedPost) {
        // Merge the existing post with the form data
        const updatedPost = { ...selectedPost, ...formData };
        await updatePost(updatedPost);
        toast.success('Post updated successfully');
      } else {
        // Create a new post with a generated ID
        const newPost: BlogPost = {
          ...formData as Omit<BlogPost, 'id'>,
          id: crypto.randomUUID(),
          date: new Date().toISOString().split('T')[0],
          publishedAt: formData.published ? new Date().toISOString() : undefined,
          updatedAt: new Date().toISOString()
        };
        await createPost(newPost);
        toast.success('Post created successfully');
      }
      
      setIsDialogOpen(false);
      await fetchData();
    } catch (error) {
      console.error('Error saving post:', error);
      setError('Failed to save post. Please try again.');
      toast.error('Failed to save post');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await deletePost(id);
      toast.success('Post deleted successfully');
      await fetchData();
    } catch (error) {
      console.error('Error deleting post:', error);
      setError('Failed to delete post. Please try again.');
      toast.error('Failed to delete post');
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      ...post,
      tags: post.tags || [],
      published: post.published || false,
      featured: post.featured || false
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedPost(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      author: '',
      category: '',
      tags: [],
      featured: false,
      published: false
    });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      handleDelete(postToDelete.id);
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  const applyFormatting = (format: string) => {
    const textarea = document.getElementById('content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = formData.content || '';
    const selectedText = text.substring(start, end);

    let newText = '';
    switch (format) {
      case 'bold':
        newText = text.substring(0, start) + `**${selectedText}**` + text.substring(end);
        setIsBold(!isBold);
        break;
      case 'italic':
        newText = text.substring(0, start) + `*${selectedText}*` + text.substring(end);
        setIsItalic(!isItalic);
        break;
      case 'underline':
        newText = text.substring(0, start) + `_${selectedText}_` + text.substring(end);
        setIsUnderline(!isUnderline);
        break;
    }

    setFormData(prev => ({ ...prev, content: newText }));
  };

  const handlePreview = () => {
    setIsPreviewOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="text-destructive">{error}</div>
          <Button onClick={fetchData} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              'Retry'
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-6 w-6" />
            <h1 className="text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </div>
        </div>
      </header>

      <main className="container py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="featured" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Featured
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Total Posts</h3>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Featured Posts</h3>
                  <p className="text-2xl font-bold">{featuredPosts.length}</p>
                </div>
              </Card>
              <Card>
                <div className="p-6">
                  <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                  <p className="text-2xl font-bold">
                    {new Set(posts.map(post => post.category)).size}
                  </p>
                </div>
              </Card>
            </div>

            <Card>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">{post.title}</TableCell>
                        <TableCell>{post.author}</TableCell>
                        <TableCell>{post.category}</TableCell>
                        <TableCell>
                          <span className={cn(
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
                            post.published
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          )}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => openEditDialog(post)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Post</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleDeleteClick(post)}
                                  >
                                    <Trash className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Post</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="featured" className="space-y-4">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Featured Posts</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {featuredPosts.map((post) => (
                    <Card key={post.id} className="overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-semibold mb-2">{post.title}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                          <span className="text-sm text-muted-foreground">{post.category}</span>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Analytics</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Total Views</h3>
                      <p className="text-2xl font-bold">0</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-muted-foreground">Engagement Rate</h3>
                      <p className="text-2xl font-bold">0%</p>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4">Settings</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default Font</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select font" />
                      </SelectTrigger>
                      <SelectContent>
                        {FONT_OPTIONS.map(font => (
                          <SelectItem key={font.value} value={font.value}>
                            {font.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Template</Label>
                    <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEMPLATE_OPTIONS.map(template => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Text Color</Label>
                    <ColorPicker value={textColor} onChange={setTextColor} />
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPost ? 'Edit Post' : 'Create New Post'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (Optional)</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="Will be generated from title if left empty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Label htmlFor="content">Content *</Label>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={selectedFont} onValueChange={setSelectedFont}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select font" />
                    </SelectTrigger>
                    <SelectContent>
                      {FONT_OPTIONS.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      {TEMPLATE_OPTIONS.map(template => (
                        <SelectItem key={template.value} value={template.value}>
                          {template.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <ColorPicker value={textColor} onChange={setTextColor} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Toggle
                  pressed={isBold}
                  onPressedChange={() => applyFormatting('bold')}
                  aria-label="Toggle bold"
                  className="h-8 w-8"
                >
                  <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={isItalic}
                  onPressedChange={() => applyFormatting('italic')}
                  aria-label="Toggle italic"
                  className="h-8 w-8"
                >
                  <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                  pressed={isUnderline}
                  onPressedChange={() => applyFormatting('underline')}
                  aria-label="Toggle underline"
                  className="h-8 w-8"
                >
                  <Underline className="h-4 w-4" />
                </Toggle>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTextAlign('left')}
                    className={cn("h-8 w-8", textAlign === 'left' && 'bg-muted')}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTextAlign('center')}
                    className={cn("h-8 w-8", textAlign === 'center' && 'bg-muted')}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTextAlign('right')}
                    className={cn("h-8 w-8", textAlign === 'right' && 'bg-muted')}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleContentChange}
                required
                className={cn(
                  "min-h-[300px]",
                  `font-${selectedFont}`,
                  `text-${textAlign}`
                )}
                style={{
                  fontFamily: selectedFont,
                  color: textColor,
                  textAlign: textAlign as 'left' | 'center' | 'right'
                }}
                placeholder="Write your content here..."
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="author">Author *</Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, published: checked }))}
                />
                <Label htmlFor="published">Published</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {selectedPost ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Preview</DialogTitle>
          </DialogHeader>
          <div
            className="prose prose-sm dark:prose-invert max-w-none"
            style={{
              fontFamily: selectedFont,
              color: textColor,
              textAlign: textAlign as 'left' | 'center' | 'right'
            }}
          >
            {previewContent}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the post{" "}
              <span className="font-semibold">
                "{postToDelete?.title}"
              </span>.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminDashboard;
