import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  Save, 
  X, 
  Download, 
  Star,
  FileText,
  Calendar,
  User,
  Tag
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { managementAPI, Guide } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function GuideManagement() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Document Requirements",
    order: 1,
    tags: [] as string[],
    featured: false,
    file: null as File | null,
  });
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    order: 1,
    tags: [] as string[],
    featured: false,
    file: null as File | null,
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);

  // Fetch guides on component mount
  useEffect(() => {
    fetchGuides();
  }, []);

  // Categories for guides
  const categories = [
    "Document Requirements",
    "Application Process", 
    "Service Fees",
    "Service Locations",
    "General",
    "Technical",
    "User Manuals",
    "FAQs"
  ];

  const fetchGuides = async () => {
    try {
      setLoading(true);
      console.log('Fetching guides...');
             const params: any = {};
       if (searchTerm) params.search = searchTerm;
       if (categoryFilter !== "all") params.category = categoryFilter;
      
      console.log('API params:', params);
      const response = await managementAPI.getGuides(params);
      console.log('Guides response:', response);
      setGuides(response.data.data || []);
    } catch (error) {
      console.error('Error fetching guides:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check if it's an authentication error (401)
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "You are not logged in. Please log in to access guide management.",
        });
        return;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to fetch guides: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Load guides on component mount
  useEffect(() => {
    fetchGuides();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setEditFormData({ ...editFormData, file: e.target.files[0] });
    }
  };

  const showSuccessNotification = (message: string) => {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: "success",
      title: message,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Client-side validation
    if (!formData.title.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Title is required",
      });
      return;
    }
    
    if (!formData.category.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Category is required",
      });
      return;
    }
    
    try {
      console.log('Creating guide with data:', formData);
      
             const formDataToSend = new FormData();
       formDataToSend.append('title', formData.title);
       formDataToSend.append('description', formData.description);
       formDataToSend.append('content', formData.content);
       formDataToSend.append('category', formData.category);
       formDataToSend.append('order', formData.order.toString());
       formDataToSend.append('featured', formData.featured ? '1' : '0');
      if (formData.tags.length > 0) {
        formData.tags.forEach(tag => formDataToSend.append('tags[]', tag));
      }
      if (formData.file) {
        formDataToSend.append('file', formData.file);
      }

      console.log('Sending FormData to API...');
      
      // Debug: Log all FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData ${key}:`, value);
      }
      
      const response = await managementAPI.createGuide(formDataToSend);
      console.log('API Response:', response);
      
      showSuccessNotification("Guide created successfully!");
      setOpen(false);
             setFormData({
         title: "",
         description: "",
         content: "",
         category: "Document Requirements",
         order: 1,
         tags: [],
         featured: false,
         file: null,
       });
      fetchGuides();
    } catch (error) {
      console.error('Error creating guide:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check if it's an authentication error (401)
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "You are not logged in. Please log in to create guides.",
        });
        return;
      }
      
      // Check if it's a validation error (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Validation errors:', validationErrors);
        
        // Format validation errors for display
        const errorMessages = Object.entries(validationErrors || {})
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please fix the following errors:\n\n${errorMessages}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to create guide: ${error.message}`,
        });
      }
    }
  };

  const handleEdit = (guide: Guide) => {
    setEditingGuide(guide);
    setEditFormData({
      title: guide.title,
      description: guide.description || "",
      content: guide.content || "",
      category: guide.category,
      order: guide.order,
      tags: guide.tags || [],
      featured: guide.featured,
      file: null,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingGuide) return;
    
    try {
      console.log('Updating guide with data:', editFormData);
      
      // Client-side validation
      if (!editFormData.title.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Title is required",
        });
        return;
      }
      
      if (!editFormData.category.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Category is required",
        });
        return;
      }
      
             const formDataToSend = new FormData();
       formDataToSend.append('title', editFormData.title);
       formDataToSend.append('description', editFormData.description);
       formDataToSend.append('content', editFormData.content);
       formDataToSend.append('category', editFormData.category);
       formDataToSend.append('order', editFormData.order.toString());
       formDataToSend.append('featured', editFormData.featured ? '1' : '0');
      if (editFormData.tags.length > 0) {
        editFormData.tags.forEach(tag => formDataToSend.append('tags[]', tag));
      }
      if (editFormData.file) {
        formDataToSend.append('file', editFormData.file);
      }

      console.log('Sending update FormData to API...');
      
      // Debug: Log all FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`Update FormData ${key}:`, value);
      }

      const response = await managementAPI.updateGuide(editingGuide.id, formDataToSend);
      console.log('Update API Response:', response);
      
      showSuccessNotification("Guide updated successfully!");
      setEditOpen(false);
      setEditingGuide(null);
      fetchGuides();
    } catch (error) {
      console.error('Error updating guide:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check if it's an authentication error (401)
      if (error.response?.status === 401) {
        Swal.fire({
          icon: "error",
          title: "Authentication Error",
          text: "You are not logged in. Please log in to update guides.",
        });
        return;
      }
      
      // Check if it's a validation error (422)
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        console.error('Validation errors:', validationErrors);
        
        // Format validation errors for display
        const errorMessages = Object.entries(validationErrors || {})
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: `Please fix the following errors:\n\n${errorMessages}`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: `Failed to update guide: ${error.message}`,
        });
      }
    }
  };



  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        await managementAPI.deleteGuide(id);
        showSuccessNotification("Guide deleted successfully!");
        fetchGuides();
      } catch (error) {
        console.error('Error deleting guide:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete guide",
        });
      }
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await managementAPI.toggleGuideFeatured(id);
      showSuccessNotification("Guide featured status updated!");
      fetchGuides();
    } catch (error) {
      console.error('Error toggling featured status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update featured status",
      });
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await managementAPI.updateGuideStatus(id, status);
      showSuccessNotification("Guide status updated!");
      fetchGuides();
    } catch (error) {
      console.error('Error updating status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status",
      });
    }
  };

  const formatFileSize = (bytes: string) => {
    const size = parseInt(bytes);
    if (size === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Redirect to login if not authenticated
  if (authLoading) return <p>Loading authentication...</p>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-normal tracking-tight">Guide Management</h1>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Guide
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Guide</AlertDialogTitle>
              <AlertDialogDescription>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="title"
                      placeholder="Guide Title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                  />
                  
                  <Textarea
                    name="content"
                    placeholder="Content (optional)"
                    value={formData.content}
                    onChange={handleChange}
                    rows={6}
                  />
                  
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input
                       type="number"
                       name="order"
                       placeholder="Order"
                       value={formData.order}
                       onChange={handleChange}
                       min="1"
                     />
                   </div>
                  
                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="rounded"
                      />
                      <span>Featured</span>
                    </label>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-normal mb-2">Upload File (optional)</label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt,.rtf"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: PDF, DOC, DOCX, TXT, RTF (Max 10MB)
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit">Save Guide</AlertDialogAction>
                  </div>
                </form>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="relative">
               <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
               <Input
                 placeholder="Search guides..."
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="pl-8"
               />
             </div>
             <Select value={categoryFilter} onValueChange={setCategoryFilter}>
               <SelectTrigger>
                 <SelectValue placeholder="Filter by category" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="all">All Categories</SelectItem>
                 {categories.map((category) => (
                   <SelectItem key={category} value={category}>
                     {category}
                   </SelectItem>
                 ))}
               </SelectContent>
             </Select>
             <Button onClick={fetchGuides} variant="outline">
               Apply Filters
             </Button>
           </div>
        </CardContent>
      </Card>

             {/* Table */}
       <Card>
         <CardHeader>
           <CardTitle>All Guides ({guides.length})</CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
                               <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>File</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
             </TableHeader>
             <TableBody>
               {guides.map((guide) => (
                 <TableRow key={guide.id}>
                   <TableCell>
                     <div>
                       <div className="font-normal">{guide.title}</div>
                       {guide.description && (
                         <div className="text-sm text-gray-500 truncate max-w-xs">
                           {guide.description}
                         </div>
                       )}
                       {guide.content && (
                         <details className="text-xs mt-1">
                           <summary className="cursor-pointer text-blue-600 hover:text-blue-800">Content (click to expand)</summary>
                           <div className="mt-1 text-gray-600 max-w-xs truncate">
                             {guide.content}
                           </div>
                         </details>
                       )}
                     </div>
                   </TableCell>
                   <TableCell>
                     <Badge variant="outline">{guide.category}</Badge>
                   </TableCell>
                                       <TableCell>{guide.order}</TableCell>
                    <TableCell>
                      {guide.file_name ? (
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <div>
                            <div className="text-sm font-normal">{guide.file_name}</div>
                            <div className="text-xs text-gray-500">
                              {formatFileSize(guide.file_size || "0")}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">No file</span>
                      )}
                    </TableCell>
                    <TableCell>
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => handleToggleFeatured(guide.id)}
                       className={guide.featured ? "text-yellow-600" : "text-gray-400"}
                     >
                       <Star className={`h-4 w-4 ${guide.featured ? "fill-current" : ""}`} />
                     </Button>
                   </TableCell>
                   <TableCell className="text-right">
                     <div className="flex items-center justify-end gap-2">
                       <Button variant="ghost" size="icon">
                         <Eye className="w-4 h-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleEdit(guide)}
                       >
                         <Edit className="w-4 h-4" />
                       </Button>
                       <Button variant="ghost" size="icon">
                         <Download className="w-4 h-4" />
                       </Button>
                       <Button
                         variant="ghost"
                         size="icon"
                         onClick={() => handleDelete(guide.id)}
                       >
                         <Trash2 className="w-4 h-4 text-red-600" />
                       </Button>
                     </div>
                   </TableCell>
                 </TableRow>
               ))}
             </TableBody>
           </Table>
                  </CardContent>
       </Card>

       {/* Edit Guide Modal */}
       <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
         <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
           <AlertDialogHeader>
             <AlertDialogTitle>Edit Guide</AlertDialogTitle>
             <AlertDialogDescription>
               <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <Input
                     placeholder="Guide Title"
                     value={editFormData.title}
                     onChange={(e) => setEditFormData({...editFormData, title: e.target.value})}
                     required
                   />
                   <Select
                     value={editFormData.category}
                     onValueChange={(value) => setEditFormData({...editFormData, category: value})}
                   >
                     <SelectTrigger>
                       <SelectValue placeholder="Select Category" />
                     </SelectTrigger>
                     <SelectContent>
                       {categories.map((category) => (
                         <SelectItem key={category} value={category}>
                           {category}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
                 
                 <Textarea
                   placeholder="Description"
                   value={editFormData.description}
                   onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                   rows={3}
                 />
                 
                 <Textarea
                   placeholder="Content (optional)"
                   value={editFormData.content}
                   onChange={(e) => setEditFormData({...editFormData, content: e.target.value})}
                   rows={6}
                 />
                 
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      type="number"
                      placeholder="Order"
                      value={editFormData.order}
                      onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value) || 1})}
                      min="1"
                    />
                  </div>
                 
                 <div className="flex items-center space-x-4">
                   <label className="flex items-center space-x-2">
                     <input
                       type="checkbox"
                       checked={editFormData.featured}
                       onChange={(e) => setEditFormData({...editFormData, featured: e.target.checked})}
                       className="rounded"
                     />
                     <span>Featured</span>
                   </label>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-normal mb-2">Upload File (optional)</label>
                   {editingGuide?.file_name && (
                     <div className="text-sm text-gray-600 mb-2">
                       Current file: {editingGuide.file_name}
                     </div>
                   )}
                   <Input
                     type="file"
                     onChange={handleEditFileChange}
                     accept=".pdf,.doc,.docx,.txt,.rtf"
                   />
                   <p className="text-xs text-gray-500 mt-1">
                     Supported formats: PDF, DOC, DOCX, TXT, RTF (Max 10MB)
                   </p>
                 </div>
                 
                 <div className="flex justify-end gap-2">
                   <AlertDialogCancel onClick={() => setEditOpen(false)}>Cancel</AlertDialogCancel>
                   <AlertDialogAction type="submit">Update Guide</AlertDialogAction>
                 </div>
               </form>
             </AlertDialogDescription>
           </AlertDialogHeader>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
}
