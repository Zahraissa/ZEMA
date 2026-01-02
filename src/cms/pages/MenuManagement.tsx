import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronDown,
  MoreHorizontal,
  Menu,
  FolderOpen,
  Link,
  Settings
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"
import { MenuType } from "@/services/api"
import Swal from "sweetalert2"

export default function MenuManagement() {
  const [menuTypes, setMenuTypes] = useState<MenuType[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchMenuTypes()
  }, [])

  const fetchMenuTypes = async () => {
    try {
      setLoading(true)
      const response = await managementAPI.getMenuTypes()
      setMenuTypes(response.data || [])
    } catch (error) {
      console.error('Error fetching menu types:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch menu types.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    })

    if (result.isConfirmed) {
      try {
        await managementAPI.deleteMenuType(id)
        await fetchMenuTypes() // Refresh the menu types list
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Menu type has been deleted.',
        })
      } catch (error: any) {
        console.error('Error deleting menu type:', error)
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.response?.data?.message || 'Failed to delete menu type.',
        })
      }
    }
  }

  const handleEdit = (id: number) => {
    navigate(`/cms/menu-editor/${id}`)
  }

  const handleView = (id: number) => {
    navigate(`/cms/menu-editor/${id}`)
  }

  const filteredMenuTypes = menuTypes.filter(menuType =>
    menuType.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (menuType.description && menuType.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>
      case 'inactive':
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Calculate statistics
  const totalMenus = menuTypes.length
  const activeMenus = menuTypes.filter(menu => menu.status === 'active').length
  const inactiveMenus = menuTypes.filter(menu => menu.status === 'inactive').length
  const menusWithGroups = menuTypes.filter(menu => menu.menu_groups && menu.menu_groups.length > 0).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading menu types...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Menu Management</h1>
          <p className="text-muted-foreground">
            Manage your website navigation menus and dropdown items
          </p>
        </div>
        <Button onClick={() => navigate("/cms/create-menu")}>
          <Plus className="w-4 h-4 mr-2" />
          Create Menu
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Menus</CardTitle>
            <Menu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{totalMenus}</div>
            <p className="text-xs text-muted-foreground">
              All menu types in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Active Menus</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-green-600">{activeMenus}</div>
            <p className="text-xs text-muted-foreground">
              Live menus on the website
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Inactive Menus</CardTitle>
            <FolderOpen className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-yellow-600">{inactiveMenus}</div>
            <p className="text-xs text-muted-foreground">
              Disabled menus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">With Dropdowns</CardTitle>
            <ChevronDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-blue-600">{menusWithGroups}</div>
            <p className="text-xs text-muted-foreground">
              Menus with dropdown items
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Menu Types</CardTitle>
          <CardDescription>
            {filteredMenuTypes.length} menu type{filteredMenuTypes.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search menu types..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Groups</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMenuTypes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {searchTerm ? 'No menu types found matching your search.' : 'No menu types found.'}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMenuTypes.map((menuType) => (
                    <TableRow key={menuType.id}>
                      <TableCell className="font-normal">
                        <div className="flex items-center space-x-2">
                          <Menu className="w-4 h-4 text-muted-foreground" />
                          <span>{menuType.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-muted-foreground max-w-sm">
                          {menuType.description || 'No description'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <FolderOpen className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">
                            {menuType.menu_groups?.length || 0} group{(menuType.menu_groups?.length || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(menuType.status)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{formatDate(menuType.created_at)}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(menuType.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(menuType.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(menuType.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
