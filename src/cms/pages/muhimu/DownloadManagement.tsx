import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Download as DownloadIcon, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { managementAPI, Download } from "@/services/api";
import Swal from 'sweetalert2';

const DownloadManagement = () => {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
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
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await managementAPI.getDownloads();
      if (response.success) {
        setDownloads(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch downloads",
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
      title: editingDownload ? 'Updating Download...' : 'Creating Download...',
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
      if (editingDownload) {
        response = await managementAPI.updateDownload(editingDownload.id, formDataToSend);
      } else {
        response = await managementAPI.createDownload(formDataToSend);
      }

      if (response.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: editingDownload ? 'Download updated successfully!' : 'Download created successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
        
        setIsDialogOpen(false);
        resetForm();
        fetchDownloads();
      }
    } catch (error) {
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save download. Please try again.',
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
        title: 'Deleting Download...',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await managementAPI.deleteDownload(id);
        if (response.success) {
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Download has been deleted successfully.',
            confirmButtonColor: '#10b981',
            timer: 2000,
            timerProgressBar: true
          });
          fetchDownloads();
        } else {
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to delete download.',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete download.',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await managementAPI.toggleDownloadStatus(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
        fetchDownloads();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (download: Download) => {
    setEditingDownload(download);
    setFormData({
      title: download.title,
      description: download.description || "",
      published_date: download.published_date,
      is_active: download.is_active,
      order: download.order,
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
    setEditingDownload(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(downloads);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setDownloads(items);

    // Update order in backend
    const reorderData = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    try {
      await managementAPI.reorderDownloads(reorderData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reorder downloads",
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (fileType?: string) => {
    if (!fileType) return <FileText className="w-5 h-5" />;
    
    const type = fileType.toLowerCase();
    if (type === 'pdf') return <FileText className="w-5 h-5 text-red-500" />;
    if (type === 'doc' || type === 'docx') return <FileText className="w-5 h-5 text-blue-500" />;
    if (type === 'xls' || type === 'xlsx') return <FileText className="w-5 h-5 text-green-500" />;
    if (type === 'ppt' || type === 'pptx') return <FileText className="w-5 h-5 text-orange-500" />;
    return <FileText className="w-5 h-5" />;
  };

  if (loading) {
    return <div className="text-center py-8">Loading downloads...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-normal">Downloads ({downloads.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Download
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingDownload ? "Edit Download" : "Add New Download"}
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
                 {editingDownload && (
                   <p className="text-sm text-gray-500 mt-1">
                     Current: {new Date(editingDownload.published_date).toLocaleDateString()}
                   </p>
                 )}
               </div>
               <div>
                 <Label htmlFor="file">File *</Label>
                 <Input
                   id="file"
                   type="file"
                   onChange={(e) => setFormData({ ...formData, file: e.target.files?.[0] || null })}
                   required={!editingDownload}
                 />
                 {editingDownload && editingDownload.file_name && (
                   <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                     <p className="text-sm font-normal text-gray-700">Current File:</p>
                     <p className="text-sm text-gray-600">{editingDownload.file_name}</p>
                     {editingDownload.file_size && (
                       <p className="text-sm text-gray-500">Size: {editingDownload.file_size}</p>
                     )}
                     {editingDownload.download_count > 0 && (
                       <p className="text-sm text-gray-500">Downloads: {editingDownload.download_count}</p>
                     )}
                     {editingDownload.file_url && (
                       <a 
                         href={editingDownload.file_url} 
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
                  {editingDownload ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="downloads">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {downloads.map((download, index) => (
                <Draggable key={download.id} draggableId={download.id.toString()} index={index}>
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
                            {getFileIcon(download.file_type)}
                            <div>
                              <h3 className="font-normal">{download.title}</h3>
                              <p className="text-sm text-gray-500">
                                Published: {new Date(download.published_date).toLocaleDateString()}
                                {download.file_size && ` • ${download.file_size}`}
                                {download.download_count > 0 && ` • ${download.download_count} downloads`}
                              </p>
                              <p className="text-xs text-gray-400">File: {download.file_name}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={download.is_active ? "default" : "secondary"}>
                              {download.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(download.id)}
                            >
                              {download.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(download)}
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
                                  <AlertDialogTitle>Delete Download</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this download? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(download.id)}>
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

export default DownloadManagement;
