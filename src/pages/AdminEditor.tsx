import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Save, ArrowLeft, Trash2, Eye } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock API functions - replace with actual API calls
const fetchPost = async (slug: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));
  
  // This would be an API call in a real app
  const post = {
    id: "1",
    title: "How to Build a Blog with React",
    slug: "how-to-build-blog-react",
    content: "This is a comprehensive guide to building a blog with React...",
    excerpt: "Learn the fundamentals of creating a blog with React and modern tools",
    category: "technology",
    tags: ["react", "javascript", "web development"],
    featured: true,
    published: true,
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    coverImage: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
  };
  
  return post;
};

const createPost = async (postData: any) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // This would be an API call in a real app
  return {
    ...postData,
    id: Math.random().toString(36).substring(2, 9),
    slug: postData.slug || postData.title.toLowerCase().replace(/\s+/g, "-"),
    publishedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

const updatePost = async (postData: any) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // This would be an API call in a real app
  return {
    ...postData,
    updatedAt: new Date().toISOString(),
  };
};

const deletePost = async (id: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // This would be an API call in a real app
  return { success: true };
};

// Form schema
const postFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().optional(),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
  category: z.string().min(1, "Please select a category"),
  tags: z.array(z.string()).optional(),
  coverImage: z.string().url("Please enter a valid URL").optional(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

type PostFormValues = z.infer<typeof postFormSchema>;

const AdminEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(slug);
  
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  
  // Fetch post data if in edit mode
  const { data: post, isLoading: isLoadingPost } = useQuery({
    queryKey: ["post", slug],
    queryFn: () => fetchPost(slug as string),
    enabled: isEditMode,
    staleTime: Infinity, // Don't refetch automatically
  });
  
  // Form setup
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      category: "",
      tags: [],
      coverImage: "",
      featured: false,
      published: false,
    },
  });
  
  // Update form when post data is loaded
  useEffect(() => {
    if (post) {
      form.reset({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt,
        category: post.category,
        tags: post.tags,
        coverImage: post.coverImage,
        featured: post.featured,
        published: post.published,
      });
      setTags(post.tags || []);
    }
  }, [post, form]);
  
  // Create mutation
  const createMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully!");
      navigate(`/admin/edit/${data.slug}`);
    },
    onError: () => {
      toast.error("Failed to create post. Please try again.");
    },
  });
  
  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updatePost,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", slug] });
      toast.success("Post updated successfully!");
    },
    onError: () => {
      toast.error("Failed to update post. Please try again.");
    },
  });
  
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully!");
      navigate("/admin");
    },
    onError: () => {
      toast.error("Failed to delete post. Please try again.");
    },
  });
  
  // Handle form submission
  const onSubmit = (values: PostFormValues) => {
    const postData = {
      ...values,
      tags,
      slug: values.slug || values.title.toLowerCase().replace(/\s+/g, "-"),
    };
    
    if (isEditMode && post) {
      updateMutation.mutate({ ...post, ...postData });
    } else {
      createMutation.mutate(postData);
    }
  };
  
  // Handle tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        const newTags = [...tags, tagInput.trim()];
        setTags(newTags);
        form.setValue("tags", newTags);
      }
      setTagInput("");
    }
  };
  
  // Remove tag
  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter((tag) => tag !== tagToRemove);
    setTags(newTags);
    form.setValue("tags", newTags);
  };
  
  // Auto-generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }, []);
  
  // Update slug when title changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "title" && value.title) {
        form.setValue("slug", generateSlug(value.title as string));
      }
    });
    
    return () => subscription.unsubscribe();
  }, [form, generateSlug]);
  
  // Handle delete confirmation
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this post? This action cannot be undone.")) {
      if (post) {
        deleteMutation.mutate(post.id);
      }
    }
  };
  
  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const isDeleting = deleteMutation.isPending;
  
  if (isLoadingPost && isEditMode) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-serif font-bold">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {previewMode ? "Edit" : "Preview"}
          </Button>
          {isEditMode && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          )}
        </div>
      </div>

      {previewMode ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl">{form.getValues("title")}</CardTitle>
            <CardDescription>{form.getValues("excerpt")}</CardDescription>
          </CardHeader>
          {form.getValues("coverImage") && (
            <img
              src={form.getValues("coverImage")}
              alt={form.getValues("title")}
              className="w-full h-64 object-cover"
            />
          )}
          <CardContent className="pt-6">
            <div className="blog-content prose dark:prose-invert max-w-none">
              {form.getValues("content").split("\n").map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Badge variant="outline">{form.getValues("category")}</Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </CardFooter>
        </Card>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>
                    Enter the main content for your blog post
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="post-url-slug" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Brief summary of the post"
                            className="resize-none"
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your post content here..."
                            className="min-h-[300px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Post Settings</CardTitle>
                    <CardDescription>
                      Configure metadata and publishing options
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="coverImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cover Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technology">Technology</SelectItem>
                              <SelectItem value="science">Science</SelectItem>
                              <SelectItem value="culture">Culture</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div>
                      <FormLabel>Tags</FormLabel>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(tag)}
                              className="ml-1 text-xs hover:text-destructive"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <Input
                        placeholder="Add tags (press Enter)"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Publishing Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="featured"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Featured Post</FormLabel>
                            <FormDescription>
                              Display this post in featured sections
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <Separator />
                    
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                          <div className="space-y-0.5">
                            <FormLabel>Published</FormLabel>
                            <FormDescription>
                              Make this post publicly visible
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                  <CardFooter>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      <Save className="mr-2 h-4 w-4" />
                      {isEditMode ? "Update Post" : "Create Post"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      )}
    </motion.div>
  );
};

export default AdminEditor;
