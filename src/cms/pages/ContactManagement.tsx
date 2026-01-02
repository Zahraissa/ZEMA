import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Building,
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Star,
  Eye,
  EyeOff
} from "lucide-react";
import { contactService, ContactOffice } from "@/services/contactService";
import { useToast } from "@/hooks/use-toast";

const ContactManagement = () => {
  const [offices, setOffices] = useState<ContactOffice[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingOffice, setEditingOffice] = useState<ContactOffice | null>(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: '',
    office_type: 'regional' as 'headquarter' | 'regional' | 'research',
    office_name: '',
    location: '',
    postal_address: '',
    email: '',
    phone: '',
    helpdesk: '',
    map_embed_url: '',
    map_latitude: '',
    map_longitude: '',
    map_rating: '',
    map_reviews: '',
    order: 0,
    status: 'active' as 'active' | 'inactive'
  });

  useEffect(() => {
    fetchOffices();
  }, []);

  const fetchOffices = async () => {
    try {
      console.log('=== Starting fetchOffices ===');
      setLoading(true);
      // For management, we need all offices (including inactive ones)
      console.log('Calling contactService.getAllOfficesForManagement()...');
      const response = await contactService.getAllOfficesForManagement();
      console.log('ContactManagement Response:', response); // Debug log
      console.log('Offices data:', response.data); // Debug log
      console.log('Is array?', Array.isArray(response.data)); // Debug log
      console.log('Data length:', response.data?.length || 0);
      console.log('Setting offices state with:', response.data || []);
      setOffices(response.data || []);
      console.log('=== fetchOffices completed ===');
    } catch (error) {
      console.error('=== Error in fetchOffices ===');
      console.error('Error fetching offices:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      toast({
        title: "Error",
        description: "Failed to fetch contact offices",
        variant: "destructive",
      });
      setOffices([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      office_type: 'regional',
      office_name: '',
      location: '',
      postal_address: '',
      email: '',
      phone: '',
      helpdesk: '',
      map_embed_url: '',
      map_latitude: '',
      map_longitude: '',
      map_rating: '',
      map_reviews: '',
      order: 0,
      status: 'active'
    });
    setEditingOffice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        map_latitude: formData.map_latitude ? parseFloat(formData.map_latitude) : null,
        map_longitude: formData.map_longitude ? parseFloat(formData.map_longitude) : null,
        map_rating: formData.map_rating ? parseFloat(formData.map_rating) : null,
        map_reviews: formData.map_reviews ? parseInt(formData.map_reviews) : null,
        order: parseInt(formData.order.toString()),
        helpdesk: formData.helpdesk || null,
        map_embed_url: formData.map_embed_url || null,
      };

      if (editingOffice) {
        await contactService.updateOffice(editingOffice.id, submitData);
        toast({
          title: "Success",
          description: "Contact office updated successfully",
        });
      } else {
        await contactService.createOffice(submitData);
        toast({
          title: "Success",
          description: "Contact office created successfully",
        });
      }

      setIsDialogOpen(false);
      resetForm();
      fetchOffices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save contact office",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (office: ContactOffice) => {
    setEditingOffice(office);
    setFormData({
      title: office.title,
      office_type: office.office_type,
      office_name: office.office_name,
      location: office.location,
      postal_address: office.postal_address,
      email: office.email,
      phone: office.phone,
      helpdesk: office.helpdesk || '',
      map_embed_url: office.map_embed_url || '',
      map_latitude: office.map_latitude?.toString() || '',
      map_longitude: office.map_longitude?.toString() || '',
      map_rating: office.map_rating?.toString() || '',
      map_reviews: office.map_reviews?.toString() || '',
      order: office.order,
      status: office.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this contact office?')) {
      try {
        await contactService.deleteOffice(id);
        toast({
          title: "Success",
          description: "Contact office deleted successfully",
        });
        fetchOffices();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete contact office",
          variant: "destructive",
        });
      }
    }
  };

  const handleToggleStatus = async (office: ContactOffice) => {
    try {
      await contactService.toggleStatus(office.id);
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      fetchOffices();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const getOfficeTypeColor = (type: string) => {
    switch (type) {
      case 'headquarter':
        return 'bg-red-100 text-red-800';
      case 'regional':
        return 'bg-blue-100 text-blue-800';
      case 'research':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-normal text-gray-900">Contact Offices Management</h1>
          <p className="text-gray-600 mt-2">Manage contact information for different office locations</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Office
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingOffice ? 'Edit Contact Office' : 'Add New Contact Office'}
              </DialogTitle>
              <DialogDescription>
                Fill in the details for the contact office location.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="title">Office Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., HEADQUARTER, DAR ES SALAAM"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="office_type">Office Type</Label>
                  <Select
                    value={formData.office_type}
                    onValueChange={(value: 'headquarter' | 'regional' | 'research') =>
                      setFormData({ ...formData, office_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="headquarter">Headquarters</SelectItem>
                      <SelectItem value="regional">Regional Office</SelectItem>
                      <SelectItem value="research">Research Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="office_name">Office Name</Label>
                <Textarea
                  id="office_name"
                  value={formData.office_name}
                  onChange={(e) => setFormData({ ...formData, office_name: e.target.value })}
                  placeholder="e.g., President's Office&#10;e-Government Authority"
                  required
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Mtumba-Mtandao Street"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postal_address">Postal Address</Label>
                  <Input
                    id="postal_address"
                    value={formData.postal_address}
                    onChange={(e) => setFormData({ ...formData, postal_address: e.target.value })}
                    placeholder="e.g., PO Box 2833, 40404 DODOMA"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g., barua@ega.go.tz"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g., +255 026 - 296 1957"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="helpdesk">Helpdesk (Optional)</Label>
                <Input
                  id="helpdesk"
                  value={formData.helpdesk}
                  onChange={(e) => setFormData({ ...formData, helpdesk: e.target.value })}
                  placeholder="e.g., +255 764 292 299 / +255 0763 292 299"
                />
              </div>

              <div>
                <Label htmlFor="map_embed_url">Google Maps Embed URL (Optional)</Label>
                <Input
                  id="map_embed_url"
                  value={formData.map_embed_url}
                  onChange={(e) => setFormData({ ...formData, map_embed_url: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <Label htmlFor="map_latitude">Latitude (Optional)</Label>
                  <Input
                    id="map_latitude"
                    type="number"
                    step="any"
                    value={formData.map_latitude}
                    onChange={(e) => setFormData({ ...formData, map_latitude: e.target.value })}
                    placeholder="-6.123456"
                  />
                </div>
                <div>
                  <Label htmlFor="map_longitude">Longitude (Optional)</Label>
                  <Input
                    id="map_longitude"
                    type="number"
                    step="any"
                    value={formData.map_longitude}
                    onChange={(e) => setFormData({ ...formData, map_longitude: e.target.value })}
                    placeholder="35.123456"
                  />
                </div>
                <div>
                  <Label htmlFor="map_rating">Rating (Optional)</Label>
                  <Input
                    id="map_rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.map_rating}
                    onChange={(e) => setFormData({ ...formData, map_rating: e.target.value })}
                    placeholder="4.7"
                  />
                </div>
                <div>
                  <Label htmlFor="map_reviews">Reviews Count (Optional)</Label>
                  <Input
                    id="map_reviews"
                    type="number"
                    min="0"
                    value={formData.map_reviews}
                    onChange={(e) => setFormData({ ...formData, map_reviews: e.target.value })}
                    placeholder="3"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min="0"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingOffice ? 'Update Office' : 'Create Office'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
                     <CardTitle className="flex items-center">
             <Building className="mr-2 h-5 w-5" />
             Contact Offices ({Array.isArray(offices) ? offices.length : 0})
           </CardTitle>
        </CardHeader>
                 <CardContent>
           {loading ? (
             <div className="text-center py-8">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
               <p className="mt-2 text-gray-600">Loading offices...</p>
             </div>
           ) : !Array.isArray(offices) ? (
             <div className="text-center py-8">
               <p className="text-red-600">Error: Invalid data format received</p>
               <Button onClick={fetchOffices} className="mt-2">Retry</Button>
             </div>
                      ) : offices.length === 0 ? (
             <div className="text-center py-8">
               <p className="text-gray-600">No contact offices found</p>
               <Button onClick={() => setIsDialogOpen(true)} className="mt-2">
                 <Plus className="mr-2 h-4 w-4" />
                 Add First Office
               </Button>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Title</TableHead>
                   <TableHead>Type</TableHead>
                   <TableHead>Location</TableHead>
                   <TableHead>Contact</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead>Order</TableHead>
                   <TableHead>Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {offices.map((office) => (
                  <TableRow key={office.id}>
                    <TableCell>
                      <div>
                        <div className="font-normal">{office.title}</div>
                        <div className="text-sm text-gray-500 whitespace-pre-line">
                          {office.office_name}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getOfficeTypeColor(office.office_type)}>
                        {office.office_type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {office.location}
                        </div>
                        <div className="text-gray-500 mt-1">
                          {office.postal_address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm space-y-1">
                        <div className="flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {office.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {office.phone}
                        </div>
                        {office.helpdesk && (
                          <div className="flex items-center">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            {office.helpdesk}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleStatus(office)}
                      >
                        {office.status === 'active' ? (
                          <Eye className="h-4 w-4 text-green-600" />
                        ) : (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{office.order}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(office)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(office.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContactManagement;
