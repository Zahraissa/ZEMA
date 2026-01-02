import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { managementAPI } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"

interface AboutContentForm {
  section: string
  title: string
  content: string
  image?: File
  additional_data: {
    subtitle?: string
    icon?: string
    color?: string
    member_count?: number
    description?: string
    founded_year?: number
    milestones?: string[]
  }
  status: 'active' | 'inactive'
  order: number
}

const SECTIONS = [
  { value: 'hero', label: 'Hero Section', description: 'Main banner content' },
  { value: 'mission', label: 'Mission', description: 'Organization mission statement' },
  { value: 'vision', label: 'Vision', description: 'Organization vision statement' },
  { value: 'values', label: 'Values', description: 'Core organizational values' },
  { value: 'team', label: 'Team', description: 'Team information' },
  { value: 'history', label: 'History', description: 'Organization history' }
]

const ICONS = [
  { value: 'shield', label: 'Shield' },
  { value: 'lightbulb', label: 'Lightbulb' },
  { value: 'users', label: 'Users' },
  { value: 'handshake', label: 'Handshake' },
  { value: 'heart', label: 'Heart' },
  { value: 'award', label: 'Award' },
  { value: 'target', label: 'Target' },
  { value: 'eye', label: 'Eye' },
  { value: 'star', label: 'Star' }
]

const COLORS = [
  { value: 'from-blue-500 to-blue-600', label: 'Blue' },
  { value: 'from-green-500 to-emerald-500', label: 'Green' },
  { value: 'from-purple-500 to-pink-500', label: 'Purple' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow' },
  { value: 'from-red-500 to-pink-500', label: 'Red' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo' }
]

export default function AddAboutContent() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<AboutContentForm>({
    section: 'hero',
    title: '',
    content: '',
    additional_data: {},
    status: 'active',
    order: 1
  })

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleAdditionalDataChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      additional_data: {
        ...prev.additional_data,
        [field]: value
      }
    }))
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: undefined
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setSaving(true)
      
      const formDataToSend = new FormData()
      formDataToSend.append('section', formData.section)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('content', formData.content)
      formDataToSend.append('status', formData.status)
      formDataToSend.append('order', formData.order.toString())
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }
      
      if (Object.keys(formData.additional_data).length > 0) {
        formDataToSend.append('additional_data', JSON.stringify(formData.additional_data))
      }
      
      await managementAPI.createAboutContent(formDataToSend)
      
      toast({
        title: "Success",
        description: "About content created successfully.",
      })
      
      navigate('/cms/about')
    } catch (error) {
      console.error('Error creating about content:', error)
      toast({
        title: "Error",
        description: "Failed to create about content.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const renderSectionFields = () => {
    switch (formData.section) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={formData.additional_data.subtitle || ''}
                onChange={(e) => handleAdditionalDataChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Hero Image</Label>
              <div className="flex items-center gap-4">
                {formData.image ? (
                  <div className="relative">
                    <img
                      src={URL.createObjectURL(formData.image)}
                      alt="Preview"
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        )
      
      case 'mission':
      case 'vision':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label>Icon</Label>
              <Select
                value={formData.additional_data.icon || ''}
                onValueChange={(value) => handleAdditionalDataChange('icon', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Color</Label>
              <Select
                value={formData.additional_data.color || ''}
                onValueChange={(value) => handleAdditionalDataChange('color', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 'values':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label>Icon</Label>
              <Select
                value={formData.additional_data.icon || ''}
                onValueChange={(value) => handleAdditionalDataChange('icon', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {ICONS.map((icon) => (
                    <SelectItem key={icon.value} value={icon.value}>
                      {icon.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Color</Label>
              <Select
                value={formData.additional_data.color || ''}
                onValueChange={(value) => handleAdditionalDataChange('color', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {COLORS.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      
      case 'team':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label>Member Count</Label>
              <Input
                type="number"
                value={formData.additional_data.member_count || ''}
                onChange={(e) => handleAdditionalDataChange('member_count', parseInt(e.target.value) || 0)}
                placeholder="Enter member count"
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label>Description</Label>
              <Textarea
                value={formData.additional_data.description || ''}
                onChange={(e) => handleAdditionalDataChange('description', e.target.value)}
                placeholder="Enter team description"
                rows={3}
              />
            </div>
          </div>
        )
      
      case 'history':
        return (
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label>Founded Year</Label>
              <Input
                type="number"
                value={formData.additional_data.founded_year || ''}
                onChange={(e) => handleAdditionalDataChange('founded_year', parseInt(e.target.value) || 0)}
                placeholder="Enter founded year"
              />
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/cms/about')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-normal tracking-tight">Add About Content</h1>
            <p className="text-muted-foreground">
              Create new content for the about page
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Main Content */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Details</CardTitle>
                <CardDescription>
                  Basic information about the content
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="section">Section</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => handleInputChange('section', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a section" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTIONS.map((section) => (
                        <SelectItem key={section.value} value={section.value}>
                          <div>
                            <div className="font-normal">{section.label}</div>
                            <div className="text-sm text-muted-foreground">{section.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter title"
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    placeholder="Enter content"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="order">Order</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                    placeholder="Enter order"
                    min="1"
                  />
                </div>

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Section Specific Fields */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Section Configuration</CardTitle>
                <CardDescription>
                  Additional settings for {formData.section} section
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderSectionFields()}
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  How this content will appear
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline">{formData.section}</Badge>
                  </div>
                  <h3 className="font-normal">{formData.title || 'Title'}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.content || 'Content will appear here...'}
                  </p>
                  {formData.additional_data.subtitle && (
                    <p className="text-sm text-blue-600">{formData.additional_data.subtitle}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/cms/about')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Creating...' : 'Create Content'}
          </Button>
        </div>
      </form>
    </div>
  )
}

