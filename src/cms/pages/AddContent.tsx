import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Eye, FileText, Tag, Globe, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"

export default function AddContent() {
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    type: "page",
    status: "draft",
    featured: false,
    tags: "",
    metaTitle: "",
    metaDescription: "",
    publishDate: new Date().toISOString().split('T')[0]
  })
  
  const [loading, setLoading] = useState(false)
  
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.content) {
      toast({
        title: "Error",
        description: "Please fill in required fields (title and content).",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('section', formData.type) // Use type as section
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('status', formData.status === 'published' ? 'active' : 'inactive')
      formDataToSend.append('order', '1') // Default order

      await managementAPI.createAboutContent(formDataToSend)
      
      toast({
        title: "Content Created",
        description: "Your new content has been successfully created.",
      })
      navigate("/cms/about")
    } catch (error) {
      console.error('Error creating content:', error)
      toast({
        title: "Error",
        description: "Failed to create content. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const contentTypes = [
    { value: "page", label: "Page", icon: FileText },
    { value: "post", label: "Blog Post", icon: FileText },
    { value: "landing", label: "Landing Page", icon: Globe }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Add New Content</h1>
          <p className="text-muted-foreground">
            Create new pages, posts, and content for your website
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="seo">SEO</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Details</CardTitle>
                  <CardDescription>
                    Create your content with rich text editing capabilities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      placeholder="Enter content title..."
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      placeholder="Brief description or excerpt..."
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange("excerpt", e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content *</Label>
                    <div className="border border-input rounded-md p-3 min-h-[300px] bg-background">
                      <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                        <Button variant="ghost" size="sm">Bold</Button>
                        <Button variant="ghost" size="sm">Italic</Button>
                        <Button variant="ghost" size="sm">Link</Button>
                        <Button variant="ghost" size="sm">Image</Button>
                      </div>
                      <Textarea
                        placeholder="Start writing your content..."
                        value={formData.content}
                        onChange={(e) => handleInputChange("content", e.target.value)}
                        className="border-0 shadow-none resize-none min-h-[250px] focus-visible:ring-0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Content Settings</CardTitle>
                  <CardDescription>
                    Configure visibility and categorization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Content Type</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="w-4 h-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="publishDate">Publish Date</Label>
                      <Input
                        id="publishDate"
                        type="date"
                        value={formData.publishDate}
                        onChange={(e) => handleInputChange("publishDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="Enter tags separated by commas..."
                      value={formData.tags}
                      onChange={(e) => handleInputChange("tags", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Separate multiple tags with commas
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    />
                    <Label htmlFor="featured">Feature this content</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="seo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Settings</CardTitle>
                  <CardDescription>
                    Optimize your content for search engines
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="metaTitle">Meta Title</Label>
                    <Input
                      id="metaTitle"
                      placeholder="SEO title for search engines..."
                      value={formData.metaTitle}
                      onChange={(e) => handleInputChange("metaTitle", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaTitle.length}/60 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="metaDescription">Meta Description</Label>
                    <Textarea
                      id="metaDescription"
                      placeholder="Brief description for search results..."
                      value={formData.metaDescription}
                      onChange={(e) => handleInputChange("metaDescription", e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground">
                      {formData.metaDescription.length}/160 characters
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-normal text-lg">
                    {formData.title || "Content Title"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">
                      {contentTypes.find(t => t.value === formData.type)?.label}
                    </Badge>
                    <Badge variant={formData.status === 'published' ? 'default' : 'secondary'}>
                      {formData.status}
                    </Badge>
                  </div>
                </div>
                {formData.excerpt && (
                  <p className="text-sm text-muted-foreground">
                    {formData.excerpt}
                  </p>
                )}
                {formData.tags && (
                  <div className="flex items-center gap-1 flex-wrap">
                    <Tag className="w-3 h-3" />
                    {formData.tags.split(',').map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {tag.trim()}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {formData.status === 'published' ? 'Publish Now' : 'Save Content'}
              </Button>
              <Button variant="outline" className="w-full">
                Save as Draft
              </Button>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                Publish on {formData.publishDate}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}