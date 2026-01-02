import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Save, Eye, Upload, Music, User, Globe, Calendar, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"

export default function AddMember() {
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
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const { toast } = useToast()
  const navigate = useNavigate()

  // Cleanup image preview URL on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])

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
        console.log('Image file added to FormData:', imageFile.name, imageFile.size)
      } else {
        console.log('No image file selected')
      }

      // Debug: Log FormData contents
      console.log('FormData contents:')
      for (let [key, value] of formDataToSend.entries()) {
        console.log(key, ':', value)
      }

      await managementAPI.createBandMember(formDataToSend)
      
      toast({
        title: "Member Added",
        description: "New band member has been successfully added.",
      })
      navigate("/cms/band")
    } catch (error) {
      console.error('Error creating band member:', error)
      toast({
        title: "Error",
        description: "Failed to add band member. Please try again.",
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
      console.log('Image file selected:', file.name, file.size, file.type)
      setImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    } else {
      console.log('No file selected')
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  const roles = [
    "Lead Vocalist", "Backing Vocalist", "Lead Guitarist", "Rhythm Guitarist",
    "Bassist", "Drummer", "Keyboardist", "Pianist", "Saxophonist", "Trumpeter",
    "Violinist", "DJ", "Producer", "Sound Engineer", "Manager"
  ]

  const instruments = [
    "Vocals", "Electric Guitar", "Acoustic Guitar", "Bass Guitar", "Drums",
    "Piano", "Keyboard", "Synthesizer", "Saxophone", "Trumpet", "Violin",
    "Turntables", "None"
  ]

  const availabilityOptions = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "session", label: "Session Only" },
    { value: "touring", label: "Touring Only" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/band")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Add New Member</h1>
          <p className="text-muted-foreground">
            Add a new member to your band or team
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
                  <Label htmlFor="position">Position in Band *</Label>
                  <Select value={formData.position} onValueChange={(value) => handleInputChange("position", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Personal Website</Label>
                  <Input
                    id="website"
                    placeholder="https://..."
                    value={formData.website}
                    onChange={(e) => handleInputChange("website", e.target.value)}
                  />
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Professional Details */}
          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
              <CardDescription>
                Experience and career information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="joinDate">Join Date</Label>
                  <Input
                    id="joinDate"
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => handleInputChange("joinDate", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="yearsExperience">Years of Experience</Label>
                  <Input
                    id="yearsExperience"
                    type="number"
                    min="0"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange("yearsExperience", parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availability">Availability</Label>
                  <Select value={formData.availability} onValueChange={(value) => handleInputChange("availability", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availabilityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Skills & Specialties</Label>
                <Textarea
                  id="skills"
                  placeholder="List specific skills, techniques, or music styles (one per line)..."
                  value={formData.skills}
                  onChange={(e) => handleInputChange("skills", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="achievements">Notable Achievements</Label>
                <Textarea
                  id="achievements"
                  placeholder="Awards, recognitions, notable performances or collaborations..."
                  value={formData.achievements}
                  onChange={(e) => handleInputChange("achievements", e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
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
                {imagePreview ? (
                  <div className="mb-4">
                    <div className="relative inline-block">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg mx-auto bg-gray-100"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                        onClick={handleRemoveImage}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {imageFile?.name}
                    </p>
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
                      src={imagePreview || ''} 
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



                {formData.bio && (
                  <p className="text-sm text-muted-foreground">
                    {formData.bio.length > 100 
                      ? `${formData.bio.substring(0, 100)}...`
                      : formData.bio
                    }
                  </p>
                )}

                <div className="space-y-2 text-xs text-muted-foreground">
                  {formData.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      {formData.email}
                    </div>
                  )}
                  {formData.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {formData.phone}
                    </div>
                  )}
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
                    <SelectItem value="on-leave">On Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Adding Member...' : 'Add Member'}
              </Button>
              
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}