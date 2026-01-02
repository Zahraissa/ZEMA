import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Eye, Edit, Image, FileText, Users, Plus, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { managementAPI, AboutContent } from "@/services/api"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigate } from "react-router-dom"

interface AboutData {
  heroSection: {
    title: string;
    subtitle: string;
    description: string;
    heroImage: string;
  };
  mission: {
    title: string;
    content: string;
  };
  vision: {
    title: string;
    content: string;
  };

  values: Array<{
    id?: number;
    title: string;
    content: string;
    icon: string;
    color: string;
  }>;
  team: {
    title: string;
    description: string;
    memberCount: number;
  };
  history: {
    title: string;
    content: string;
  };
}

export default function AboutManagement() {
  const [aboutData, setAboutData] = useState<AboutData>({
    heroSection: {
      title: "About Our Organization",
      subtitle: "Leading innovation in technology since 2019",
      description: "We are a forward-thinking organization dedicated to creating innovative solutions that make a difference in people's lives.",
      heroImage: "/api/placeholder/600/400"
    },
    mission: {
      title: "Our Mission",
      content: "To empower businesses and individuals through cutting-edge technology solutions that drive growth and success."
    },
    vision: {
      title: "Our Vision",
      content: "To be the global leader in innovative technology solutions, creating a better future for all."
    },

    values: [
      { title: "Innovation", content: "We constantly push boundaries", icon: "lightbulb", color: "from-yellow-500 to-orange-500" },
      { title: "Quality", content: "We deliver excellence in everything", icon: "award", color: "from-blue-500 to-blue-600" },
      { title: "Integrity", content: "We build trust through transparency", icon: "shield", color: "from-green-500 to-emerald-500" },
      { title: "Collaboration", content: "We work together to achieve more", icon: "users", color: "from-purple-500 to-pink-500" }
    ],
    team: {
      title: "Our Team",
      description: "Meet the passionate individuals who make our organization great.",
      memberCount: 25
    },
    history: {
      title: "Our Story",
      content: "Founded in 2019, we started as a government initiative with big dreams. Today, we're proud to serve citizens nationwide."
    }
  })
  
  const [aboutContent, setAboutContent] = useState<AboutContent[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchAboutContent()
  }, [])

  const fetchAboutContent = async () => {
    try {
      setLoading(true)
      const response = await managementAPI.getAboutContent()
      const content = response.data.data || []
      setAboutContent(content)
      
      // Transform API data to local state
      const transformedData = transformApiDataToLocal(content)
      setAboutData(transformedData)
    } catch (error) {
      console.error('Error fetching about content:', error)
      toast({
        title: "Error",
        description: "Failed to load about content.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const transformApiDataToLocal = (content: AboutContent[]): AboutData => {
    const data: AboutData = {
      heroSection: {
        title: "About Our Organization",
        subtitle: "Leading innovation in technology since 2019",
        description: "We are a forward-thinking organization dedicated to creating innovative solutions that make a difference in people's lives.",
        heroImage: "/api/placeholder/600/400"
      },
      mission: {
        title: "Our Mission",
        content: "To empower businesses and individuals through cutting-edge technology solutions that drive growth and success."
      },
      vision: {
        title: "Our Vision",
        content: "To be the global leader in innovative technology solutions, creating a better future for all."
      },

      values: [],
      team: {
        title: "Our Team",
        description: "Meet the passionate individuals who make our organization great.",
        memberCount: 25
      },
      history: {
        title: "Our Story",
        content: "Founded in 2019, we started as a government initiative with big dreams. Today, we're proud to serve citizens nationwide."
      }
    }

    content.forEach(item => {
      const additionalData = item.additional_data || {}
      
      switch (item.section) {
        case 'hero':
          data.heroSection = {
            title: item.title,
            subtitle: additionalData.subtitle || data.heroSection.subtitle,
            description: item.content,
            heroImage: item.image_path || data.heroSection.heroImage
          }
          break
        case 'mission':
          data.mission = {
            title: item.title,
            content: item.content
          }
          break
        case 'vision':
          data.vision = {
            title: item.title,
            content: item.content
          }
          break

        case 'values':
          data.values.push({
            id: item.id,
            title: item.title,
            content: item.content,
            icon: additionalData.icon || 'star',
            color: additionalData.color || 'from-blue-500 to-blue-600'
          })
          break
        case 'team':
          data.team = {
            title: item.title,
            description: item.content,
            memberCount: additionalData.member_count || 25
          }
          break
        case 'history':
          data.history = {
            title: item.title,
            content: item.content
          }
          break
      }
    })

    return data
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      // Transform local data back to API format and save
      const contentToSave = transformLocalDataToApi(aboutData)
      
      // Save each section
      for (const content of contentToSave) {
        if (content.id) {
          // Update existing content
          const formData = createFormData(content)
          formData.append('_method', 'PUT')
          await managementAPI.updateAboutContent(content.id, formData)
        } else {
          // Create new content
          await managementAPI.createAboutContent(createFormData(content))
        }
      }

      setIsEditing(false)
      await fetchAboutContent() // Refresh data
      
      toast({
        title: "Success",
        description: "About page content has been saved successfully.",
      })
    } catch (error) {
      console.error('Error saving about content:', error)
      toast({
        title: "Error",
        description: "Failed to save changes.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  const createFormData = (content: any): FormData => {
    const formData = new FormData()
    formData.append('section', content.section)
    formData.append('title', content.title)
    formData.append('content', content.content)
    formData.append('status', 'active')
    formData.append('order', content.order?.toString() || '1')
    
    if (content.additional_data) {
      formData.append('additional_data', JSON.stringify(content.additional_data))
    }
    
    return formData
  }

  const transformLocalDataToApi = (data: AboutData): any[] => {
    const content: any[] = []

    // Hero section
    content.push({
      section: 'hero',
      title: data.heroSection.title,
      content: data.heroSection.description,
      order: 1,
      additional_data: {
        subtitle: data.heroSection.subtitle,
        description: data.heroSection.description
      }
    })

    // Mission
    content.push({
      section: 'mission',
      title: data.mission.title,
      content: data.mission.content,
      order: 1,
      additional_data: {
        icon: 'target',
        color: 'from-green-500 to-emerald-500'
      }
    })

    // Vision
    content.push({
      section: 'vision',
      title: data.vision.title,
      content: data.vision.content,
      order: 1,
      additional_data: {
        icon: 'eye',
        color: 'from-blue-500 to-blue-600'
      }
    })



    // Values
    data.values.forEach((value, index) => {
      content.push({
        id: value.id,
        section: 'values',
        title: value.title,
        content: value.content,
        order: index + 1,
        additional_data: {
          icon: value.icon,
          color: value.color
        }
      })
    })

    // Team
    content.push({
      section: 'team',
      title: data.team.title,
      content: data.team.description,
      order: 1,
      additional_data: {
        member_count: data.team.memberCount,
        description: data.team.description
      }
    })

    // History
    content.push({
      section: 'history',
      title: data.history.title,
      content: data.history.content,
      order: 1,
      additional_data: {
        founded_year: 2019
      }
    })

    return content
  }

  const updateHeroSection = (field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      heroSection: {
        ...prev.heroSection,
        [field]: value
      }
    }))
  }

  const updateSection = (section: string, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  const updateValue = (index: number, field: string, value: string) => {
    setAboutData(prev => ({
      ...prev,
      values: prev.values.map((value, i) => 
        i === index ? { ...value, [field]: value } : value
      )
    }))
  }

  const addValue = () => {
    setAboutData(prev => ({
      ...prev,
      values: [...prev.values, {
        title: "New Value",
        content: "Value description",
        icon: "star",
        color: "from-blue-500 to-blue-600"
      }]
    }))
  }

  const removeValue = (index: number) => {
    setAboutData(prev => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading about content...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">About Page Management</h1>
          <p className="text-muted-foreground">
            Manage your organization's about page content and information
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button variant="outline" onClick={() => navigate('/cms/add-about-content')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Content
          </Button>
          {isEditing ? (
            <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-primary to-accent">
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Content
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Content Sections</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">6</div>
            <p className="text-xs text-muted-foreground">
              Active sections
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Team Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{aboutData.team.memberCount}</div>
            <p className="text-xs text-muted-foreground">
              Listed members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Core Values</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{aboutData.values.length}</div>
            <p className="text-xs text-muted-foreground">
              Active values
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="hero">Hero Section</TabsTrigger>
          <TabsTrigger value="mission">Mission & Vision</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
              <CardDescription>
                Main banner content that visitors see first
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="hero-title">Title</Label>
                <Input
                  id="hero-title"
                  value={aboutData.heroSection.title}
                  onChange={(e) => updateHeroSection('title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="hero-subtitle">Subtitle</Label>
                <Input
                  id="hero-subtitle"
                  value={aboutData.heroSection.subtitle}
                  onChange={(e) => updateHeroSection('subtitle', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="hero-description">Description</Label>
                <Textarea
                  id="hero-description"
                  value={aboutData.heroSection.description}
                  onChange={(e) => updateHeroSection('description', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label>Hero Image</Label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 bg-muted rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                  {isEditing && (
                    <Button variant="outline">
                      Upload New Image
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mission" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Mission Statement</CardTitle>
                <CardDescription>
                  What drives your organization forward
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="mission-title">Title</Label>
                  <Input
                    id="mission-title"
                    value={aboutData.mission.title}
                    onChange={(e) => updateSection('mission', 'title', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="mission-content">Content</Label>
                  <Textarea
                    id="mission-content"
                    value={aboutData.mission.content}
                    onChange={(e) => updateSection('mission', 'content', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vision Statement</CardTitle>
                <CardDescription>
                  Your organization's future aspirations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="vision-title">Title</Label>
                  <Input
                    id="vision-title"
                    value={aboutData.vision.title}
                    onChange={(e) => updateSection('vision', 'title', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="vision-content">Content</Label>
                  <Textarea
                    id="vision-content"
                    value={aboutData.vision.content}
                    onChange={(e) => updateSection('vision', 'content', e.target.value)}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>



        <TabsContent value="values" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Values</CardTitle>
              <CardDescription>
                Core principles that guide your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutData.values.map((value, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Value {index + 1}</Badge>
                      <div className="flex gap-2">
                        {value.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/cms/edit-about-content/${value.id}`)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeValue(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label>Title</Label>
                      {isEditing ? (
                        <Input
                          value={value.title}
                          onChange={(e) => updateValue(index, 'title', e.target.value)}
                        />
                      ) : (
                        <span className="text-sm font-normal">{value.title}</span>
                      )}
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                      <Label>Description</Label>
                      {isEditing ? (
                        <Textarea
                          value={value.content}
                          onChange={(e) => updateValue(index, 'content', e.target.value)}
                          rows={2}
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">{value.content}</span>
                      )}
                    </div>
                    {isEditing && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="grid w-full items-center gap-1.5">
                          <Label>Icon</Label>
                          <Input
                            value={value.icon}
                            onChange={(e) => updateValue(index, 'icon', e.target.value)}
                            placeholder="e.g., shield, users, award"
                          />
                        </div>
                        <div className="grid w-full items-center gap-1.5">
                          <Label>Color</Label>
                          <Input
                            value={value.color}
                            onChange={(e) => updateValue(index, 'color', e.target.value)}
                            placeholder="e.g., from-blue-500 to-blue-600"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <Button variant="outline" onClick={addValue} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Value
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Section</CardTitle>
              <CardDescription>
                Information about your team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="team-title">Section Title</Label>
                <Input
                  id="team-title"
                  value={aboutData.team.title}
                  onChange={(e) => updateSection('team', 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="team-description">Description</Label>
                <Textarea
                  id="team-description"
                  value={aboutData.team.description}
                  onChange={(e) => updateSection('team', 'description', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-normal">Team Members: {aboutData.team.memberCount}</span>
                {isEditing && (
                  <Button variant="outline">
                    Manage Team Members
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization History</CardTitle>
              <CardDescription>
                Your organization's journey and milestones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="history-title">Title</Label>
                <Input
                  id="history-title"
                  value={aboutData.history.title}
                  onChange={(e) => updateSection('history', 'title', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="history-content">Content</Label>
                <Textarea
                  id="history-content"
                  value={aboutData.history.content}
                  onChange={(e) => updateSection('history', 'content', e.target.value)}
                  disabled={!isEditing}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}