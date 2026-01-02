import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Upload } from "lucide-react"
import { managementAPI, Service } from "@/services/api"
import Swal from 'sweetalert2'

export default function EditService() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active" as "active" | "inactive" | "draft"
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchService()
    } else {
      navigate("/cms/services")
    }
  }, [id])

  const fetchService = async () => {
    if (!id) return

    try {
      setInitialLoading(true)
      const response = await managementAPI.getService(parseInt(id))
      if (response.success) {
        const service = response.data
        setFormData({
          name: service.name || "",
          description: service.description || "",
          status: service.status || "active"
        })
        setCurrentImagePath(service.image_path || null)
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Service Not Found',
          text: 'The requested service could not be found.',
          confirmButtonColor: '#ef4444'
        })
        navigate("/cms/services")
      }
    } catch (error) {
      console.error('Error fetching service:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load service. Please try again.',
        confirmButtonColor: '#ef4444'
      })
      navigate("/cms/services")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in service name and description.',
        confirmButtonColor: '#3085d6'
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', 'general') // Default category
      formDataToSend.append('status', formData.status)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await managementAPI.updateService(parseInt(id!), formDataToSend)
      
      await Swal.fire({
        icon: 'success',
        title: 'Service Updated!',
        text: 'Your service has been successfully updated.',
        confirmButtonColor: '#10b981',
        timer: 2500,
        timerProgressBar: true
      })
      navigate("/cms/services")
    } catch (error: any) {
      console.error('Error updating service:', error)
      let errorMessage = "Failed to update service. Please try again."
      
      if (error.response?.status === 401) {
        errorMessage = "Authentication failed. Please login again."
      } else if (error.response?.status === 422) {
        errorMessage = "Validation error: " + (error.response?.data?.message || "Invalid data")
        if (error.response?.data?.errors) {
          const errors = Object.values(error.response.data.errors).flat()
          errorMessage += " - " + errors.join(', ')
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      } else if (error.message) {
        errorMessage = error.message
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      Swal.fire({
        icon: 'info',
        title: 'Image Selected',
        text: `Selected: ${file.name}`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    setCurrentImagePath(null)
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-50"></div>
          <p className="mt-4 text-lg text-muted-foreground">Loading service...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/services")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Edit Service</h1>
          <p className="text-muted-foreground">
            Update service information
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Service Information</CardTitle>
              <CardDescription>
                Update the service details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter service name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Service Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your service in detail..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value: "active" | "inactive" | "draft") => handleInputChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Service Image</CardTitle>
              <CardDescription>
                Upload an image to showcase your service
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview || currentImagePath ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={imagePreview || (currentImagePath ? `https://egaz.go.tz/api/api/pictures/${currentImagePath}` : undefined)} 
                      alt="Service preview" 
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      Remove
                    </Button>
                  </div>
                  <p className="text-sm text-green-600 text-center">
                    {imagePreview ? `New image selected: ${imageFile?.name}` : `Current image: ${currentImagePath?.split('/').pop()}`}
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop image here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="service-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('service-image-upload')?.click()}
                  >
                    Choose Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 800x600px, max 2MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Service Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded h-32 flex items-center justify-center overflow-hidden">
                  {imagePreview || currentImagePath ? (
                    <img 
                      src={imagePreview || (currentImagePath ? `https://egaz.go.tz/api/api/pictures/${currentImagePath}` : undefined)} 
                      alt="Service preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">Service Image</span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-normal text-lg mb-2">
                    {formData.name || "Service Name"}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3 leading-relaxed line-clamp-4">
                    {formData.description || "Service description will appear here..."}
                  </p>

                  <div className="text-sm text-muted-foreground">
                    Status: <span className="font-normal capitalize">{formData.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Update Service</CardTitle>
              <CardDescription>
                Save your changes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button 
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary to-accent"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Updating Service...' : 'Update Service'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Updates the service with your changes
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
