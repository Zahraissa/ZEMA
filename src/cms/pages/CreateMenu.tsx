import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, ChevronDown, Menu, FolderOpen, Link } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"
import { MenuType, MenuGroup, MenuItem } from "@/services/api"
import Swal from "sweetalert2"

export default function CreateMenu() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "active"
  })
  
  const [menuGroups, setMenuGroups] = useState<Partial<MenuGroup>[]>([])
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please fill in the menu name.',
      })
      return
    }

    try {
      setLoading(true)
      
      const menuData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        menu_groups: menuGroups.map((group, index) => ({
          name: group.name || `Group ${index + 1}`,
          description: group.description || "",
          status: group.status || "active",
          order: index + 1,
          menu_items: group.menu_items?.map((item, itemIndex) => ({
            name: item.name || `Item ${itemIndex + 1}`,
            description: item.description || "",
            link: item.link || "#",
            icon: item.icon === "none" ? "" : (item.icon || ""),
            status: item.status || "active",
            order: itemIndex + 1
          })) || []
        }))
      }

      console.log('Sending menu data:', menuData)

      await managementAPI.createMenuType(menuData)
      
      Swal.fire({
        icon: 'success',
        title: 'Menu Created',
        text: 'Your new menu has been successfully created.',
      })
      navigate("/cms/menu")
    } catch (error) {
      console.error('Error creating menu:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create menu. Please try again.'
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addMenuGroup = () => {
    const newGroup: Partial<MenuGroup> = {
      name: "",
      description: "",
      status: "active",
      order: menuGroups.length + 1,
      menu_items: []
    }
    setMenuGroups(prev => [...prev, newGroup])
  }

  const updateMenuGroup = (index: number, field: string, value: string) => {
    setMenuGroups(prev => prev.map((group, i) => 
      i === index ? { ...group, [field]: value } : group
    ))
  }

  const removeMenuGroup = (index: number) => {
    setMenuGroups(prev => prev.filter((_, i) => i !== index))
  }

  const addMenuItem = (groupIndex: number) => {
    const newItem: Partial<MenuItem> = {
      name: "",
      description: "",
      link: "#",
      icon: "none",
      status: "active",
      order: (menuGroups[groupIndex]?.menu_items?.length || 0) + 1
    }
    
    setMenuGroups(prev => prev.map((group, i) => 
      i === groupIndex 
        ? { 
            ...group, 
            menu_items: [...(group.menu_items || []), newItem] 
          }
        : group
    ))
  }

  const updateMenuItem = (groupIndex: number, itemIndex: number, field: string, value: string) => {
    setMenuGroups(prev => prev.map((group, i) => 
      i === groupIndex 
        ? {
            ...group,
            menu_items: group.menu_items?.map((item, j) => 
              j === itemIndex ? { ...item, [field]: value } : item
            )
          }
        : group
    ))
  }

  const removeMenuItem = (groupIndex: number, itemIndex: number) => {
    setMenuGroups(prev => prev.map((group, i) => 
      i === groupIndex 
        ? {
            ...group,
            menu_items: group.menu_items?.filter((_, j) => j !== itemIndex)
          }
        : group
    ))
  }

  const iconOptions = [
    { value: "none", label: "No Icon" },
    { value: "home", label: "Home" },
    { value: "user", label: "User" },
    { value: "settings", label: "Settings" },
    { value: "file-text", label: "Document" },
    { value: "image", label: "Image" },
    { value: "users", label: "Users" },
    { value: "newspaper", label: "News" },
    { value: "wrench", label: "Services" },
    { value: "phone", label: "Contact" },
    { value: "info", label: "Info" },
    { value: "help-circle", label: "Help" },
    { value: "briefcase", label: "Business" },
    { value: "calendar", label: "Calendar" },
    { value: "mail", label: "Email" },
    { value: "map-pin", label: "Location" },
    { value: "star", label: "Featured" },
    { value: "heart", label: "Favorites" },
    { value: "download", label: "Download" },
    { value: "external-link", label: "External Link" }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/menu")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Create New Menu</h1>
          <p className="text-muted-foreground">
            Create a dynamic navigation menu with dropdown items using the modern Shadcn UI NavigationMenu format
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Menu Details */}
        <Card>
          <CardHeader>
            <CardTitle>Menu Details</CardTitle>
            <CardDescription>
              Basic information about your menu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Menu Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter menu name..."
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
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
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter menu description..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Menu Groups */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Menu Groups (Dropdown Items)</CardTitle>
                <CardDescription>
                  Create groups that will appear as dropdown menus in the NavigationMenu format
                </CardDescription>
              </div>
              <Button type="button" onClick={addMenuGroup} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Group
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {menuGroups.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No menu groups added yet.</p>
                <p className="text-sm">Click "Add Group" to create dropdown items.</p>
              </div>
            ) : (
              menuGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      <h3 className="font-normal">Group {groupIndex + 1}</h3>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMenuGroup(groupIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Group Name</Label>
                      <Input
                        placeholder="Enter group name..."
                        value={group.name || ""}
                        onChange={(e) => updateMenuGroup(groupIndex, "name", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select 
                        value={group.status || "active"} 
                        onValueChange={(value) => updateMenuGroup(groupIndex, "status", value)}
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
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      placeholder="Enter group description..."
                      value={group.description || ""}
                      onChange={(e) => updateMenuGroup(groupIndex, "description", e.target.value)}
                    />
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Menu Items</Label>
                      <Button
                        type="button"
                        onClick={() => addMenuItem(groupIndex)}
                        variant="outline"
                        size="sm"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Item
                      </Button>
                    </div>

                    {group.menu_items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="border rounded p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Link className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm font-normal">Item {itemIndex + 1}</span>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMenuItem(groupIndex, itemIndex)}
                            className="text-red-600 hover:text-red-700 h-6 w-6 p-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Name</Label>
                            <Input
                              placeholder="Item name..."
                              value={item.name || ""}
                              onChange={(e) => updateMenuItem(groupIndex, itemIndex, "name", e.target.value)}
                              className="h-8"
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Link</Label>
                            <Input
                              placeholder="/page-url"
                              value={item.link || ""}
                              onChange={(e) => updateMenuItem(groupIndex, itemIndex, "link", e.target.value)}
                              className="h-8"
                            />
                          </div>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1">
                            <Label className="text-xs">Icon</Label>
                            <Select 
                              value={item.icon || "none"} 
                              onValueChange={(value) => updateMenuItem(groupIndex, itemIndex, "icon", value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue placeholder="Select icon" />
                              </SelectTrigger>
                              <SelectContent>
                                {iconOptions.map((icon) => (
                                  <SelectItem key={icon.value} value={icon.value}>
                                    {icon.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Status</Label>
                            <Select 
                              value={item.status || "active"} 
                              onValueChange={(value) => updateMenuItem(groupIndex, itemIndex, "status", value)}
                            >
                              <SelectTrigger className="h-8">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <Label className="text-xs">Description</Label>
                          <Input
                            placeholder="Item description..."
                            value={item.description || ""}
                            onChange={(e) => updateMenuItem(groupIndex, itemIndex, "description", e.target.value)}
                            className="h-8"
                          />
                        </div>
                      </div>
                    ))}

                    {(!group.menu_items || group.menu_items.length === 0) && (
                      <div className="text-center py-4 text-muted-foreground text-sm">
                        No menu items in this group yet.
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="bg-gradient-to-r from-primary to-accent">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Creating Menu...' : 'Create Menu'}
          </Button>
        </div>
      </form>
    </div>
  )
}
