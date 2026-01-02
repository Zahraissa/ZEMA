import React, { useState, useEffect } from 'react';
import { userRoleAPI, roleAPI, User, Role } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RefreshCw } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Search, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function UserRoleAssignment() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userRoles, setUserRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<number[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [usersResponse, rolesResponse] = await Promise.all([
        userRoleAPI.getUsers(),
        roleAPI.getRoles()
      ]);

      if (usersResponse.success) {
        setUsers(usersResponse.data);
      } else {
        console.error('Failed to load users:', usersResponse.message);
        toast.error('Failed to load users');
      }
      
      if (rolesResponse.success) {
        // Load permissions for each role
        const rolesWithPermissions = await Promise.all(
          rolesResponse.data.map(async (role) => {
            try {
              const permissionsResponse = await roleAPI.getRolePermissions(role.id);
              if (permissionsResponse.success) {
                return { ...role, permissions: permissionsResponse.data };
              }
              return { ...role, permissions: [] };
            } catch (error) {
              console.error(`Error loading permissions for role ${role.id}:`, error);
              return { ...role, permissions: [] };
            }
          })
        );
        setRoles(rolesWithPermissions);
      } else {
        console.error('Failed to load roles:', rolesResponse.message);
        toast.error('Failed to load roles');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = async (user: User) => {
    setSelectedUser(user);
    await loadUserRoles(user.id);
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setSelectedUser(null);
      setUserRoles([]);
      setSelectedRoles([]);
    }
  };

  const loadUserRoles = async (userId: number) => {
    try {
      const response = await userRoleAPI.getUserRoles(userId);
      if (response.success) {
        setUserRoles(response.data);
        setSelectedRoles(response.data.map(role => role.id));
      } else {
        toast.error('Failed to load user roles');
      }
    } catch (error) {
      console.error('Error loading user roles:', error);
      toast.error('Failed to load user roles');
    }
  };

  const handleRefresh = async () => {
    if (selectedUser) {
      await loadUserRoles(selectedUser.id);
      toast.success('User roles refreshed');
    }
  };

  const handleRoleAssignment = async () => {
    if (!selectedUser) return;

    try {
      const response = await userRoleAPI.assignUserRoles(selectedUser.id, selectedRoles);
      if (response.success) {
        toast.success('User roles updated successfully');
        setUserRoles(response.data);
        
        setUsers(users.map(user => 
          user.id === selectedUser.id 
            ? { ...user, roles: response.data }
            : user
        ));
        
        setIsDialogOpen(false);
      }
    } catch (error) {
      console.error('Error updating user roles:', error);
      toast.error('Failed to update user roles');
    }
  };

  const handleRoleChange = (roleId: number, checked: boolean) => {
    if (checked) {
      setSelectedRoles(prev => [...prev, roleId]);
    } else {
      setSelectedRoles(prev => prev.filter(id => id !== roleId));
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Role Assignment</h1>
        <p className="text-muted-foreground">Assign roles to users to control their permissions</p>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                    {user.status}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUserSelect(user)}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Manage Roles
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-sm font-medium">Current Roles:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.roles?.map((role) => (
                    <Badge key={role.id} variant="secondary">
                      {role.name}
                    </Badge>
                  )) || (
                    <span className="text-sm text-muted-foreground">No roles assigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Assign Roles to {selectedUser?.name}</DialogTitle>
                <DialogDescription>
                  Select the roles you want to assign to this user. Users will inherit all permissions from their assigned roles.
                </DialogDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border rounded-lg">
                <Avatar>
                  <AvatarImage src={selectedUser.avatar} />
                  <AvatarFallback>
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Label>Available Roles</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-4">
                  {roles.map((role) => (
                    <div key={role.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`role-${role.id}`}
                        checked={selectedRoles.includes(role.id)}
                        onCheckedChange={(checked) => handleRoleChange(role.id, checked as boolean)}
                      />
                      <Label htmlFor={`role-${role.id}`} className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="font-medium">{role.name}</span>
                            {role.description && (
                              <span className="text-sm text-muted-foreground">{role.description}</span>
                            )}
                            {role.permissions && role.permissions.length > 0 && (
                              <span className="text-xs text-blue-600 mt-1">
                                {role.permissions.length} permission{role.permissions.length !== 1 ? 's' : ''} assigned
                              </span>
                            )}
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Show permissions for selected roles */}
              {selectedRoles.length > 0 && (
                <div className="space-y-4 mt-4">
                  <Label>Permissions from Selected Roles</Label>
                  <div className="max-h-60 overflow-y-auto border rounded-md p-4 bg-gray-50">
                    {(() => {
                      // Get all permissions from selected roles
                      const selectedRoleObjects = roles.filter(r => selectedRoles.includes(r.id));
                      const allPermissions = new Map<string, any>();
                      
                      selectedRoleObjects.forEach(role => {
                        if (role.permissions && Array.isArray(role.permissions)) {
                          role.permissions.forEach((permission: any) => {
                            const permKey = typeof permission === 'string' ? permission : permission.name || permission.id;
                            if (!allPermissions.has(permKey)) {
                              allPermissions.set(permKey, permission);
                            }
                          });
                        }
                      });
                      
                      const uniquePermissions = Array.from(allPermissions.values());
                      
                      if (uniquePermissions.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No permissions assigned to selected roles
                          </p>
                        );
                      }
                      
                      return (
                        <div className="space-y-2">
                          {uniquePermissions.map((permission: any) => {
                            const permName = typeof permission === 'string' ? permission : permission.name || permission.display_name || permission.id;
                            const permDesc = typeof permission === 'object' ? permission.description : null;
                            return (
                              <div key={permName} className="flex items-start space-x-2 p-2 bg-white rounded border">
                                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <span className="text-sm font-medium">{permName}</span>
                                  {permDesc && (
                                    <p className="text-xs text-muted-foreground mt-1">{permDesc}</p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => handleDialogClose(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRoleAssignment}>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update Roles
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

