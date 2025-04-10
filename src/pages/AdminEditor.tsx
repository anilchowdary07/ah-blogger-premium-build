
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostBySlug, createPost, updatePost } from "@/services/blogService";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

const AdminEditor = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEditMode = !!slug;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [slug_, setSlug_] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("technology");
  const [tags, setTags] = useState("");
  const [readingTime, setReadingTime] = useState(5);
  const [featured, setFeatured] = useState(false);

  useEffect(() => {
    if (isEditMode && slug) {
      const post = getPostBySlug(slug);
      if (post) {
        setTitle(post.title);
        setSlug_(post.slug);
        setExcerpt(post.excerpt);
        setContent(post.content);
        setCoverImage(post.coverImage);
        setAuthor(post.author);
        setCategory(post.category);
        setTags(post.tags.join(", "));
        setReadingTime(post.readingTime);
        setFeatured(post.featured);
      } else {
        toast.error("Post not found.");
        navigate("/admin");
      }
    } else {
      // Default values for new post
      setAuthor("Admin User");
    }
    
    setLoading(false);
  }, [slug, isEditMode, navigate]);

  const generateSlugFromTitle = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Only auto-generate slug if this is a new post or slug hasn't been manually edited
    if (!isEditMode) {
      setSlug_(generateSlugFromTitle(newTitle));
    }
  };

  const handleSave = () => {
    // Basic validation
    if (!title || !slug_ || !excerpt || !content || !coverImage || !author || !category) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    setSaving(true);
    
    try {
      const tagsArray = tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
      
      const postData = {
        title,
        slug: slug_,
        excerpt,
        content,
        coverImage,
        author,
        date: new Date().toISOString().split("T")[0],
        category,
        tags: tagsArray,
        readingTime: readingTime || 5,
        featured,
      };
      
      if (isEditMode) {
        const post = getPostBySlug(slug!);
        if (post) {
          updatePost(post.id, postData);
          toast.success("Post updated successfully.");
        }
      } else {
        createPost(postData);
        toast.success("Post created successfully.");
      }
      
      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save post.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blog-purple" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/admin")}
            className="mr-4"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back
          </Button>
          <h1 className="font-serif font-bold text-2xl md:text-3xl">
            {isEditMode ? "Edit Post" : "Create New Post"}
          </h1>
        </div>
        
        <Button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-blog-purple hover:bg-blog-dark-purple"
          disabled={saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save size={18} />}
          {saving ? "Saving..." : "Save Post"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          {/* Title */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Post title"
                  value={title}
                  onChange={handleTitleChange}
                  className="text-lg"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Excerpt */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  placeholder="Brief summary of your post"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Content */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="content">Content (HTML)</Label>
                <Textarea
                  id="content"
                  placeholder="Post content in HTML format"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[400px] font-mono text-sm"
                />
                <p className="text-sm text-gray-500">
                  HTML formatting is supported. Use &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, etc. for structuring your content.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Sidebar with meta */}
        <div className="space-y-6">
          {/* Slug */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  placeholder="post-url-slug"
                  value={slug_}
                  onChange={(e) => setSlug_(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Cover Image */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Cover Image URL</Label>
                <Input
                  id="coverImage"
                  placeholder="https://example.com/image.jpg"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                />
                {coverImage && (
                  <div className="mt-4 rounded-md overflow-hidden">
                    <img 
                      src={coverImage} 
                      alt="Cover preview" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Category */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          {/* Author */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  placeholder="Author name"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Tags */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="technology, AI, software"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Reading Time */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-2">
                <Label htmlFor="readingTime">Reading Time (minutes)</Label>
                <Input
                  id="readingTime"
                  type="number"
                  value={readingTime}
                  onChange={(e) => setReadingTime(parseInt(e.target.value) || 0)}
                  min="1"
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Featured */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={featured}
                  onCheckedChange={(checked) => setFeatured(checked === true)}
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Featured post
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminEditor;
