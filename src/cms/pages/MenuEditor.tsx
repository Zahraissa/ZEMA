import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Save, 
  Plus, 
  Trash2, 
  Menu, 
  FolderOpen, 
  Link,
  GripVertical,
  RefreshCw,
  Eye,
  Settings,
  X,
  Edit3
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { managementAPI } from "@/services/api";
import { MenuType, MenuGroup, MenuItem } from "@/services/api";
import { DraggableMenu } from "@/components/ui/draggable-menu";
import { menuService } from "@/services/menuService";
import Swal from "sweetalert2";

// Edit Group Modal Component
interface EditGroupModalProps {
  group: MenuGroup | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (group: MenuGroup) => void;
}

function EditGroupModal({ group, isOpen, onClose, onSave }: EditGroupModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || "",
        description: group.description || "",
        status: group.status || "active"
      });
    }
  }, [group]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a group name.',
      });
      return;
    }

    if (group) {
      onSave({
        ...group,
        ...formData
      });
    }
    onClose();
  };

  if (!isOpen || !group) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal">Edit Menu Group</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="groupName">Group Name *</Label>
            <Input
              id="groupName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupDescription">Description</Label>
            <Textarea
              id="groupDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter group description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="groupStatus">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => 
                setFormData(prev => ({ ...prev, status: value }))
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              <Save className="w-4 h-4 mr-2" />
              Update Group
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Item Modal Component
interface EditItemModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: MenuItem) => void;
}

function EditItemModal({ item, isOpen, onClose, onSave }: EditItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    status: "active" as "active" | "inactive"
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        link: item.link || "",
        status: item.status || "active"
      });
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter an item name.',
      });
      return;
    }

    if (item) {
      onSave({
        ...item,
        ...formData
      });
    }
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal">Edit Menu Item</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name *</Label>
            <Input
              id="itemName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemDescription">Description</Label>
            <Textarea
              id="itemDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemLink">Link</Label>
            <Input
              id="itemLink"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Enter link (e.g., /about)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemStatus">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => 
                setFormData(prev => ({ ...prev, status: value }))
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              <Save className="w-4 h-4 mr-2" />
              Update Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Add Item Modal Component
interface AddItemModalProps {
  groupId: number;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: MenuItem) => void;
}

function AddItemModal({ groupId, isOpen, onClose, onAdd }: AddItemModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    link: "",
    status: "active" as "active" | "inactive"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter an item name.',
      });
      return;
    }

    const newItem: MenuItem = {
      id: Date.now(), // Temporary ID
      name: formData.name,
      description: formData.description,
      link: formData.link,
      icon: "",
      status: formData.status,
      order: 1 // Will be updated by the parent component
    };

    onAdd(newItem);
    setFormData({ name: "", description: "", link: "", status: "active" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-normal">Add Menu Item</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newItemName">Item Name *</Label>
            <Input
              id="newItemName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter item name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newItemDescription">Description</Label>
            <Textarea
              id="newItemDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter item description"
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newItemLink">Link</Label>
            <Input
              id="newItemLink"
              value={formData.link}
              onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Enter link (e.g., /about)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newItemStatus">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: "active" | "inactive") => 
                setFormData(prev => ({ ...prev, status: value }))
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
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-to-r from-primary to-accent">
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function MenuEditor() {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active"
  });
  
  const [menuGroups, setMenuGroups] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [editGroupModal, setEditGroupModal] = useState<{ isOpen: boolean; group: MenuGroup | null }>({
    isOpen: false,
    group: null
  });
  const [editItemModal, setEditItemModal] = useState<{ isOpen: boolean; item: MenuItem | null }>({
    isOpen: false,
    item: null
  });
  const [addItemModal, setAddItemModal] = useState<{ isOpen: boolean; groupId: number | null }>({
    isOpen: false,
    groupId: null
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchMenu(parseInt(id));
    }
  }, [id]);

  const fetchMenu = async (menuId: number) => {
    try {
      setInitialLoading(true);
      const response = await managementAPI.getMenuType(menuId);
      const menu = response.data;
      
      if (menu) {
        setFormData({
          name: menu.name || "",
          description: menu.description || "",
          status: menu.status || "active"
        });
        
        if (menu.menu_groups) {
          setMenuGroups(menu.menu_groups.map(group => ({
            ...group,
            menu_items: (group.menu_items || []).map(item => ({
              ...item,
              icon: item.icon || ""
            }))
          })));
        }
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch menu details.',
      });
      navigate("/cms/menu");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in the menu name.',
      });
      return;
    }

    try {
      setSaving(true);
      
      const menuData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        menu_groups: menuGroups.map((group, index) => ({
          name: group.name || `Group ${index + 1}`,
          description: group.description || "",
          status: group.status || "active",
          order: index + 1,
          menu_items: group.menu_items?.map((item, itemIndex) => ({
            name: item.name || `Item ${itemIndex + 1}`,
            description: item.description || "",
            link: item.link || "#",
            icon: item.icon || "",
            status: item.status || "active",
            order: itemIndex + 1
          })) || []
        }))
      };

      await managementAPI.updateMenuType(parseInt(id!), menuData);
      
      // Clear the menu cache so the header updates immediately
      menuService.clearMenuCache();
      
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Menu updated successfully! The header menu will refresh automatically.',
      });
      
      navigate("/cms/menu");
    } catch (error: any) {
      console.error('Error updating menu:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.response?.data?.message || 'Failed to update menu.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addMenuGroup = () => {
    const newGroup: MenuGroup = {
      id: Date.now(), // Temporary ID for new groups
      name: `New Group ${menuGroups.length + 1}`,
      description: "",
      status: "active",
      order: menuGroups.length + 1,
      menu_items: []
    };
    setMenuGroups(prev => [...prev, newGroup]);
  };

  const updateMenuGroup = (group: MenuGroup) => {
    setEditGroupModal({ isOpen: true, group });
  };

  const handleUpdateGroup = (updatedGroup: MenuGroup) => {
    const updatedGroups = menuGroups.map(g => 
      g.id === updatedGroup.id 
        ? { ...g, ...updatedGroup }
        : g
    );
    setMenuGroups(updatedGroups);
  };

  const deleteMenuGroup = (groupId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the menu group and all its items!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        setMenuGroups(prev => prev.filter(g => g.id !== groupId));
      }
    });
  };

  const addMenuItem = (groupId: number) => {
    setAddItemModal({ isOpen: true, groupId });
  };

  const handleAddItem = (newItem: MenuItem) => {
    const group = menuGroups.find(g => g.id === addItemModal.groupId);
    if (!group) return;

    const updatedGroups = menuGroups.map(g => 
      g.id === group.id 
        ? { 
            ...g, 
            menu_items: [...(g.menu_items || []), { ...newItem, order: (g.menu_items?.length || 0) + 1 }]
          }
        : g
    );
    setMenuGroups(updatedGroups);
  };

  const editMenuItem = (item: MenuItem) => {
    setEditItemModal({ isOpen: true, item });
  };

  const handleUpdateItem = (updatedItem: MenuItem) => {
    const updatedGroups = menuGroups.map(g => ({
      ...g,
      menu_items: g.menu_items?.map(i => 
        i.id === updatedItem.id 
          ? { ...i, ...updatedItem }
          : i
      )
    }));
    setMenuGroups(updatedGroups);
  };

  const deleteMenuItem = (itemId: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "This will delete the menu item!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedGroups = menuGroups.map(g => ({
          ...g,
          menu_items: g.menu_items?.filter(i => i.id !== itemId)
        }));
        setMenuGroups(updatedGroups);
      }
    });
  };

  // Utility function to validate reorder data
  const validateReorderData = (data: { id: number; order: number }[], type: 'group' | 'item') => {
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error(`${type} data must be a non-empty array`);
    }
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      if (!item || typeof item !== 'object') {
        throw new Error(`${type} data item ${i} must be an object`);
      }
      if (!Number.isInteger(item.id) || item.id <= 0) {
        throw new Error(`${type} data item ${i} must have a valid positive integer id`);
      }
      if (!Number.isInteger(item.order) || item.order <= 0) {
        throw new Error(`${type} data item ${i} must have a valid positive integer order`);
      }
    }
    
    return true;
  };

  const handleReorderGroups = async (groups: MenuGroup[]) => {
    console.log('handleReorderGroups called with:', groups);
    setMenuGroups(groups);
    
    try {
      const groupsWithIds = groups.filter(g => g.id > 0 && typeof g.order === 'number'); // Only existing groups with valid order
      console.log('Groups with IDs:', groupsWithIds);
      
      if (groupsWithIds.length > 0) {
        const reorderData = groupsWithIds.map(g => ({ 
          id: parseInt(g.id.toString()), 
          order: parseInt(g.order.toString()) 
        }));
        console.log('Sending reorder data:', reorderData);
        
        // Validate the data before sending
        validateReorderData(reorderData, 'group');
        
        // Add a small delay to ensure the drag operation is complete
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await managementAPI.reorderMenuGroups(reorderData);
        console.log('Reorder response:', response);
        
        // Clear cache to update header menu
        menuService.clearMenuCache();
        console.log('Menu cache cleared');
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Group order updated successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        console.log('No groups with valid IDs to reorder');
      }
    } catch (error: any) {
      console.error('Error reordering groups:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config
      });
      
      let errorMessage = 'Failed to save group order.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  const handleReorderItems = async (groupId: number, items: MenuItem[]) => {
    const updatedGroups = menuGroups.map(g => 
      g.id === groupId 
        ? { ...g, menu_items: items }
        : g
    );
    setMenuGroups(updatedGroups);
    
    try {
      const itemsWithIds = items.filter(i => i.id > 0 && typeof i.order === 'number'); // Only existing items with valid order
      if (itemsWithIds.length > 0) {
        const reorderData = itemsWithIds.map(i => ({ 
          id: parseInt(i.id.toString()), 
          order: parseInt(i.order.toString()) 
        }));
        console.log('Sending item reorder data:', reorderData);
        
        // Validate the data before sending
        validateReorderData(reorderData, 'item');
        
        await managementAPI.reorderMenuItems(reorderData);
        // Clear cache to update header menu
        menuService.clearMenuCache();
        
        // Show success message
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Item order updated successfully!',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        console.log('No items with valid IDs to reorder');
      }
    } catch (error: any) {
      console.error('Error reordering items:', error);
      
      let errorMessage = 'Failed to save item order.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const validationErrors = Object.values(error.response.data.errors).flat();
        errorMessage = `Validation errors: ${validationErrors.join(', ')}`;
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
    }
  };

  const refreshMenu = () => {
    if (id) {
      fetchMenu(parseInt(id));
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-50"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/menu")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Edit Menu</h1>
          <p className="text-muted-foreground">
            Manage menu structure and navigation items
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Menu Details Form */}
          <Card>
            <CardHeader>
              <CardTitle>Menu Information</CardTitle>
              <CardDescription>
                Basic information about this menu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Menu Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter menu name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter menu description"
                    rows={3}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Menu Groups and Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Menu Groups & Items</CardTitle>
                  <CardDescription>
                    Drag and drop to reorder. Click the grip handle to drag items.
                  </CardDescription>
                </div>
                <Button onClick={addMenuGroup} variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Group
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {menuGroups.length === 0 ? (
                <div className="text-center py-12">
                  <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-normal text-gray-900 mb-2">No menu groups</h3>
                  <p className="text-gray-500 mb-4">
                    Get started by creating your first menu group.
                  </p>
                  <Button onClick={addMenuGroup}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Menu Group
                  </Button>
                </div>
              ) : (
                <DraggableMenu
                  groups={menuGroups}
                  onEditGroup={updateMenuGroup}
                  onDeleteGroup={deleteMenuGroup}
                  onEditItem={editMenuItem}
                  onDeleteItem={deleteMenuItem}
                  onAddItem={addMenuItem}
                  onReorderGroups={handleReorderGroups}
                  onReorderItems={handleReorderItems}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Menu Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Menu Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4">
                  <h3 className="font-normal text-lg mb-3">
                    {formData.name || "Menu Name"}
                  </h3>
                  
                  <div className="space-y-2">
                    {menuGroups.slice(0, 3).map((group, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-3">
                        <div className="font-normal text-sm text-primary">
                          {group.name}
                        </div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          {group.menu_items?.slice(0, 3).map((item, itemIndex) => (
                            <div key={itemIndex} className="flex items-center gap-2">
                              <Link className="w-3 h-3" />
                              <span>{item.name}</span>
                            </div>
                          ))}
                          {group.menu_items && group.menu_items.length > 3 && (
                            <div className="text-xs text-muted-foreground">
                              +{group.menu_items.length - 3} more items
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {menuGroups.length > 3 && (
                      <div className="text-xs text-muted-foreground">
                        +{menuGroups.length - 3} more groups
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  <div>Status: <span className="font-normal capitalize">{formData.status}</span></div>
                  <div>Groups: <span className="font-normal">{menuGroups.length}</span></div>
                  <div>Total Items: <span className="font-normal">
                    {menuGroups.reduce((total, group) => total + (group.menu_items?.length || 0), 0)}
                  </span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Menu Actions
              </CardTitle>
              <CardDescription>
                Manage your menu
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Saving Menu...' : 'Save Menu'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={refreshMenu}
                  disabled={loading}
                  className="w-full"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Save changes and update the header menu
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <EditGroupModal
        group={editGroupModal.group}
        isOpen={editGroupModal.isOpen}
        onClose={() => setEditGroupModal({ isOpen: false, group: null })}
        onSave={handleUpdateGroup}
      />
      
      <EditItemModal
        item={editItemModal.item}
        isOpen={editItemModal.isOpen}
        onClose={() => setEditItemModal({ isOpen: false, item: null })}
        onSave={handleUpdateItem}
      />
      
      <AddItemModal
        groupId={addItemModal.groupId || 0}
        isOpen={addItemModal.isOpen}
        onClose={() => setAddItemModal({ isOpen: false, groupId: null })}
        onAdd={handleAddItem}
      />
    </div>
  );
}
