import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Settings,
  Network,
  Users,
  Shield,
  GraduationCap,
  Search,
  Megaphone,
  Building,
  Globe,
  CheckCircle,
  GripVertical
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

interface AuthorityFunction {
  id: number;
  title: string;
  description: string;
  icon?: string;
  order: number;
  status: string;
  additional_data?: any;
}

const AuthorityFunctionsManagement = () => {
  const [functions, setFunctions] = useState<AuthorityFunction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFunction, setEditingFunction] = useState<AuthorityFunction | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "settings",
    order: 1,
    status: "active"
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchFunctions();
  }, []);

  const fetchFunctions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/authority-functions');
      if (response.data.success) {
        setFunctions(response.data.data.data || response.data.data);
      }
    } catch (error) {
      console.error('Error fetching functions:', error);
      toast({
        title: "Error",
        description: "Failed to load authority functions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingFunction) {
        await api.put(`/authority-functions/${editingFunction.id}`, formData);
        toast({
          title: "Success",
          description: "Authority function updated successfully",
        });
      } else {
        await api.post('/authority-functions', formData);
        toast({
          title: "Success",
          description: "Authority function created successfully",
        });
      }
      
      setIsDialogOpen(false);
      setEditingFunction(null);
      resetForm();
      fetchFunctions();
    } catch (error: any) {
      console.error('Error saving function:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to save authority function",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (func: AuthorityFunction) => {
    setEditingFunction(func);
    setFormData({
      title: func.title,
      description: func.description,
      icon: func.icon || "settings",
      order: func.order,
      status: func.status
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/authority-functions/${id}`);
      toast({
        title: "Success",
        description: "Authority function deleted successfully",
      });
      fetchFunctions();
    } catch (error: any) {
      console.error('Error deleting function:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete authority function",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (func: AuthorityFunction) => {
    try {
      await api.patch(`/authority-functions/${func.id}/toggle-status`);
      toast({
        title: "Success",
        description: "Status updated successfully",
      });
      fetchFunctions();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "settings",
      order: 1,
      status: "active"
    });
  };

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'settings': Settings,
      'network': Network,
      'users': Users,
      'shield': Shield,
      'graduation-cap': GraduationCap,
      'search': Search,
      'megaphone': Megaphone,
      'building': Building,
      'globe': Globe,
      'check-circle': CheckCircle
    };
    
    return iconMap[iconName] || Settings;
  };

  const openNewDialog = () => {
    setEditingFunction(null);
    resetForm();
    setIsDialogOpen(true);
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
          <h1 className="text-3xl font-normal text-gray-900">Authority Functions Management</h1>
          <p className="text-gray-600 mt-2">Manage the functions and responsibilities of the authority</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add Function</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingFunction ? "Edit Authority Function" : "Add New Authority Function"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter function title"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">Icon</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="settings">Settings</SelectItem>
                      <SelectItem value="network">Network</SelectItem>
                      <SelectItem value="users">Users</SelectItem>
                      <SelectItem value="shield">Shield</SelectItem>
                      <SelectItem value="graduation-cap">Graduation Cap</SelectItem>
                      <SelectItem value="search">Search</SelectItem>
                      <SelectItem value="megaphone">Megaphone</SelectItem>
                      <SelectItem value="building">Building</SelectItem>
                      <SelectItem value="globe">Globe</SelectItem>
                      <SelectItem value="check-circle">Check Circle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter function description"
                  rows={4}
                  required
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
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
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
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingFunction ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {functions.map((func) => {
          const IconComponent = getIconComponent(func.icon || 'settings');
          return (
            <Card key={func.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-normal text-gray-900">{func.title}</h3>
                        <Badge variant={func.status === 'active' ? 'default' : 'secondary'}>
                          {func.status}
                        </Badge>
                        <Badge variant="outline">Order: {func.order}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{func.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleStatus(func)}
                    >
                      {func.status === 'active' ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(func)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the authority function.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(func.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {functions.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Settings className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-normal text-gray-900 mb-2">No Authority Functions</h3>
            <p className="text-gray-600 mb-4">Get started by adding your first authority function.</p>
            <Button onClick={openNewDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Function
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuthorityFunctionsManagement;