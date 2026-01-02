import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, Upload, Calendar, User, BookOpen, Hash } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"
import { useAuth } from "@/contexts/AuthContext"
import Swal from "sweetalert2"

export default function CreateArticle() {
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    author: "",
    publishDate: new Date().toISOString().split('T')[0],
    status: "draft"
  })
  
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  // Set the author to the current user's name when component mounts
  useEffect(() => {
    if (user?.name) {
      setFormData(prev => ({ ...prev, author: user.name }))
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in required fields (title and description).',
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('author', formData.author)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('publish_date', formData.publishDate)
      formDataToSend.append('status', formData.status)
      
      if (imageFile) {
        formDataToSend.append('image', imageFile)
      }

      await managementAPI.createNews(formDataToSend)
      
      Swal.fire({
        icon: 'success',
        title: 'Article Created',
        text: 'Your new article has been successfully created.',
      })
      navigate("/cms/news")
    } catch (error) {
      console.error('Error creating article:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create article. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const categories = [
    "Technology", "Business", "Marketing", "Design", "Development", 
    "News", "Tutorial", "Review", "Opinion", "Industry"
  ]

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
      setImagePreview(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/news")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Create New Article</h1>
          <p className="text-muted-foreground">
            Write and publish engaging articles for your audience
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Details</CardTitle>
              <CardDescription>
                Create compelling content with rich formatting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Article Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter an engaging article title..."
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Article Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Write a compelling description of your article..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    className="min-h-[150px]"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    This will appear in article previews and search results
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      placeholder="Article author name..."
                      value={formData.author}
                      onChange={(e) => handleInputChange("author", e.target.value)}
                      readOnly
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Automatically set to current user: {user?.name || 'Loading...'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toLowerCase()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>


              </form>
            </CardContent>
          </Card>

          {/* Article Image */}
          <Card>
            <CardHeader>
              <CardTitle>Article Image</CardTitle>
              <CardDescription>
                Upload an image for your article
              </CardDescription>
            </CardHeader>
            <CardContent>
              {imagePreview ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={imagePreview} 
                      alt="Article preview" 
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
                    Image selected: {imageFile?.name}
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
                    id="article-image-upload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('article-image-upload')?.click()}
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

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Article Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-muted/50 rounded h-32 flex items-center justify-center overflow-hidden">
                  {imagePreview ? (
                    <img 
                      src={imagePreview} 
                      alt="Article preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-muted-foreground text-sm">Article Image</span>
                  )}
                </div>
                
                <div>
                  <h3 className="font-normal text-lg mb-2">
                    {formData.title || "Article Title"}
                  </h3>
                  <div className="flex items-center gap-2 mb-3">
                    {formData.category && (
                      <Badge variant="outline" className="text-xs">
                        {formData.category}
                      </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                      {formData.status}
                    </Badge>
                  </div>
                </div>

                {formData.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {formData.description}
                  </p>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {formData.author && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {formData.author}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formData.publishDate}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publication Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="publishDate">Publish Date</Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) => handleInputChange("publishDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating Article...' : (formData.status === 'published' ? 'Publish Article' : 'Save Article')}
              </Button>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {formData.status === 'scheduled' ? 'Scheduled for' : 'Publish on'} {formData.publishDate}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}