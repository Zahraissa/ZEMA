import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  StarOff,
  Upload,
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { managementAPI } from "@/services/api";
import type { Gallery } from "@/services/api";
import { toast } from "sonner";
import { STORAGE_BASE_URL } from '@/config';

const GalleryManagement = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    order: 1,
    status: 'active' as 'active' | 'inactive' | 'draft',
    is_active: true,
    featured: false,
    alt_text: '',
    caption: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch galleries
  const fetchGalleries = async () => {
    try {
      setLoading(true);
      console.log('Fetching galleries...');
      
      // Debug: Check authentication
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists for fetch:', !!token);
      
      const response = await managementAPI.getGallery();
      console.log('Fetch galleries response:', response);
      
      if (response.success) {
        setGalleries(response.data);
        console.log('Galleries loaded:', response.data.length, 'items');
      } else {
        console.error('Failed to fetch galleries:', response);
        toast.error(`Failed to load galleries: ${response.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error fetching galleries:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      toast.error(`Failed to load galleries: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGalleries();
  }, []);

  // Filter galleries
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || gallery.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(galleries.map(g => g.category).filter(Boolean)))];

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      order: 1,
      status: 'active' as 'active' | 'inactive' | 'draft',
      is_active: true,
      featured: false,
      alt_text: '',
      caption: ''
    });
    setSelectedFile(null);
    setImagePreview(null);
    setEditingGallery(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('status', formData.status);
      formDataToSend.append('is_active', formData.is_active ? '1' : '0');
      formDataToSend.append('featured', formData.featured ? '1' : '0');
      formDataToSend.append('alt_text', formData.alt_text);
      formDataToSend.append('caption', formData.caption);

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      // Debug: Log the form data
      console.log('Form data being sent:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        order: formData.order,
        status: formData.status,
        is_active: formData.is_active,
        featured: formData.featured,
        alt_text: formData.alt_text,
        caption: formData.caption,
        hasImage: !!selectedFile
      });

      // Debug: Check authentication
      const token = localStorage.getItem('authToken');
      console.log('Auth token exists:', !!token);

      let response;
      if (editingGallery) {
        console.log('Updating gallery with ID:', editingGallery.id);
        response = await managementAPI.updateGallery(editingGallery.id, formDataToSend);
        toast.success('Gallery updated successfully');
      } else {
        console.log('Creating new gallery item');
        response = await managementAPI.createGallery(formDataToSend);
        toast.success('Gallery created successfully');
      }

      console.log('API Response:', response);

      if (response.success) {
        setIsDialogOpen(false);
        resetForm();
        fetchGalleries();
      } else {
        console.error('API returned error:', response);
        // Show validation errors if they exist
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(', ');
          toast.error(`Validation errors: ${errorMessages}`);
        } else {
          toast.error(`Failed to save gallery: ${response.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      console.error('Error saving gallery:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      // Show validation errors if they exist
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
      } else {
        toast.error(`Failed to save gallery: ${error.response?.data?.message || error.message}`);
      }
    }
  };

  // Handle edit
  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description || '',
      category: gallery.category || '',
      order: gallery.order,
      status: gallery.status,
      is_active: gallery.is_active,
      featured: gallery.featured,
      alt_text: gallery.alt_text || '',
      caption: gallery.caption || ''
    });
    setImagePreview(gallery.image_path ? `${STORAGE_BASE_URL}${gallery.image_path}` : null);
    setIsDialogOpen(true);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this gallery item?')) {
      try {
        const response = await managementAPI.deleteGallery(id);
        if (response.success) {
          toast.success('Gallery deleted successfully');
          fetchGalleries();
        }
      } catch (error) {
        console.error('Error deleting gallery:', error);
        toast.error('Failed to delete gallery');
      }
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number) => {
    try {
      const response = await managementAPI.toggleGalleryStatus(id);
      if (response.success) {
        toast.success('Status updated successfully');
        fetchGalleries();
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update status');
    }
  };

  // Handle featured toggle
  const handleToggleFeatured = async (id: number) => {
    try {
      const response = await managementAPI.toggleGalleryFeatured(id);
      if (response.success) {
        toast.success('Featured status updated successfully');
        fetchGalleries();
      }
    } catch (error) {
      console.error('Error toggling featured:', error);
      toast.error('Failed to update featured status');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-normal">Gallery Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Gallery Item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingGallery ? 'Edit Gallery Item' : 'Add New Gallery Item'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive' | 'draft') => 
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="alt_text">Alt Text</Label>
                  <Input
                    id="alt_text"
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="caption">Caption</Label>
                  <Input
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                  <Label htmlFor="is_active">Active</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="image">Image</Label>
                <div className="mt-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                  />
                </div>
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingGallery ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search galleries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Gallery Grid/List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading galleries...</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredGalleries.map((gallery) => (
            <Card key={gallery.id} className={viewMode === 'list' ? 'flex' : ''}>
              {viewMode === 'list' && (
                <div className="w-32 h-32 flex-shrink-0">
                  <img
                    src={gallery.image_path ? `${STORAGE_BASE_URL}${gallery.image_path}` : '/assets/placeholder.jpg'}
                    alt={gallery.alt_text || gallery.title}
                    className="w-full h-full object-cover rounded-l-lg"
                  />
                </div>
              )}
              <CardContent className={viewMode === 'list' ? 'flex-1 p-4' : 'p-4'}>
                {viewMode === 'grid' && (
                  <div className="relative mb-4">
                    <img
                      src={gallery.image_path ? `${STORAGE_BASE_URL}${gallery.image_path}` : '/assets/placeholder.jpg'}
                      alt={gallery.alt_text || gallery.title}
                      className="w-full h-48 object-cover rounded"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1">
                      {gallery.featured && <Badge variant="secondary">Featured</Badge>}
                      <Badge variant={gallery.is_active ? 'default' : 'destructive'}>
                        {gallery.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                )}
                
                <div className={viewMode === 'list' ? 'flex justify-between items-start' : ''}>
                  <div className={viewMode === 'list' ? 'flex-1' : ''}>
                    <h3 className="font-normal text-lg mb-2">{gallery.title}</h3>
                    {gallery.description && (
                      <p className="text-gray-600 text-sm mb-2">{gallery.description}</p>
                    )}
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>Order: {gallery.order}</span>
                      {gallery.category && <span>• {gallery.category}</span>}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(gallery)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleStatus(gallery.id)}
                    >
                      {gallery.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleFeatured(gallery.id)}
                    >
                      {gallery.featured ? <StarOff className="h-4 w-4" /> : <Star className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(gallery.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && filteredGalleries.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No galleries found</p>
        </div>
      )}
    </div>
  );
};

export default GalleryManagement;
