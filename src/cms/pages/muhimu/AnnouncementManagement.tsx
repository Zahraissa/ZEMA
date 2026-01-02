import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { managementAPI, Announcement } from "@/services/api";
import Swal from 'sweetalert2';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    published_date: "",
    is_active: true,
    order: 0,
    file: null as File | null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await managementAPI.getAnnouncements();
      if (response.success) {
        setAnnouncements(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch announcements",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast({
        title: "Error",
        description: "Failed to fetch announcements",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Show loading state
    Swal.fire({
      title: editingAnnouncement ? 'Updating Announcement...' : 'Creating Announcement...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("published_date", formData.published_date);
    formDataToSend.append("is_active", formData.is_active ? "1" : "0");
    formDataToSend.append("order", formData.order.toString());
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }

    try {
      let response;
      if (editingAnnouncement) {
        response = await managementAPI.updateAnnouncement(editingAnnouncement.id, formDataToSend);
      } else {
        response = await managementAPI.createAnnouncement(formDataToSend);
      }

      if (response.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: editingAnnouncement ? 'Announcement updated successfully!' : 'Announcement created successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
        
        setIsDialogOpen(false);
        resetForm();
        fetchAnnouncements();
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response.message || 'Failed to save announcement. Please try again.',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save announcement. Please try again.',
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const handleDelete = async (id: number) => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      // Show loading state
      Swal.fire({
        title: 'Deleting Announcement...',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await managementAPI.deleteAnnouncement(id);
        if (response.success) {
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Announcement has been deleted successfully.',
            confirmButtonColor: '#10b981',
            timer: 2000,
            timerProgressBar: true
          });
          fetchAnnouncements();
        } else {
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to delete announcement.',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error deleting announcement:', error);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete announcement.',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await managementAPI.toggleAnnouncementStatus(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
        fetchAnnouncements();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update status",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      description: announcement.description || "",
      published_date: announcement.published_date,
      is_active: announcement.is_active,
      order: announcement.order,
      file: null,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      published_date: "",
      is_active: true,
      order: 0,
      file: null,
    });
    setEditingAnnouncement(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(announcements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setAnnouncements(items);

    // Update order in backend
    const reorderData = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    try {
      const response = await managementAPI.reorderAnnouncements(reorderData);
      if (!response.success) {
        toast({
          title: "Error",
          description: "Failed to reorder announcements",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error reordering announcements:', error);
      toast({
        title: "Error",
        description: "Failed to reorder announcements",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading announcements...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-normal">Announcements ({announcements.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? "Edit Announcement" : "Add New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
                             <div>
                 <Label htmlFor="published_date">Published Date *</Label>
                 <Input
                   id="published_date"
                   type="date"
                   value={formData.published_date}
                   onChange={(e) => setFormData({ ...formData, published_date: e.target.value })}
                   required
                 />
                 {editingAnnouncement && (
                   <p className="text-sm text-gray-500 mt-1">
                     Current: {new Date(editingAnnouncement.published_date).toLocaleDateString()}
                   </p>
                 )}
               </div>
               <div>
                 <Label htmlFor="file">File (PDF, DOC, DOCX)</Label>
                 <Input
                   id="file"
                   type="file"
                   accept=".pdf,.doc,.docx"
                   onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                 />
                 {editingAnnouncement && editingAnnouncement.file_name && (
                   <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                     <p className="text-sm font-normal text-gray-700">Current File:</p>
                     <p className="text-sm text-gray-600">{editingAnnouncement.file_name}</p>
                     {editingAnnouncement.file_url && (
                       <a 
                         href={editingAnnouncement.file_url} 
                         target="_blank" 
                         rel="noopener noreferrer"
                         className="text-sm text-blue-600 hover:text-blue-800 underline"
                       >
                         View Current File
                       </a>
                     )}
                   </div>
                 )}
               </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAnnouncement ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="announcements">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {announcements.map((announcement, index) => (
                <Draggable key={announcement.id} draggableId={announcement.id.toString()} index={index}>
                  {(provided) => (
                    <Card
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div {...provided.dragHandleProps}>
                              <GripVertical className="w-5 h-5 text-gray-400 cursor-move" />
                            </div>
                            <FileText className="w-5 h-5 text-blue-500" />
                            <div>
                              <h3 className="font-normal">{announcement.title}</h3>
                              <p className="text-sm text-gray-500">
                                Published: {new Date(announcement.published_date).toLocaleDateString()}
                              </p>
                              {announcement.file_name && (
                                <p className="text-xs text-gray-400">File: {announcement.file_name}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={announcement.is_active ? "default" : "secondary"}>
                              {announcement.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(announcement.id)}
                            >
                              {announcement.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(announcement)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this announcement? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(announcement.id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default AnnouncementManagement;
