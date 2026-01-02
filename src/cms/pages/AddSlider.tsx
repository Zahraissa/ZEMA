import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Save, Eye, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"
import { STORAGE_BASE_URL } from "@/config"
import Swal from 'sweetalert2'

export default function AddSlider() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    button_text: "",
    button_link: "",
    badge: "",
    year: "",
    has_video: false,
    order: 1,
    status: "active",
    is_active: true
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  
  const navigate = useNavigate()

  // Check if image is already loaded when preview URL changes (for cached images)
  useEffect(() => {
    if (imagePreview) {
      const img = new Image()
      img.onload = () => {
        console.log('Image preloaded successfully:', imagePreview)
        setImageLoaded(true)
      }
      img.onerror = () => {
        console.error('Image preload failed:', imagePreview)
        setImageLoaded(false)
      }
      img.src = imagePreview
    } else {
      setImageLoaded(false)
    }
  }, [imagePreview])

  const handleSaveAsDraft = async () => {
    if (!formData.title) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Title',
        text: 'Please enter a slider title.',
        confirmButtonColor: '#3085d6'
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('button_text', formData.button_text)
      formDataToSend.append('button_link', formData.button_link)
      formDataToSend.append('badge', formData.badge)
      formDataToSend.append('year', formData.year)
      formDataToSend.append('has_video', formData.has_video ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())
      formDataToSend.append('status', 'draft') // Set as draft
      formDataToSend.append('is_active', '0') // Inactive when draft
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      // Debug: Log what we're sending
      console.log('Sending draft slider data:')
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }
      
      const token = localStorage.getItem('authToken')
      console.log('Auth token present:', !!token)

      const response = await managementAPI.createSlider(formDataToSend)
      console.log('Draft slider creation response:', response)
      
      await Swal.fire({
        icon: 'success',
        title: 'Draft Saved!',
        text: 'Your slider has been saved as draft and is ready for future editing.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      })
      
      // Add a small delay to ensure the user sees the success message
      setTimeout(() => {
        navigate("/cms/sliders")
      }, 1000)
    } catch (error: any) {
      console.error('Error saving draft:', error)
      let errorMessage = "Failed to save draft. Please try again."
      
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
        title: 'Save Failed',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Title',
        text: 'Please enter a slider title.',
        confirmButtonColor: '#3085d6'
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('button_text', formData.button_text)
      formDataToSend.append('button_link', formData.button_link)
      formDataToSend.append('badge', formData.badge)
      formDataToSend.append('year', formData.year)
      formDataToSend.append('has_video', formData.has_video ? '1' : '0')
      formDataToSend.append('order', formData.order.toString())
      // Force status to 'active' and is_active to true when publishing
      formDataToSend.append('status', 'active')
      formDataToSend.append('is_active', '1')
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
        console.log('Image file appended to FormData:', {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        })
      } else {
        console.warn('No image file selected - slider will be created without image')
      }

      // Debug: Log what we're sending
      console.log('Sending slider data:')
      console.log('FormData entries count:', Array.from(formDataToSend.entries()).length)
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0] + ': [File] ' + (pair[1] as File).name + ' (' + (pair[1] as File).size + ' bytes)')
        } else {
          console.log(pair[0] + ': ' + pair[1])
        }
      }
      
      const token = localStorage.getItem('authToken')
      console.log('Auth token present:', !!token)
      console.log('Auth token (first 20 chars):', token?.substring(0, 20))

      const response = await managementAPI.createSlider(formDataToSend)
      console.log('Slider creation response:', response)
      
      await Swal.fire({
        icon: 'success',
        title: 'Slider Created!',
        text: 'Your new slider has been successfully created and is now live on your website.',
        confirmButtonColor: '#10b981',
        timer: 2500,
        timerProgressBar: true
      })
      
      // Trigger a storage event to notify HeroSection to refresh
      // This works across tabs/windows
      try {
        localStorage.setItem('slidersUpdated', Date.now().toString())
        localStorage.removeItem('slidersUpdated')
      } catch (e) {
        console.log('Could not trigger storage event:', e)
      }
      
      // Add a small delay to ensure the user sees the success message
      setTimeout(() => {
        navigate("/cms/sliders")
      }, 1000)
    } catch (error: any) {
      console.error('Error creating slider:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      let errorMessage = "Failed to create slider. Please try again."
      
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
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat()
        errorMessage = errors.join(', ')
      } else if (error.message) {
        errorMessage = error.message
      }
      
      await Swal.fire({
        icon: 'error',
        title: 'Creation Failed',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid File Type',
          text: 'Please select an image file (JPEG, PNG, GIF, etc.)',
          confirmButtonColor: '#ef4444'
        })
        return
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Swal.fire({
          icon: 'error',
          title: 'File Too Large',
          text: 'Please select an image smaller than 10MB',
          confirmButtonColor: '#ef4444'
        })
        return
      }
      
      // Reset image loaded state when new image is selected
      setImageLoaded(false)
      
      setImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      
      console.log('Image selected:', file.name, 'Size:', file.size, 'Type:', file.type)
      console.log('Preview URL created:', previewUrl)
      
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
    setImageLoaded(false)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
    
    Swal.fire({
      icon: 'info',
      title: 'Image Removed',
      text: 'Image has been removed from the form.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/sliders")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Add New Slider</h1>
          <p className="text-muted-foreground">
            Create a new slider for your website homepage
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Slider Details</CardTitle>
              <CardDescription>
                Configure your slider content and appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Slider Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter slider title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter slider description..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="button_text">Button Text</Label>
                    <Input
                      id="button_text"
                      placeholder="e.g., Learn More"
                      value={formData.button_text}
                      onChange={(e) => handleInputChange("button_text", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="button_link">Button Link</Label>
                    <Input
                      id="button_link"
                      placeholder="e.g., /services"
                      value={formData.button_link}
                      onChange={(e) => handleInputChange("button_link", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="badge">Badge Text</Label>
                    <Input
                      id="badge"
                      placeholder="e.g., New, Featured"
                      value={formData.badge}
                      onChange={(e) => handleInputChange("badge", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="year">Year</Label>
                    <Input
                      id="year"
                      placeholder="e.g., 2024"
                      value={formData.year}
                      onChange={(e) => handleInputChange("year", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 pt-6">
                      <Switch
                        id="has_video"
                        checked={formData.has_video}
                        onCheckedChange={(checked) => handleInputChange("has_video", checked)}
                      />
                      <Label htmlFor="has_video">Has Video</Label>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="order">Display Order</Label>
                    <Input
                      id="order"
                      type="number"
                      min="1"
                      value={formData.order}
                      onChange={(e) => handleInputChange("order", parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={(checked) => handleInputChange("is_active", checked)}
                  />
                  <Label htmlFor="is_active">Publish immediately</Label>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Slider Image</CardTitle>
              <CardDescription>
                Upload the main image for your slider (recommended: 1920x800px)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative w-full h-48 rounded-lg overflow-hidden">
                    {!imageLoaded && (
                      <div className="absolute inset-0 w-full h-full bg-muted/50 rounded-lg flex items-center justify-center z-10">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                          <span className="ml-2 text-sm text-muted-foreground">Loading image...</span>
                        </div>
                      </div>
                    )}
                    <img 
                      key={imagePreview}
                      src={imagePreview} 
                      alt="Slider preview" 
                      className={`w-full h-48 object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => {
                        console.log('Image loaded successfully:', imagePreview)
                        setImageLoaded(true)
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', e.currentTarget.src)
                        setImageLoaded(false)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-green-600 text-center">
                    Image selected: {imageFile?.name}
                  </p>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your image here, or click to browse
                  </p>
                  <input
                    type="file"
                    id="image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    Choose File
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Recommended: 1920x800px, max 2MB
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
              <CardDescription>
                How your slider will appear on the website
              </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg p-6 text-center">
                <div className="relative bg-muted/50 rounded h-32 mb-4 overflow-hidden">
                  {imagePreview ? (
                    <>
                      {!imageLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                            <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
                          </div>
                        </div>
                      )}
                      <img 
                        key={`preview-${imagePreview}`}
                        src={imagePreview} 
                        alt="Preview" 
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => {
                          console.log('Preview image loaded successfully:', imagePreview)
                          setImageLoaded(true)
                        }}
                        onError={(e) => {
                          console.error('Preview image failed to load:', e.currentTarget.src)
                          setImageLoaded(false)
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <span className="text-muted-foreground">Image Preview</span>
                    </div>
                  )}
                </div>
                <h3 className="font-normal text-lg mb-2">
                  {formData.title || "Slider Title"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {formData.description || "Slider description will appear here..."}
                </p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  {formData.badge && (
                    <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs">
                      {formData.badge}
                    </span>
                  )}
                  {formData.year && (
                    <span className="text-xs text-muted-foreground">
                      {formData.year}
                    </span>
                  )}
                </div>
                {formData.button_text && (
                  <Button size="sm">
                    {formData.button_text}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish Options</CardTitle>
              <CardDescription>
                Choose how to save your new slider
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
                  {loading ? 'Creating Slider...' : 'Create & Publish'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Creates the slider and makes it active on your website
                </p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleSaveAsDraft}
                  disabled={loading}
                >
                  {loading ? 'Saving Draft...' : 'Save as Draft'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Saves slider but keeps it hidden from website
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}