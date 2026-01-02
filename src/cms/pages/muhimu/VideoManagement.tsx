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
import { Plus, Edit, Trash2, Eye, EyeOff, GripVertical, Play, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { managementAPI, Video } from "@/services/api";
import Swal from 'sweetalert2';



const VideoManagement = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtube_url: "",
    is_main: false,
    is_active: true,
    order: 0,
    duration: "",
    published_date: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await managementAPI.getVideos();
      if (response.success) {
        setVideos(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch videos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      toast({
        title: "Error",
        description: "Failed to fetch videos",
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
      title: editingVideo ? 'Updating Video...' : 'Creating Video...',
      text: 'Please wait...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("youtube_url", formData.youtube_url);
    formDataToSend.append("is_main", formData.is_main ? "1" : "0");
    formDataToSend.append("is_active", formData.is_active ? "1" : "0");
    formDataToSend.append("order", formData.order.toString());
    formDataToSend.append("duration", formData.duration);
    formDataToSend.append("published_date", formData.published_date);

    try {
      let response;
      if (editingVideo) {
        response = await managementAPI.updateVideo(editingVideo.id, formDataToSend);
      } else {
        response = await managementAPI.createVideo(formDataToSend);
      }

      if (response.success) {
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: editingVideo ? 'Video updated successfully!' : 'Video created successfully!',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        });
        
        setIsDialogOpen(false);
        resetForm();
        fetchVideos();
      } else {
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: response.message || 'Failed to save video. Please try again.',
          confirmButtonColor: '#ef4444'
        });
      }
    } catch (error) {
      console.error('Error saving video:', error);
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to save video. Please try again.',
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
        title: 'Deleting Video...',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        const response = await managementAPI.deleteVideo(id);
        if (response.success) {
          // Show success message
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Video has been deleted successfully.',
            confirmButtonColor: '#10b981',
            timer: 2000,
            timerProgressBar: true
          });
          fetchVideos();
        } else {
          // Show error message
          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: response.message || 'Failed to delete video.',
            confirmButtonColor: '#ef4444'
          });
        }
      } catch (error) {
        console.error('Error deleting video:', error);
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete video.',
          confirmButtonColor: '#ef4444'
        });
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const response = await managementAPI.toggleVideoStatus(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Status updated successfully",
        });
        fetchVideos();
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

  const handleToggleMain = async (id: number) => {
    try {
      const response = await managementAPI.toggleVideoMain(id);
      if (response.success) {
        toast({
          title: "Success",
          description: "Main video updated successfully",
        });
        fetchVideos();
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update main video",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error toggling main video:', error);
      toast({
        title: "Error",
        description: "Failed to update main video",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description || "",
      youtube_url: video.youtube_url,
      is_main: video.is_main,
      is_active: video.is_active,
      order: video.order,
      duration: video.duration || "",
      published_date: video.published_date,
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      youtube_url: "",
      is_main: false,
      is_active: true,
      order: 0,
      duration: "",
      published_date: "",
    });
    setEditingVideo(null);
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setVideos(items);

    // Update order in backend
    const reorderData = items.map((item, index) => ({
      id: item.id,
      order: index + 1,
    }));

    try {
      const response = await managementAPI.reorderVideos(reorderData);
      if (!response.success) {
        toast({
          title: "Error",
          description: "Failed to reorder videos",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error reordering videos:', error);
      toast({
        title: "Error",
        description: "Failed to reorder videos",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading videos...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-normal">Videos ({videos.length})</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVideo ? "Edit Video" : "Add New Video"}
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
                <Label htmlFor="youtube_url">YouTube URL *</Label>
                <Input
                  id="youtube_url"
                  value={formData.youtube_url}
                  onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                />
              </div>
              
              {/* Video Thumbnail Preview */}
              {editingVideo && editingVideo.thumbnail_url && (
                <div>
                  <Label>Current Video Thumbnail</Label>
                  <div className="mt-2 relative">
                    <img
                      src={editingVideo.thumbnail_url}
                      alt={editingVideo.title}
                      className="w-full max-w-md h-48 object-cover rounded-lg border"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    YouTube ID: {editingVideo.youtube_id}
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="duration">Duration (e.g., 5:30)</Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="5:30"
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
                 {editingVideo && (
                   <p className="text-sm text-gray-500 mt-1">
                     Current: {new Date(editingVideo.published_date).toLocaleDateString()}
                   </p>
                 )}
               </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="is_main"
                  checked={formData.is_main}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_main: checked })}
                />
                <Label htmlFor="is_main">Main Video (Featured)</Label>
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
                  {editingVideo ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="videos">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
              {videos.map((video, index) => (
                <Draggable key={video.id} draggableId={video.id.toString()} index={index}>
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
                            <div className="relative">
                              <img
                                src={video.thumbnail_url}
                                alt={video.title}
                                className="w-16 h-12 object-cover rounded"
                              />
                              <Play className="w-4 h-4 text-white absolute inset-0 m-auto" />
                            </div>
                            <div>
                              <h3 className="font-normal">{video.title}</h3>
                              <p className="text-sm text-gray-500">
                                Published: {new Date(video.published_date).toLocaleDateString()}
                                {video.duration && ` • ${video.duration}`}
                              </p>
                              <p className="text-xs text-gray-400 truncate max-w-xs">
                                {video.youtube_url}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {video.is_main && (
                              <Badge variant="default" className="bg-yellow-500">
                                <Star className="w-3 h-3 mr-1" />
                                Main
                              </Badge>
                            )}
                            <Badge variant={video.is_active ? "default" : "secondary"}>
                              {video.is_active ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleStatus(video.id)}
                            >
                              {video.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleMain(video.id)}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(video)}
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
                                  <AlertDialogTitle>Delete Video</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this video? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(video.id)}>
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

export default VideoManagement;
