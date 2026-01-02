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
  Star,
  Image as ImageIcon,
  User,
  MessageSquare
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
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
import { managementAPI, WelcomeMessage } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";

export default function WelcomeMessageManagement() {
  const { user, isLoading: authLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [welcomeMessages, setWelcomeMessages] = useState<WelcomeMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    message: "",
    order: 1,
    status: "active" as "active" | "inactive" | "draft",
    is_active: true,
    file: null as File | null,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    position: "",
    message: "",
    order: 1,
    status: "active" as "active" | "inactive" | "draft",
    is_active: true,
    file: null as File | null,
  });
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<WelcomeMessage | null>(null);

  // Fetch welcome messages on component mount
  useEffect(() => {
    fetchWelcomeMessages();
  }, []);

  const fetchWelcomeMessages = async () => {
    try {
      setLoading(true);
      console.log('Fetching welcome messages...');
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== "all") params.status = statusFilter;
      
      // Add timestamp to prevent caching
      params._t = Date.now();
      
      console.log('API params:', params);
      const response = await managementAPI.getWelcomeMessages(params);
      console.log('Welcome messages response:', response);
      
      // Ensure we have fresh data
      if (response.success && response.data) {
        setWelcomeMessages(response.data);
        console.log('Updated welcome messages state:', response.data);
      } else {
        setWelcomeMessages([]);
      }
    } catch (error: any) {
      console.error('Error fetching welcome messages:', error);
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
          text: "You are not logged in. Please log in to access welcome message management.",
        });
        return;
      }
      
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to fetch welcome messages: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
    if (!formData.name.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Name is required",
      });
      return;
    }
    
    if (!formData.position.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Position is required",
      });
      return;
    }
    
    if (!formData.message.trim()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Message is required",
      });
      return;
    }
    
    try {
      console.log('Creating welcome message with data:', formData);
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('position', formData.position);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      if (formData.file) {
        formDataToSend.append('image', formData.file);
      }

      console.log('Sending FormData to API...');
      
      // Debug: Log all FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData ${key}:`, value);
      }
      
      const response = await managementAPI.createWelcomeMessage(formDataToSend);
      console.log('API Response:', response);
      
      showSuccessNotification("Welcome message created successfully!");
      setOpen(false);
      setFormData({
        name: "",
        position: "",
        message: "",
        order: 1,
        status: "active",
        is_active: true,
        file: null,
      });
      fetchWelcomeMessages();
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('welcomeMessageUpdated'));
    } catch (error: any) {
      console.error('Error creating welcome message:', error);
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
          text: "You are not logged in. Please log in to create welcome messages.",
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
          text: `Failed to create welcome message: ${error.message}`,
        });
      }
    }
  };

  const handleEdit = (message: WelcomeMessage) => {
    setEditingMessage(message);
    setEditFormData({
      name: message.name,
      position: message.position,
      message: message.message,
      order: message.order,
      status: message.status,
      is_active: message.is_active,
      file: null,
    });
    setEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage) return;
    
    try {
      console.log('Updating welcome message with data:', editFormData);
      
      // Client-side validation
      if (!editFormData.name.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Name is required",
        });
        return;
      }
      
      if (!editFormData.position.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Position is required",
        });
        return;
      }
      
      if (!editFormData.message.trim()) {
        Swal.fire({
          icon: "error",
          title: "Validation Error",
          text: "Message is required",
        });
        return;
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('name', editFormData.name);
      formDataToSend.append('position', editFormData.position);
      formDataToSend.append('message', editFormData.message);
      formDataToSend.append('order', editFormData.order.toString());
      formDataToSend.append('status', editFormData.status);
      formDataToSend.append('is_active', editFormData.is_active ? '1' : '0');
      if (editFormData.file) {
        formDataToSend.append('image', editFormData.file);
      }

      console.log('Sending update FormData to API...');
      
      // Debug: Log all FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`Update FormData ${key}:`, value);
      }

      const response = await managementAPI.updateWelcomeMessage(editingMessage.id, formDataToSend);
      console.log('Update API Response:', response);
      
      showSuccessNotification("Welcome message updated successfully!");
      setEditOpen(false);
      setEditingMessage(null);
      
      // Force refresh the data with a small delay to ensure backend processing is complete
      setTimeout(() => {
        fetchWelcomeMessages();
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('welcomeMessageUpdated'));
      }, 500);
      
      // Also reset the edit form data
      setEditFormData({
        name: "",
        position: "",
        message: "",
        order: 1,
        status: "active",
        is_active: true,
        file: null,
      });
    } catch (error: any) {
      console.error('Error updating welcome message:', error);
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
          text: "You are not logged in. Please log in to update welcome messages.",
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
          text: `Failed to update welcome message: ${error.message}`,
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
        await managementAPI.deleteWelcomeMessage(id);
        showSuccessNotification("Welcome message deleted successfully!");
        fetchWelcomeMessages();
        // Dispatch event to notify other components
        window.dispatchEvent(new Event('welcomeMessageUpdated'));
      } catch (error) {
        console.error('Error deleting welcome message:', error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to delete welcome message",
        });
      }
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await managementAPI.toggleWelcomeMessageActive(id);
      showSuccessNotification("Welcome message status updated!");
      fetchWelcomeMessages();
      // Dispatch event to notify other components
      window.dispatchEvent(new Event('welcomeMessageUpdated'));
    } catch (error) {
      console.error('Error toggling active status:', error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update active status",
      });
    }
  };

  // Redirect to login if not authenticated
  if (authLoading) return <p>Loading authentication...</p>;
  if (!user) return <Navigate to="/login" replace />;
  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-normal tracking-tight">Welcome Message Management</h1>

        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Welcome Message
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <AlertDialogHeader>
              <AlertDialogTitle>Add New Welcome Message</AlertDialogTitle>
              <AlertDialogDescription>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      name="name"
                      placeholder="Person Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      name="position"
                      placeholder="Position/Title"
                      value={formData.position}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Textarea
                    name="message"
                    placeholder="Welcome Message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      type="number"
                      name="order"
                      placeholder="Order"
                      value={formData.order}
                      onChange={handleChange}
                      min="1"
                    />
                    <Select
                      value={formData.status}
                      onValueChange={(value: any) => setFormData({...formData, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                        className="rounded"
                      />
                      <label htmlFor="is_active">Active</label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-normal mb-2">Upload Image (optional)</label>
                    <Input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Supported formats: JPEG, PNG, JPG, GIF (Max 2MB)
                    </p>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type="submit">Save Message</AlertDialogAction>
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
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchWelcomeMessages} variant="outline">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Welcome Messages ({welcomeMessages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name & Position</TableHead>
                <TableHead>Message</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {welcomeMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>
                    <div>
                      <div className="font-normal">{message.name}</div>
                      <div className="text-sm text-gray-500">{message.position}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-600 truncate">
                        {message.message}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {message.image_url ? (
                      <div className="flex items-center space-x-2">
                        <ImageIcon className="h-4 w-4" />
                        <span className="text-sm">Has Image</span>
                        <span className="text-xs text-gray-500">({message.image_path})</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">No image</span>
                    )}
                  </TableCell>
                  <TableCell>{message.order}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        message.status === "active" ? "default" : 
                        message.status === "inactive" ? "secondary" : "outline"
                      }
                    >
                      {message.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(message.id)}
                      className={message.is_active ? "text-green-600" : "text-gray-400"}
                    >
                      <Star className={`h-4 w-4 ${message.is_active ? "fill-current" : ""}`} />
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
                        onClick={() => handleEdit(message)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(message.id)}
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

      {/* Edit Welcome Message Modal */}
      <AlertDialog open={editOpen} onOpenChange={setEditOpen}>
        <AlertDialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Welcome Message</AlertDialogTitle>
            <AlertDialogDescription>
              <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Person Name"
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    required
                  />
                  <Input
                    placeholder="Position/Title"
                    value={editFormData.position}
                    onChange={(e) => setEditFormData({...editFormData, position: e.target.value})}
                    required
                  />
                </div>
                
                <Textarea
                  placeholder="Welcome Message"
                  value={editFormData.message}
                  onChange={(e) => setEditFormData({...editFormData, message: e.target.value})}
                  rows={6}
                  required
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    type="number"
                    placeholder="Order"
                    value={editFormData.order}
                    onChange={(e) => setEditFormData({...editFormData, order: parseInt(e.target.value) || 1})}
                    min="1"
                  />
                  <Select
                    value={editFormData.status}
                    onValueChange={(value: any) => setEditFormData({...editFormData, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="edit_is_active"
                      checked={editFormData.is_active}
                      onChange={(e) => setEditFormData({...editFormData, is_active: e.target.checked})}
                      className="rounded"
                    />
                    <label htmlFor="edit_is_active">Active</label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-normal mb-2">Upload Image (optional)</label>
                  {editingMessage?.image_url && (
                    <div className="text-sm text-gray-600 mb-2">
                      Current image: {editingMessage.image_path}
                      <br />
                      Image URL: {editingMessage.image_url}
                    </div>
                  )}
                  <Input
                    type="file"
                    onChange={handleEditFileChange}
                    accept="image/*"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supported formats: JPEG, PNG, JPG, GIF (Max 2MB)
                  </p>
                </div>
                
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel onClick={() => setEditOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="submit">Update Message</AlertDialogAction>
                </div>
              </form>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
