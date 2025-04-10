
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Edit, Trash2, Plus, FileText } from "lucide-react";
import { getAllPosts, BlogPost, deletePost } from "@/services/blogService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<BlogPost | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get all posts and sort by date (newest first)
    const allPosts = getAllPosts();
    const sortedPosts = [...allPosts].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setPosts(sortedPosts);
  }, []);

  const handleDeleteClick = (post: BlogPost) => {
    setPostToDelete(post);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (postToDelete) {
      try {
        deletePost(postToDelete.id);
        setPosts(posts.filter(post => post.id !== postToDelete.id));
        toast.success(`"${postToDelete.title}" has been deleted.`);
      } catch (error) {
        toast.error("Failed to delete post.");
        console.error(error);
      }
      
      setIsDeleteDialogOpen(false);
      setPostToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your blog posts</p>
        </div>
        <Button 
          onClick={() => navigate("/admin/new")} 
          className="flex items-center gap-2 bg-blog-purple hover:bg-blog-dark-purple"
        >
          <Plus size={18} />
          New Post
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{posts.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Featured Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{posts.filter(post => post.featured).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {new Set(posts.map(post => post.category)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Posts Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Posts</CardTitle>
          <CardDescription>Manage and edit your blog posts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Title</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Category</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Featured</th>
                  <th className="py-3 px-4 text-center font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <FileText size={16} className="mr-2 text-gray-400" />
                        <Link 
                          to={`/blog/${post.slug}`}
                          className="font-medium text-gray-900 hover:text-blog-purple"
                        >
                          {post.title.length > 50 ? `${post.title.substring(0, 50)}...` : post.title}
                        </Link>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize">{post.category}</span>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(post.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {post.featured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : "—"}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/admin/edit/${post.slug}`)}
                          className="text-gray-500 hover:text-blog-purple"
                        >
                          <Edit size={16} />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteClick(post)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-gray-500">
                      No posts found. Create your first post!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
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
              className="bg-red-500 hover:bg-red-600"
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
