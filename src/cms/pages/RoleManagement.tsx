import React, { useState, useEffect } from 'react';
import { roleAPI, permissionAPI, Role, Permission } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Edit, Plus, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function RoleManagement() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [permissionsGrouped, setPermissionsGrouped] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as number[]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [rolesResponse, permissionsResponse, permissionsGroupedResponse] = await Promise.all([
        roleAPI.getRoles(),
        permissionAPI.getPermissions(),
        permissionAPI.getPermissionsGrouped()
      ]);

      if (rolesResponse.success) {
        console.log('Roles loaded:', rolesResponse.data);
        console.log('Role names:', rolesResponse.data.map((r: Role) => r.name));
        setRoles(rolesResponse.data);
      } else {
        console.error('Failed to load roles:', rolesResponse.message);
        toast.error('Failed to load roles');
      }
      
      if (permissionsResponse.success) {
        setPermissions(permissionsResponse.data);
      } else {
        console.error('Failed to load permissions:', permissionsResponse.message);
        toast.error('Failed to load permissions');
      }
      
      if (permissionsGroupedResponse.success) {
        setPermissionsGrouped(permissionsGroupedResponse.data);
      } else {
        console.error('Failed to load grouped permissions:', permissionsGroupedResponse.message);
        toast.error('Failed to load grouped permissions');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if role name already exists (for new roles)
    if (!editingRole) {
      const existingRole = roles.find(role => 
        role.name.toLowerCase() === formData.name.toLowerCase()
      );
      if (existingRole) {
        toast.error('A role with this name already exists. Please choose a different name.');
        return;
      }
    }
    
    try {
      if (editingRole) {
        const response = await roleAPI.updateRole(editingRole.id, formData);
        if (response.success) {
          toast.success('Role updated successfully');
          setRoles(roles.map(role => role.id === editingRole.id ? response.data : role));
        }
      } else {
        const response = await roleAPI.createRole(formData);
        if (response.success) {
          toast.success('Role created successfully');
          setRoles([...roles, response.data]);
        }
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error saving role:', error);
      
      // Handle specific validation errors
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        if (errors?.name?.includes('already been taken')) {
          toast.error('A role with this name already exists. Please choose a different name.');
        } else {
          toast.error('Validation error: ' + Object.values(errors).flat().join(', '));
        }
      } else {
        toast.error('Failed to save role');
      }
    }
  };

  const handleEdit = (role: Role) => {
    console.log('Editing role:', role);
    console.log('Role permissions:', role.permissions);
    
    setEditingRole(role);
    const rolePermissions = role.permissions?.map(p => p.id) || [];
    console.log('Setting form permissions:', rolePermissions);
    
    setFormData({
      name: role.name,
      description: role.description || '',
      permissions: rolePermissions
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (role: Role) => {
    if (!confirm(`Are you sure you want to delete the role "${role.name}"?`)) {
      return;
    }

    try {
      const response = await roleAPI.deleteRole(role.id);
      if (response.success) {
        toast.success('Role deleted successfully');
        setRoles(roles.filter(r => r.id !== role.id));
      }
    } catch (error) {
      console.error('Error deleting role:', error);
      toast.error('Failed to delete role');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      permissions: []
    });
    setEditingRole(null);
  };

  const handlePermissionChange = (permissionId: number, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => id !== permissionId)
      }));
    }
  };

  const handleGroupPermissionChange = (groupPermissions: Permission[], checked: boolean) => {
    const permissionIds = groupPermissions.map(p => p.id);
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...permissionIds])]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(id => !permissionIds.includes(id))
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading roles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Role Management</h1>
          <p className="text-muted-foreground">Manage user roles and permissions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRole ? 'Edit Role' : 'Create Role'}</DialogTitle>
              <DialogDescription>
                {editingRole ? 'Update role information and permissions' : 'Create a new role with specific permissions'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter role name"
                  required
                />
                {!editingRole && (
                  <div className="text-xs text-muted-foreground">
                    <p className="mb-1">Existing roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {roles.map(r => (
                        <span key={r.id} className="px-2 py-1 bg-gray-100 rounded text-xs">
                          {r.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter role description"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-900 font-medium">Permissions</Label>
                  <span className="text-sm text-gray-600">
                    {formData.permissions.length} selected
                  </span>
                </div>
                <div className="space-y-4 max-h-60 overflow-y-auto border border-gray-300 rounded-md p-4 bg-gray-50">
                  {Object.entries(permissionsGrouped).map(([group, groupPermissions]) => (
                    <div key={group} className="space-y-2">
                      <div className="flex items-center space-x-2 bg-white p-2 rounded border">
                        <Checkbox
                          id={`group-${group}`}
                          checked={groupPermissions.every(p => formData.permissions.includes(p.id))}
                          onCheckedChange={(checked) => handleGroupPermissionChange(groupPermissions, checked as boolean)}
                        />
                        <Label htmlFor={`group-${group}`} className="font-medium text-gray-900">
                          {group.charAt(0).toUpperCase() + group.slice(1)} ({groupPermissions.length} permissions)
                        </Label>
                      </div>
                      <div className="ml-6 space-y-2">
                        {groupPermissions.map((permission) => (
                          <div key={permission.id} className="flex items-center space-x-2 bg-white p-2 rounded border hover:bg-gray-50">
                            <Checkbox
                              id={`permission-${permission.id}`}
                              checked={formData.permissions.includes(permission.id)}
                              onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                            />
                            <Label htmlFor={`permission-${permission.id}`} className="text-sm text-gray-900 flex-1">
                              <div className="font-medium">{permission.display_name || permission.name}</div>
                              <div className="text-xs text-gray-600">{permission.name}</div>
                              {permission.description && (
                                <div className="text-xs text-gray-500 mt-1">{permission.description}</div>
                              )}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingRole ? 'Update Role' : 'Create Role'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {roles.map((role) => (
          <Card key={role.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle>{role.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(role)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(role)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {role.description && (
                <CardDescription>{role.description}</CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">Permissions:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions?.map((permission) => (
                    <Badge key={permission.id} variant="secondary">
                      {permission.display_name || permission.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
