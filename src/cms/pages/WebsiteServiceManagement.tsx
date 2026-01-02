import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff, Star, StarOff, GripVertical, Loader2, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { managementAPI } from '@/services/api';
import type { WebsiteService } from '@/services/api';
import Swal from 'sweetalert2';

interface WebsiteServiceFormData {
  front_icon: string;
  front_title: string;
  front_description: string;
  back_title: string;
  back_description: string;
  link: string;
  order: number;
  status: 'active' | 'inactive' | 'draft';
  is_active: boolean;
  featured: boolean;
}

const WebsiteServiceManagement: React.FC = () => {
  const [services, setServices] = useState<WebsiteService[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [featuredFilter, setFeaturedFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<WebsiteService | null>(null);
  const [formData, setFormData] = useState<WebsiteServiceFormData>({
    front_icon: '',
    front_title: '',
    front_description: '',
    back_title: '',
    back_description: '',
    link: '',
    order: 0,
    status: 'active',
    is_active: true,
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Icon options
  const iconOptions = [
    { value: 'Lock', label: 'Lock' },
    { value: 'Brain', label: 'Brain' },
    { value: 'Code', label: 'Code' },
    { value: 'PenTool', label: 'Pen Tool' },
    { value: 'BarChart3', label: 'Bar Chart' },
    { value: 'TrendingUp', label: 'Trending Up' },
    { value: 'Settings', label: 'Settings' },
    { value: 'Users', label: 'Users' },
    { value: 'Globe', label: 'Globe' },
    { value: 'Smartphone', label: 'Smartphone' }
  ];

  // Fetch services
  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services...');
      const response = await managementAPI.getWebsiteServices();
      console.log('Fetch response:', response);
      if (response.success) {
        // Handle both paginated and non-paginated responses
        const servicesData = response.data.data || response.data;
        console.log('Services data:', servicesData);
        setServices(Array.isArray(servicesData) ? servicesData : []);
      }
    } catch (error: any) {
      console.error('Error fetching services:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to load website services';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Filter services
  const filteredServices = services.filter(service => {
    const matchesSearch = service.front_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.back_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.front_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || service.status === statusFilter;
    const matchesFeatured = featuredFilter === 'all' || 
                           (featuredFilter === 'featured' && service.featured) ||
                           (featuredFilter === 'not-featured' && !service.featured);

    return matchesSearch && matchesStatus && matchesFeatured;
  });

  // Reset form
  const resetForm = () => {
    setFormData({
      front_icon: '',
      front_title: '',
      front_description: '',
      back_title: '',
      back_description: '',
      link: '',
      order: 0,
      status: 'active',
      is_active: true,
      featured: false
    });
    setImageFile(null);
    setImagePreview('');
    setEditingService(null);
  };

  // Open dialog for create/edit
  const openDialog = (service?: WebsiteService) => {
    if (service) {
      setEditingService(service);
      setFormData({
        front_icon: service.front_icon || '',
        front_title: service.front_title,
        front_description: service.front_description,
        back_title: service.back_title,
        back_description: service.back_description,
        link: service.link || '',
        order: service.order,
        status: service.status,
        is_active: service.is_active,
        featured: service.featured
      });
      if (service.back_image) {
        setImagePreview(`http://localhost:8000/storage/${service.back_image}`);
      } else {
        setImagePreview('');
      }
      setImageFile(null);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  // Handle image upload
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Show loading SweetAlert
    Swal.fire({
      title: editingService ? 'Updating...' : 'Creating...',
      text: 'Please wait while we process your request',
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      },
      background: '#f8fafc',
      color: '#1e293b',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        title: 'text-xl font-normal text-blue-600',
        content: 'text-gray-700'
      }
    });

    try {
      console.log('Form submission started');
      console.log('Form data:', formData);
      console.log('Editing service:', editingService);
      
      const formDataToSend = new FormData();
      
      // Add all form fields
      formDataToSend.append('front_icon', formData.front_icon);
      formDataToSend.append('front_title', formData.front_title);
      formDataToSend.append('front_description', formData.front_description);
      formDataToSend.append('back_title', formData.back_title);
      formDataToSend.append('back_description', formData.back_description);
      formDataToSend.append('link', formData.link);
      formDataToSend.append('order', formData.order.toString());
      formDataToSend.append('status', formData.status);
          formDataToSend.append('is_active', formData.is_active ? "1" : "0");
    formDataToSend.append('featured', formData.featured ? "1" : "0");

      // Add image if selected
      if (imageFile) {
        formDataToSend.append('back_image', imageFile);
        console.log('Image file added:', imageFile.name);
      }

      console.log('FormData entries:');
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, value);
      }

      if (editingService) {
        console.log('Updating service with ID:', editingService.id);
        const response = await managementAPI.updateWebsiteService(editingService.id, formDataToSend);
        console.log('Update response:', response);
        
        // Show success SweetAlert
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Website service updated successfully',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8fafc',
          color: '#1e293b',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-xl font-normal text-green-600',
            content: 'text-gray-700'
          }
        });
      } else {
        console.log('Creating new service');
        const response = await managementAPI.createWebsiteService(formDataToSend);
        console.log('Create response:', response);
        
        // Show success SweetAlert
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Website service created successfully',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8fafc',
          color: '#1e293b',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-xl font-normal text-green-600',
            content: 'text-gray-700'
          }
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchServices();
    } catch (error: any) {
      console.error('Error saving service:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data
      });
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save website service';
      
      // Close loading and show error SweetAlert
      Swal.close();
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonColor: '#dc2626',
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-red-600',
          content: 'text-gray-700'
        }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    // Show confirmation SweetAlert
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: 'You want to delete this website service?',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#f8fafc',
      color: '#1e293b',
      customClass: {
        popup: 'rounded-lg shadow-xl',
        title: 'text-xl font-normal text-orange-600',
        content: 'text-gray-700'
      }
    });

    if (result.isConfirmed) {
      // Show loading SweetAlert
      Swal.fire({
        title: 'Deleting...',
        text: 'Please wait while we delete the service',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-blue-600',
          content: 'text-gray-700'
        }
      });

      try {
        await managementAPI.deleteWebsiteService(id);
        
        // Close loading and show success SweetAlert
        Swal.close();
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Website service has been deleted successfully.',
          showConfirmButton: false,
          timer: 2000,
          background: '#f8fafc',
          color: '#1e293b',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-xl font-normal text-green-600',
            content: 'text-gray-700'
          }
        });
        
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        
        // Close loading and show error SweetAlert
        Swal.close();
        await Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete website service',
          confirmButtonColor: '#dc2626',
          background: '#f8fafc',
          color: '#1e293b',
          customClass: {
            popup: 'rounded-lg shadow-xl',
            title: 'text-xl font-normal text-red-600',
            content: 'text-gray-700'
          }
        });
      }
    }
  };

  // Handle status toggle
  const handleToggleStatus = async (id: number) => {
    try {
      await managementAPI.toggleWebsiteServiceStatus(id);
      
      // Show success SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Status updated successfully',
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-green-600',
          content: 'text-gray-700'
        }
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error toggling status:', error);
      
      // Show error SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update status',
        confirmButtonColor: '#dc2626',
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-red-600',
          content: 'text-gray-700'
        }
      });
    }
  };

  // Handle featured toggle
  const handleToggleFeatured = async (id: number) => {
    try {
      await managementAPI.toggleWebsiteServiceFeatured(id);
      
      // Show success SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Featured status updated successfully',
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-green-600',
          content: 'text-gray-700'
        }
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error toggling featured:', error);
      
      // Show error SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update featured status',
        confirmButtonColor: '#dc2626',
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-red-600',
          content: 'text-gray-700'
        }
      });
    }
  };

  // Handle reorder
  const handleReorder = async (services: WebsiteService[]) => {
    try {
      const reorderData = services.map((service, index) => ({
        id: service.id,
        order: index + 1
      }));
      await managementAPI.reorderWebsiteServices(reorderData);
      
      // Show success SweetAlert
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Order updated successfully',
        showConfirmButton: false,
        timer: 1500,
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-green-600',
          content: 'text-gray-700'
        }
      });
      
      fetchServices();
    } catch (error) {
      console.error('Error reordering:', error);
      
      // Show error SweetAlert
      await Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update order',
        confirmButtonColor: '#dc2626',
        background: '#f8fafc',
        color: '#1e293b',
        customClass: {
          popup: 'rounded-lg shadow-xl',
          title: 'text-xl font-normal text-red-600',
          content: 'text-gray-700'
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-normal">Website Services Management</h1>
          <p className="text-gray-600">Manage your website flip card services</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="featured">Featured</Label>
              <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="not-featured">Not Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button variant="outline" onClick={fetchServices} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">No services found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <Badge variant={service.status === 'active' ? 'default' : 'secondary'}>
                      {service.status}
                    </Badge>
                    {service.featured && (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Featured
                      </Badge>
                    )}
                  </div>
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(service.id)}
                    >
                      {service.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleFeatured(service.id)}
                    >
                      {service.featured ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDialog(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(service.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-lg">{service.front_title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600 line-clamp-2">{service.front_description}</p>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Order: {service.order}</span>
                    <span>ID: {service.id}</span>
                  </div>
                  {service.back_image && (
                    <div className="mt-3">
                      <img
                        src={`http://localhost:8000/storage/${service.back_image}`}
                        alt={service.back_title}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingService ? 'Edit Website Service' : 'Create New Website Service'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="front_icon">Front Icon</Label>
                <Select value={formData.front_icon} onValueChange={(value) => setFormData({...formData, front_icon: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.value} value={icon.value}>
                        {icon.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="front_title">Front Title</Label>
              <Input
                id="front_title"
                value={formData.front_title}
                onChange={(e) => setFormData({...formData, front_title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="front_description">Front Description</Label>
              <Textarea
                id="front_description"
                value={formData.front_description}
                onChange={(e) => setFormData({...formData, front_description: e.target.value})}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="back_title">Back Title</Label>
              <Input
                id="back_title"
                value={formData.back_title}
                onChange={(e) => setFormData({...formData, back_title: e.target.value})}
                required
              />
            </div>

            <div>
              <Label htmlFor="back_description">Back Description</Label>
              <Textarea
                id="back_description"
                value={formData.back_description}
                onChange={(e) => setFormData({...formData, back_description: e.target.value})}
                required
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="link">Link</Label>
              <Input
                id="link"
                value={formData.link}
                onChange={(e) => setFormData({...formData, link: e.target.value})}
                placeholder="/services/example"
              />
            </div>

            <div>
              <Label htmlFor="back_image">Back Image</Label>
              <div className="space-y-2">
                <Input
                  id="back_image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({...formData, status: value})}>
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
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="featured">Featured</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {editingService ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WebsiteServiceManagement;
