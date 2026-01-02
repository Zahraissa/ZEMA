import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api, { managementAPI, DirectorGeneral } from "@/services/api";
import { STORAGE_BASE_URL } from "@/config";

const DirectorGeneralManagement = () => {
  const [directors, setDirectors] = useState<DirectorGeneral[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDirector, setEditingDirector] = useState<DirectorGeneral | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    message: '',
    status: 'active',
    order: 1
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchDirectors();
  }, []);

  const fetchDirectors = async () => {
    try {
      setLoading(true);
      const response = await managementAPI.getDirectorGeneral();
      if (response.success) {
        setDirectors(response.data);
      }
    } catch (error) {
      console.error('Error fetching directors:', error);
      toast({
        title: "Error",
        description: "Failed to load director general content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      message: '',
      status: 'active',
      order: 1
    });
    setImageFile(null);
    setImagePreview(null);
    setEditingDirector(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('order', formData.order.toString());
      
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }

      if (editingDirector) {
        await managementAPI.updateDirectorGeneral(editingDirector.id, formDataToSend);
        toast({
          title: "Success",
          description: "Director General content updated successfully",
        });
      } else {
        await managementAPI.createDirectorGeneral(formDataToSend);
        toast({
          title: "Success",
          description: "Director General content created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchDirectors();
    } catch (error: any) {
      console.error('Error saving director:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save director general content",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (director: DirectorGeneral) => {
    setEditingDirector(director);
    setFormData({
      name: director.name,
      title: director.title,
      message: director.message,
      status: director.status,
      order: director.order
    });
    if (director.image_path) {
      setImagePreview(`${STORAGE_BASE_URL}${director.image_path}`);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this director general content?')) {
      return;
    }

    try {
      await managementAPI.deleteDirectorGeneral(id);
      toast({
        title: "Success",
        description: "Director General content deleted successfully",
      });
      fetchDirectors();
    } catch (error) {
      console.error('Error deleting director:', error);
      toast({
        title: "Error",
        description: "Failed to delete director general content",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return '/placeholder.svg';
    
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    const cleanPath = imagePath.startsWith('storage/') ? imagePath.substring(8) : imagePath;
    return `${STORAGE_BASE_URL}${cleanPath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-normal">Director General Management</h1>
          <p className="text-gray-600">Manage the Director General's message and content</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Director General
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingDirector ? 'Edit Director General' : 'Add Director General'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Director General Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Message Title"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Director General's message..."
                  rows={10}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Portrait Image</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-64 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        className="absolute top-2 right-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingDirector ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {directors.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-500">No director general content found.</p>
            </CardContent>
          </Card>
        ) : (
          directors.map((director) => (
            <Card key={director.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <img
                      src={getImageUrl(director.image_path)}
                      alt={director.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-normal">{director.name}</h3>
                      <p className="text-gray-600 font-normal">{director.title}</p>
                      <p className="text-gray-500 text-sm mt-1">
                        {director.message.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant={director.status === 'active' ? 'default' : 'secondary'}>
                          {director.status}
                        </Badge>
                        <span className="text-sm text-gray-500">Order: {director.order}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(director)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(director.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default DirectorGeneralManagement;
