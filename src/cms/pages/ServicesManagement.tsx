import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Search, Wrench, DollarSign, Star } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI, Service } from "@/services/api"
import Swal from 'sweetalert2'

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const response = await managementAPI.getServices()
      if (response.success) {
        setServices(response.data.data) // Paginated response structure
      }
    } catch (error) {
      console.error('Error fetching services:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load services. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleView = (id: number) => {
    // For now, navigate to edit page - could be enhanced with a view-only modal later
    navigate(`/cms/edit-service/${id}`)
  }

  const handleEdit = (id: number) => {
    navigate(`/cms/edit-service/${id}`)
  }

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Service?',
      text: 'Are you sure you want to delete this service? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
      try {
        await managementAPI.deleteService(id)
        // Refresh the services list to ensure consistency
        await fetchServices()
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The service has been successfully deleted.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error: any) {
        console.error('Error deleting service:', error)
        let errorMessage = "Failed to delete the service. Please try again."
        
        if (error.response?.status === 401) {
          errorMessage = "Authentication failed. Please login again."
        } else if (error.response?.status === 404) {
          errorMessage = "Service not found. It may have already been deleted."
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

  const toggleStatus = async (id: number) => {
    const service = services.find(s => s.id === id)
    if (!service) return

    // Cycle through statuses: active -> inactive -> draft -> active
    let newStatus: 'active' | 'inactive' | 'draft'
    switch (service.status) {
      case 'active':
        newStatus = 'inactive'
        break
      case 'inactive':
        newStatus = 'draft'
        break
      case 'draft':
        newStatus = 'active'
        break
      default:
        newStatus = 'active'
    }
    
    try {
      const formData = new FormData()
      formData.append('name', service.name)
      formData.append('description', service.description)
      formData.append('category', service.category || 'general') // Keep existing or default
      formData.append('status', newStatus)
      
      await managementAPI.updateService(id, formData)
      
      // Refresh the services list to ensure consistency
      await fetchServices()
      
      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Service status changed to ${newStatus}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Error updating service status:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update service status. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    }
  }

  const activeServices = services.filter(s => s.status === 'active').length
  const inactiveServices = services.filter(s => s.status === 'inactive').length
  const draftServices = services.filter(s => s.status === 'draft').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Services Management</h1>
          <p className="text-muted-foreground">
            Manage your company's services and offerings
          </p>
        </div>
        <Button 
          onClick={() => navigate("/cms/add-service")}
          className="bg-gradient-to-r from-primary to-accent"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Services</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              All services
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Active Services</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-green-600">{activeServices}</div>
            <p className="text-xs text-muted-foreground">
              Currently offered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Inactive Services</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-red-600">{inactiveServices}</div>
            <p className="text-xs text-muted-foreground">
              Not currently offered
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Draft Services</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-yellow-600">{draftServices}</div>
            <p className="text-xs text-muted-foreground">
              In development
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services</CardTitle>
          <CardDescription>
            Manage your service offerings - name, description, status, and images
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Image</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-t-4 border-blue-500 border-opacity-50"></div>
                      <span className="ml-3 text-muted-foreground">Loading services...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredServices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-muted-foreground">
                      {searchTerm ? `No services found matching "${searchTerm}"` : 'No services found'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div className="font-normal">{service.name}</div>
                    </TableCell>
                    <TableCell>
                      <div 
                        className="text-sm text-muted-foreground max-w-sm leading-relaxed"
                        style={{ 
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          wordWrap: 'break-word'
                        }}
                        title={service.description} // Show full text on hover
                      >
                        {service.description}
                      </div>
                    </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        service.status === 'active' 
                          ? 'default' 
                          : service.status === 'draft'
                          ? 'secondary'
                          : 'destructive'
                      }
                      className={
                        service.status === 'active' 
                          ? 'bg-green-600 hover:bg-green-700' 
                          : service.status === 'draft'
                          ? 'bg-yellow-600 hover:bg-yellow-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {service.image_path ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                        <img 
                          src={`https://egaz.go.tz/api/api/pictures/${service.image_path}`} 
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">No image</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="View"
                        onClick={() => handleView(service.id)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        title="Edit"
                        onClick={() => handleEdit(service.id)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => toggleStatus(service.id)}
                        title="Toggle Status"
                      >
                        <Badge variant="outline" className="cursor-pointer text-xs">
                          Toggle
                        </Badge>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(service.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}