import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Save, Eye, Trash2, RefreshCw } from "lucide-react"
import { managementAPI, Slider } from "@/services/api"
import { STORAGE_BASE_URL } from "@/config"
import Swal from 'sweetalert2'

export default function EditSlider() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
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
  const [currentImagePath, setCurrentImagePath] = useState<string | null>(null)
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [imageRefreshKey, setImageRefreshKey] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (id) {
      fetchSlider(parseInt(id))
    }
  }, [id])

  const fetchSlider = async (sliderId: number) => {
    try {
      setInitialLoading(true)
      setImageLoaded(false) // Reset image loaded state
      const response = await managementAPI.getSliders()
      const slider = response.data.find((s: Slider) => s.id === sliderId)
      
      if (slider) {
        setFormData({
          title: slider.title,
          description: slider.description || "",
          button_text: slider.button_text || "",
          button_link: slider.button_link || "",
          badge: slider.badge || "",
          year: slider.year || "",
          has_video: slider.has_video,
          order: slider.order,
          status: slider.status,
          is_active: slider.is_active
        })
        
        if (slider.image_path) {
          setCurrentImagePath(slider.image_path)
          // Add cache busting to initial image load
          const timestamp = new Date().getTime()
          const random = Math.random()
          const imageUrl = `${STORAGE_BASE_URL}${slider.image_path}?t=${timestamp}&v=${random}&refresh=true`
          setImagePreview(imageUrl)
          console.log('Setting initial image preview:', imageUrl)
        } else {
          setCurrentImagePath(null)
          setImagePreview(null)
        }
      } else {
        await Swal.fire({
          icon: 'error',
          title: 'Slider Not Found',
          text: 'The slider you are looking for does not exist.',
          confirmButtonColor: '#ef4444'
        })
        navigate("/cms/sliders")
      }
    } catch (error) {
      console.error('Error fetching slider:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load slider data. Please try again.',
        confirmButtonColor: '#ef4444'
      })
      navigate("/cms/sliders")
    } finally {
      setInitialLoading(false)
    }
  }

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
      
      if (removeCurrentImage) {
        formDataToSend.append('remove_image', '1')
      }

      const response = await managementAPI.updateSlider(parseInt(id!), formDataToSend)
      
      // Update the current image path if a new image was uploaded
      if (imageFile && response.data.image_path) {
        console.log('New image uploaded, updating path:', response.data.image_path)
        setCurrentImagePath(response.data.image_path)
        setImageFile(null)
        // Force a fresh image preview with ultra-aggressive cache busting
        const timestamp = new Date().getTime()
        const random = Math.random()
        setImagePreview(`${STORAGE_BASE_URL}${response.data.image_path}?t=${timestamp}&v=${random}&refresh=true&nocache=${Date.now()}&force=${Math.random()}&bust=${Date.now()}&cache=${Math.random()}`)
        // Force re-render of image component
        setImageRefreshKey(prev => prev + 1)
      }
      
      // Clear remove flag if image was removed
      if (removeCurrentImage) {
        console.log('Image removed, clearing state')
        setRemoveCurrentImage(false)
        setCurrentImagePath(null)
        setImagePreview(null)
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Draft Saved!',
        text: 'Your slider changes have been saved as draft and are ready for future editing.',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true
      })
      navigate("/cms/sliders")
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
      formDataToSend.append('status', formData.status)
      formDataToSend.append('is_active', formData.is_active ? '1' : '0')
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }
      
      if (removeCurrentImage) {
        formDataToSend.append('remove_image', '1')
      }

      // Debug: Log what we're sending
      console.log('Updating slider with ID:', id)
      console.log('FormData contents:')
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1])
      }
      
      const token = localStorage.getItem('authToken')
      console.log('Auth token present:', !!token)

      const response = await managementAPI.updateSlider(parseInt(id!), formDataToSend)
      console.log('Update response:', response)
      
      // Update the current image path if a new image was uploaded
      if (imageFile && response.data.image_path) {
        console.log('New image uploaded, updating path:', response.data.image_path)
        setCurrentImagePath(response.data.image_path)
        setImageFile(null)
        setImageLoaded(false) // Reset loaded state
        // Force a fresh image preview with cache busting
        const timestamp = new Date().getTime()
        const random = Math.random()
        const imageUrl = `${STORAGE_BASE_URL}${response.data.image_path}?t=${timestamp}&v=${random}&refresh=true`
        setImagePreview(imageUrl)
        console.log('Updated image preview URL:', imageUrl)
        // Force re-render of image component
        setImageRefreshKey(prev => prev + 1)
      }
      
      // Clear remove flag if image was removed
      if (removeCurrentImage) {
        console.log('Image removed, clearing state')
        setRemoveCurrentImage(false)
        setCurrentImagePath(null)
        setImagePreview(null)
        setImageLoaded(false)
      }
      
      // If no new image was uploaded but we have a current image, refresh it
      if (!imageFile && currentImagePath && !removeCurrentImage && response.data.image_path) {
        console.log('Refreshing current image with cache busting')
        setImageLoaded(false) // Reset loaded state
        const timestamp = new Date().getTime()
        const random = Math.random()
        const imageUrl = `${STORAGE_BASE_URL}${response.data.image_path}?t=${timestamp}&v=${random}&refresh=true`
        setImagePreview(imageUrl)
        setImageRefreshKey(prev => prev + 1)
      }
      
      await Swal.fire({
        icon: 'success',
        title: 'Slider Updated!',
        text: 'Your slider has been successfully updated and is now live on your website.',
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      })
      
      // Add a small delay to ensure the user sees the updated image
      setTimeout(() => {
        navigate("/cms/sliders")
      }, 1000)
    } catch (error: any) {
      console.error('Error updating slider:', error)
      console.error('Error response:', error.response)
      console.error('Error status:', error.response?.status)
      console.error('Error data:', error.response?.data)
      
      let errorMessage = "Failed to update slider. Please try again."
      
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
        title: 'Update Failed',
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
      
      // Reset image loaded state when new image is selected
      setImageLoaded(false)
      setImageFile(file)
      setRemoveCurrentImage(false) // Reset remove flag when new image is selected
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
      console.log('New image selected, preview URL created:', previewUrl)
      
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
    if (imageFile) {
      // Remove newly selected image
      setImageFile(null)
      if (imagePreview && !currentImagePath) {
        URL.revokeObjectURL(imagePreview)
        setImagePreview(null)
      } else if (currentImagePath) {
        setImagePreview(`${STORAGE_BASE_URL}${currentImagePath}`)
      }
    } else if (currentImagePath) {
      // Remove current image
      setRemoveCurrentImage(true)
      setImagePreview(null)
      
      Swal.fire({
        icon: 'info',
        title: 'Image Removed',
        text: 'Current image will be removed when you save the slider.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      })
    }
  }

  const getImagePreviewUrl = () => {
    if (imageFile) {
      return imagePreview // This is the object URL for new image
    } else if (currentImagePath && !removeCurrentImage) {
      // Use the cached imagePreview URL instead of generating new ones
      return imagePreview || `${STORAGE_BASE_URL}${currentImagePath}`
    }
    return null // No image
  }

  // Preload image when preview URL changes (for cached images)
  useEffect(() => {
    if (imagePreview && !imageFile) {
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
    } else if (!imagePreview) {
      setImageLoaded(false)
    }
  }, [imagePreview, imageFile])

  const refreshImage = () => {
    console.log('Manually refreshing image')
    setImageLoaded(false) // Reset image loaded state
    
    if (currentImagePath && !removeCurrentImage && !imageFile) {
      // Refresh the current image from server
      const timestamp = new Date().getTime()
      const random = Math.random()
      const imageUrl = `${STORAGE_BASE_URL}${currentImagePath}?t=${timestamp}&v=${random}&refresh=true`
      setImagePreview(imageUrl)
      console.log('Refreshed image URL:', imageUrl)
    } else if (imageFile) {
      // Recreate object URL for new file
      const previewUrl = URL.createObjectURL(imageFile)
      setImagePreview(previewUrl)
      console.log('Refreshed new image preview URL:', previewUrl)
    }
    
    setImageRefreshKey(prev => prev + 1)
    Swal.fire({
      icon: 'info',
      title: 'Image Refreshed',
      text: 'The image preview has been refreshed.',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true
    })
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading slider...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/sliders")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Edit Slider</h1>
          <p className="text-muted-foreground">
            Modify your website slider content
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
                Update your slider content and appearance
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
                Upload a new image or keep the current one (recommended: 1920x800px)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {getImagePreviewUrl() ? (
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
                      key={imagePreview || imageFile?.name}
                      src={getImagePreviewUrl()!} 
                      alt="Slider preview" 
                      className={`w-full h-48 object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => {
                        console.log('Image loaded successfully:', getImagePreviewUrl())
                        setImageLoaded(true)
                      }}
                      onError={(e) => {
                        console.error('Image failed to load:', e.currentTarget.src)
                        setImageLoaded(false)
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={refreshImage}
                        title="Refresh Image"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeImage}
                        title="Remove Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-center">
                    {imageFile && (
                      <p className="text-sm text-green-600 mb-2">
                        New image selected: {imageFile.name}
                      </p>
                    )}
                    {currentImagePath && !removeCurrentImage && !imageFile && (
                      <p className="text-sm text-blue-600 mb-2">
                        Current image from server
                      </p>
                    )}
                    {removeCurrentImage && (
                      <p className="text-sm text-orange-600 mb-2">
                        ⚠️ Current image will be removed when saved
                      </p>
                    )}
                  </div>
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
                  {getImagePreviewUrl() ? (
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
                        key={`preview-${imagePreview || imageFile?.name}`}
                        src={getImagePreviewUrl()!} 
                        alt="Preview" 
                        className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => {
                          console.log('Preview image loaded successfully:', getImagePreviewUrl())
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
                      <span className="text-muted-foreground">No Image</span>
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
                Choose how to save your slider changes
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
                  {loading ? 'Publishing Slider...' : 'Update & Publish'}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Updates the slider and makes it active on your website
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
                  Saves changes but keeps slider hidden from website
                </p>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/cms/sliders")}
                disabled={loading}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
