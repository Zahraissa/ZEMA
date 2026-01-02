import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Eye, Upload, User, Globe, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { managementAPI, BandMember } from "@/services/api"

export default function EditMember() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    social_facebook: "",
    social_twitter: "",
    social_instagram: "",
    social_linkedin: "",
    status: "active",
    order: 1
  })
  
  const [currentImage, setCurrentImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (id) {
      fetchMember()
    }
  }, [id])

  // Cleanup image preview URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

  const fetchMember = async () => {
    try {
      setFetching(true)
      const response = await managementAPI.getBandMembers({ id })
      const member = response.data.data.find((m: BandMember) => m.id === parseInt(id!))
      
      if (member) {
        setFormData({
          name: member.name || "",
          position: member.position || "",
          social_facebook: member.social_facebook || "",
          social_twitter: member.social_twitter || "",
          social_instagram: member.social_instagram || "",
          social_linkedin: member.social_linkedin || "",
          status: member.status || "active",
          order: member.order || 1
        })
        setCurrentImage(member.image_path || null)
      } else {
        toast({
          title: "Error",
          description: "Member not found.",
          variant: "destructive"
        })
        navigate("/cms/band")
      }
    } catch (error) {
      console.error('Error fetching member:', error)
      toast({
        title: "Error",
        description: "Failed to load member data.",
        variant: "destructive"
      })
      navigate("/cms/band")
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.position) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await managementAPI.updateBandMember(parseInt(id!), formDataToSend)
      
      toast({
        title: "Member Updated",
        description: "Band member has been successfully updated.",
      })
      navigate("/cms/band")
    } catch (error) {
      console.error('Error updating band member:', error)
      toast({
        title: "Error",
        description: "Failed to update band member. Please try again.",
        variant: "destructive"
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
      setImageFile(file)
      
      // Create preview URL for new image
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const getImageUrl = (imagePath: string | null | undefined) => {
    if (!imagePath) return null;
    
    // If the image path already includes http/https, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If the image path starts with storage/, remove it to avoid double paths
    const cleanPath = imagePath.startsWith('storage/') ? imagePath.substring(8) : imagePath;
    
    // Use the API base URL from config
    return `${import.meta.env.VITE_API_URL}/storage/${cleanPath}`;
  };

  const positions = [
    "CEO", "DIRECTOR", "FOUNDER", "MANAGER", "ADMIN", "CEO Founder",
    "Lead Vocalist", "Backing Vocalist", "Lead Guitarist", "Rhythm Guitarist",
    "Bassist", "Drummer", "Keyboardist", "Pianist", "Saxophonist", "Trumpeter",
    "Violinist", "DJ", "Producer", "Sound Engineer"
  ]

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading member data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/band")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Edit Member</h1>
          <p className="text-muted-foreground">
            Update member information and details
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Basic details about the band member
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter member's full name..."
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card>
            <CardHeader>
              <CardTitle>Social Media</CardTitle>
              <CardDescription>
                Connect social media profiles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="social_facebook">Facebook</Label>
                  <Input
                    id="social_facebook"
                    placeholder="Facebook profile URL"
                    value={formData.social_facebook}
                    onChange={(e) => handleInputChange("social_facebook", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_twitter">Twitter</Label>
                  <Input
                    id="social_twitter"
                    placeholder="Twitter profile URL"
                    value={formData.social_twitter}
                    onChange={(e) => handleInputChange("social_twitter", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_instagram">Instagram</Label>
                  <Input
                    id="social_instagram"
                    placeholder="Instagram profile URL"
                    value={formData.social_instagram}
                    onChange={(e) => handleInputChange("social_instagram", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="social_linkedin">LinkedIn</Label>
                  <Input
                    id="social_linkedin"
                    placeholder="LinkedIn profile URL"
                    value={formData.social_linkedin}
                    onChange={(e) => handleInputChange("social_linkedin", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Photo Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Photo</CardTitle>
              <CardDescription>
                Upload a professional photo of the band member
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                {(imagePreview || currentImage) ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview || getImageUrl(currentImage) || ''} 
                        alt="Profile" 
                        className="w-32 h-32 object-cover rounded-lg mx-auto bg-gray-100"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                        }}
                      />
                      {(imagePreview || imageFile) && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      {imagePreview ? 'New photo selected' : 'Current photo'}
                    </p>
                    {imageFile && (
                      <p className="text-sm text-green-600">
                        Selected: {imageFile.name}
                      </p>
                    )}
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Drag and drop a photo here, or click to browse
                    </p>
                  </>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button variant="outline" onClick={() => document.getElementById('image-upload')?.click()}>
                  Choose Photo
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended: Square format, minimum 400x400px
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Member Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage 
                      src={imagePreview || getImageUrl(currentImage) || ''} 
                      alt={formData.name} 
                    />
                    <AvatarFallback className="text-lg">
                      {formData.name.split(' ').map(n => n[0]).join('') || 'M'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-normal text-lg">
                      {formData.name || "Member Name"}
                    </h3>
                    {formData.position && (
                      <Badge variant="outline" className="text-xs">
                        {formData.position}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Removed bio display */}

                <div className="space-y-2 text-xs text-muted-foreground">
                  {/* Removed email display */}
                  {/* Removed phone display */}
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Status: {formData.status}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Member Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => handleInputChange("order", parseInt(e.target.value))}
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Updating Member...' : 'Update Member'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/cms/band")}
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
