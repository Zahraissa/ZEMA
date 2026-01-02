import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye, Search, Image, RefreshCw } from "lucide-react"
import { managementAPI, Slider } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { STORAGE_BASE_URL } from "@/config"
import Swal from 'sweetalert2'

export default function SliderManagement() {
  const [sliders, setSliders] = useState<Slider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchSliders()
  }, [])

  // Refresh sliders when component comes into focus (e.g., after editing)
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing sliders')
      fetchSliders(true) // Force refresh when window gains focus
    }
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing sliders')
        fetchSliders(true) // Force refresh when page becomes visible
      }
    }
    
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const fetchSliders = async (forceRefresh = false) => {
    try {
      setLoading(true)
      
      // If force refresh, add cache busting to the request
      const response = await managementAPI.getSliders()
      setSliders(response.data || [])
      
      if (forceRefresh) {
        console.log('Force refresh completed, sliders updated')
        // Force a re-render of all images by updating the component state multiple times
        setTimeout(() => {
          setSliders([...response.data || []])
        }, 100)
        setTimeout(() => {
          setSliders([...response.data || []])
        }, 300)
        setTimeout(() => {
          setSliders([...response.data || []])
        }, 500)
        
        Swal.fire({
          icon: 'success',
          title: 'Refreshed!',
          text: 'Slider list has been refreshed with latest data.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        })
      }
    } catch (error) {
      console.error('Error fetching sliders:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load sliders. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredSliders = sliders.filter(slider =>
    slider.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Delete Slider?',
      text: 'Are you sure you want to delete this slider? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    })

    if (!result.isConfirmed) {
      return
    }

    try {
      await managementAPI.deleteSlider(id)
      setSliders(sliders.filter(slider => slider.id !== id))
      
      await Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'The slider has been successfully deleted.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error: any) {
      console.error('Error deleting slider:', error)
      
      let errorMessage = "Failed to delete slider."
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
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

  const handleEdit = (id: number) => {
    navigate(`/cms/edit-slider/${id}`)
  }

  const toggleStatus = async (id: number) => {
    const slider = sliders.find(s => s.id === id)
    if (!slider) return

    try {
      const newStatus = slider.status === 'active' ? 'inactive' : 'active'
      const formData = new FormData()
      formData.append('status', newStatus)
      formData.append('title', slider.title)
      formData.append('description', slider.description || '')
      formData.append('button_text', slider.button_text || '')
      formData.append('button_link', slider.button_link || '')
      formData.append('badge', slider.badge || '')
      formData.append('year', slider.year || '')
      formData.append('has_video', slider.has_video ? '1' : '0')
      formData.append('order', slider.order.toString())
      formData.append('is_active', slider.is_active ? '1' : '0')
      
      await managementAPI.updateSlider(id, formData)
      setSliders(sliders.map(s =>
        s.id === id ? { ...s, status: newStatus } : s
      ))
      await Swal.fire({
        icon: 'success',
        title: 'Status Updated!',
        text: `Slider status changed to ${newStatus}.`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    } catch (error: any) {
      console.error('Error updating slider status:', error)
      
      let errorMessage = "Failed to update slider status."
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Slider Management</h1>
          <p className="text-muted-foreground">
            Manage your website sliders and hero images
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-accent"
          onClick={() => navigate('/cms/add-slider')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Slider
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Sliders</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{sliders.length}</div>
            <p className="text-xs text-muted-foreground">
              {sliders.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Active Sliders</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-green-600">
              {sliders.filter(s => s.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently displayed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Draft Sliders</CardTitle>
            <Edit className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-yellow-600">
              {sliders.filter(s => s.status === 'inactive').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Need activation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Sliders</CardTitle>
          <CardDescription>
            All your website sliders in one place
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search sliders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                console.log('Force refresh triggered')
                fetchSliders(true)
              }}
              disabled={loading}
              title="Force Refresh Sliders"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>

          {/* Sliders Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Loading sliders...
                  </TableCell>
                </TableRow>
              ) : filteredSliders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No sliders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredSliders.map((slider) => (
                  <TableRow key={slider.id}>
                    <TableCell>
                      {slider.image_path ? (
                        <div className="w-16 h-12 rounded overflow-hidden">
                          <img 
                            key={`${slider.id}-${slider.image_path}-${Date.now()}-${Math.random()}-${Math.random()}-${Math.random()}`}
                            src={`${STORAGE_BASE_URL}${slider.image_path}?t=${new Date().getTime()}&v=${Math.random()}&refresh=true&nocache=${Date.now()}&force=${Math.random()}&bust=${Date.now()}`}
                            alt={slider.title}
                            className="w-full h-full object-cover"
                            onLoad={() => console.log(`Image loaded for slider ${slider.id}: ${slider.title}`)}
                            onError={(e) => {
                              console.error(`Image failed to load for slider ${slider.id}:`, e.currentTarget.src)
                              e.currentTarget.style.display = 'none';
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500" style={{ display: 'none' }}>
                            <Image className="w-4 h-4" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <Image className="w-4 h-4 text-gray-400" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-normal">{slider.title}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          slider.status === 'active' ? 'default' : 
                          slider.status === 'draft' ? 'outline' :
                          'secondary'
                        }
                        className={
                          slider.status === 'active' ? 'bg-green-500' : 
                          slider.status === 'draft' ? 'border-yellow-500 text-yellow-600' :
                          'bg-gray-500'
                        }
                      >
                        {slider.status.charAt(0).toUpperCase() + slider.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{slider.order}</TableCell>
                    <TableCell>{new Date(slider.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleEdit(slider.id)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => toggleStatus(slider.id)}
                        >
                          <Badge variant="outline" className="cursor-pointer">
                            Toggle
                          </Badge>
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDelete(slider.id)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
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