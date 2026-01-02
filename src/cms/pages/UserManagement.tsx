import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Search, UserCog, Shield, User, Mail } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI, User as UserType } from "@/services/api"
import Swal from 'sweetalert2'

export default function UserManagement() {
  const [users, setUsers] = useState<UserType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await managementAPI.getUsers()
      if (response.success) {
        setUsers(response.data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load users. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    const user = users.find(u => u.id === id)
    if (user?.role === 'admin') {
      await Swal.fire({
        icon: 'error',
        title: 'Cannot Delete Admin',
        text: 'Admin users cannot be deleted for security reasons.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    const result = await Swal.fire({
      title: 'Delete User?',
      text: `Are you sure you want to delete ${user?.name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete user!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await managementAPI.deleteUser(id)
        setUsers(users.filter(u => u.id !== id))
        await Swal.fire({
          icon: 'success',
          title: 'User Deleted!',
          text: 'The user has been successfully deleted.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error: any) {
        console.error('Error deleting user:', error)
        let errorMessage = "Failed to delete user."
        
        if (error.response?.status === 403) {
          errorMessage = error.response?.data?.message || "You don't have permission to delete this user."
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
        
        await Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: errorMessage,
          confirmButtonColor: '#ef4444'
        })
      }
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/cms/edit-user/${id}`)
  }

  const toggleStatus = async (id: number) => {
    const user = users.find(u => u.id === id)
    if (user?.role === 'admin') {
      await Swal.fire({
        icon: 'error',
        title: 'Cannot Modify Admin',
        text: 'Admin user status cannot be changed.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    const newStatus = user?.status === 'active' ? 'inactive' : 'active'
    
    try {
      await managementAPI.updateUserStatus(id, newStatus)
      setUsers(users.map(u =>
        u.id === id ? { ...u, status: newStatus } : u
      ))
      
      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `User status changed to ${newStatus}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error: any) {
      console.error('Error updating user status:', error)
      let errorMessage = "Failed to update user status."
      
      if (error.response?.status === 403) {
        errorMessage = error.response?.data?.message || "You don't have permission to modify this user."
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Status Update Failed',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      })
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-500" />
      case 'author':
        return <User className="w-4 h-4 text-green-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'editor':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'author':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  const activeUsers = users.filter(u => u.status === 'active').length
  const adminUsers = users.filter(u => u.role === 'admin').length
  const editorUsers = users.filter(u => u.role === 'editor').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage system users, roles, and permissions
          </p>
        </div>
        <Button 
          onClick={() => navigate("/cms/add-user")}
          className="bg-gradient-to-r from-primary to-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Users</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              All registered users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Active Users</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-green-600">{activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Administrators</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-red-600">{adminUsers}</div>
            <p className="text-xs text-muted-foreground">
              Admin privileges
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Editors</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-blue-600">{editorUsers}</div>
            <p className="text-xs text-muted-foreground">
              Content editors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            Manage user accounts, roles, and access permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-normal text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-normal">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <Badge 
                        className={`${getRoleBadgeColor(user.role)} text-white`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === 'active' ? 'default' : 'secondary'}
                      className={user.status === 'active' ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500'}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" title="View User">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(user.id)}
                        title="Edit User"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(user.id)}
                        title={`${user.status === 'active' ? 'Deactivate' : 'Activate'} User`}
                      >
                        <Badge variant="outline" className="cursor-pointer">
                          Toggle
                        </Badge>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(user.id)}
                        title="Delete User"
                        disabled={user.role === 'admin'}
                      >
                        <Trash2 className={`w-4 h-4 ${user.role === 'admin' ? 'text-gray-400' : 'text-red-500'}`} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found matching your search criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
