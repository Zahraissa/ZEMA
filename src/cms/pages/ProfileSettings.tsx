import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, User, Mail, Lock, Shield, Upload, Eye, EyeOff, Camera, X, RotateCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { managementAPI } from "@/services/api"
import Swal from 'sweetalert2'

export default function ProfileSettings() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    changePassword: false,
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }))
      // Set current avatar from user data
      setCurrentAvatar(user.avatar || null)
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in your name and email.',
        confirmButtonColor: '#3085d6'
      })
      return
    }

    if (formData.changePassword) {
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Missing Password Fields',
          text: 'Please fill in all password fields.',
          confirmButtonColor: '#ef4444'
        })
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        await Swal.fire({
          icon: 'error',
          title: 'Password Mismatch',
          text: 'New password and confirmation do not match.',
          confirmButtonColor: '#ef4444'
        })
        return
      }

      if (formData.newPassword.length < 8) {
        await Swal.fire({
          icon: 'error',
          title: 'Weak Password',
          text: 'Password must be at least 8 characters long.',
          confirmButtonColor: '#ef4444'
        })
        return
      }
    }

    try {
      setLoading(true)
      
      const updateData: any = {
        name: formData.name,
        email: formData.email
      }

      if (formData.changePassword) {
        updateData.password = formData.newPassword
        updateData.current_password = formData.currentPassword
      }

      if (user?.id) {
        await managementAPI.updateUser(user.id, updateData)
        
        await Swal.fire({
          icon: 'success',
          title: 'Profile Updated!',
          text: 'Your profile has been successfully updated.',
          confirmButtonColor: '#10b981',
          timer: 2500,
          timerProgressBar: true
        })

        // Reset password fields
        setFormData(prev => ({
          ...prev,
          changePassword: false,
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        }))
      }
    } catch (error: any) {
      console.error('Error updating profile:', error)
      let errorMessage = "Failed to update profile. Please try again."
      
      if (error.response?.status === 422) {
        const errors = error.response?.data?.errors
        if (errors) {
          const errorMessages = Object.values(errors).flat()
          errorMessage = errorMessages.join(', ')
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    let password = ''
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ 
      ...prev, 
      newPassword: password,
      confirmPassword: password
    }))
    
    Swal.fire({
      icon: 'info',
      title: 'Password Generated',
      text: `Generated password: ${password}`,
      confirmButtonColor: '#10b981'
    })
  }

  // Avatar handling functions
  const handleAvatarFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please select an image file (JPG, PNG, GIF, etc.)',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Please select an image smaller than 5MB',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    setAvatarFile(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = async () => {
    if (!avatarFile || !user?.id) return

    try {
      setAvatarLoading(true)
      
      const formData = new FormData()
      formData.append('avatar', avatarFile)
      
      // Mock API call - in real implementation, this would upload to your backend
      // const response = await managementAPI.uploadAvatar(user.id, formData)
      
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update the current avatar state
      setCurrentAvatar(avatarPreview)
      
      // Update the user context with the new avatar
      updateUser({ avatar: avatarPreview })
      
      // Clear the upload states
      setAvatarFile(null)
      setAvatarPreview(null)
      
      await Swal.fire({
        icon: 'success',
        title: 'Avatar Updated!',
        text: 'Your profile picture has been successfully updated.',
        confirmButtonColor: '#10b981',
        timer: 2500,
        timerProgressBar: true
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: 'Failed to upload avatar. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setAvatarLoading(false)
    }
  }

  const handleAvatarRemove = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Remove Avatar',
      text: 'Are you sure you want to remove your profile picture?',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444'
    })

    if (result.isConfirmed) {
      try {
        setAvatarLoading(true)
        
        // Mock API call - in real implementation, this would call your backend
        // await managementAPI.removeAvatar(user.id)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Update the current avatar state
        setCurrentAvatar(null)
        
        // Update the user context to remove the avatar
        updateUser({ avatar: undefined })
        
        // Clear any upload states
        setAvatarFile(null)
        setAvatarPreview(null)
        
        await Swal.fire({
          icon: 'success',
          title: 'Avatar Removed',
          text: 'Your profile picture has been removed.',
          confirmButtonColor: '#10b981',
          timer: 2000,
          timerProgressBar: true
        })
      } catch (error) {
        console.error('Error removing avatar:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Remove Failed',
          text: 'Failed to remove avatar. Please try again.',
          confirmButtonColor: '#ef4444'
        })
      } finally {
        setAvatarLoading(false)
      }
    }
  }

  const cancelAvatarUpload = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'editor':
        return <User className="w-4 h-4 text-blue-500" />
      case 'author':
        return <User className="w-4 h-4 text-green-500" />
      default:
        return <User className="w-4 h-4 text-gray-500" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-500 hover:bg-red-600'
      case 'editor':
        return 'bg-blue-500 hover:bg-blue-600'
      case 'author':
        return 'bg-green-500 hover:bg-green-600'
      default:
        return 'bg-gray-500 hover:bg-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name..."
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address..."
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="changePassword"
                      checked={formData.changePassword}
                      onCheckedChange={(checked) => handleInputChange("changePassword", checked)}
                    />
                    <Label htmlFor="changePassword">Change Password</Label>
                  </div>

                  {formData.changePassword && (
                    <div className="space-y-4 border rounded-lg p-4 bg-muted/30">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password..."
                            value={formData.currentPassword}
                            onChange={(e) => handleInputChange("currentPassword", e.target.value)}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-7 w-7"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                          </Button>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">New Password</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password..."
                              value={formData.newPassword}
                              onChange={(e) => handleInputChange("newPassword", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                              {showNewPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={generatePassword}
                            >
                              Generate
                            </Button>
                            <p className="text-xs text-muted-foreground flex items-center">
                              Minimum 8 characters
                            </p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirm New Password</Label>
                          <div className="relative">
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm new password..."
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-1 top-1 h-7 w-7"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Profile Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Preview</CardTitle>
              <CardDescription>
                How your profile appears to others
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage 
                        src={avatarPreview || currentAvatar || undefined} 
                        alt={user?.name} 
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-normal">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Avatar Upload Button */}
                    <label htmlFor="avatar-upload">
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full cursor-pointer"
                        asChild
                      >
                        <span>
                          <Camera className="h-3 w-3" />
                        </span>
                      </Button>
                    </label>
                    
                    {/* Hidden file input */}
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="hidden"
                    />
                  </div>
                  
                  {/* Avatar Upload Controls */}
                  {avatarPreview && (
                    <div className="flex flex-col items-center space-y-2">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={handleAvatarUpload}
                          disabled={avatarLoading}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {avatarLoading ? (
                            <RotateCw className="h-3 w-3 mr-1 animate-spin" />
                          ) : (
                            <Upload className="h-3 w-3 mr-1" />
                          )}
                          {avatarLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelAvatarUpload}
                          disabled={avatarLoading}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Preview - Click Upload to save
                      </p>
                    </div>
                  )}
                  
                  {/* Remove Avatar Button */}
                  {currentAvatar && !avatarPreview && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleAvatarRemove}
                      disabled={avatarLoading}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-3 w-3 mr-1" />
                      Remove Photo
                    </Button>
                  )}
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-normal text-lg">
                      {formData.name || user?.name || "User Name"}
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {formData.email || user?.email || "user@email.com"}
                      </p>
                    </div>
                    
                    {user?.role && (
                      <Badge 
                        className={`${getRoleBadgeColor(user.role)} text-white text-xs`}
                      >
                        <div className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          <span className="capitalize">{user.role}</span>
                        </div>
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Status:</span>
                    <span className="font-normal text-green-600">Active</span>
                  </div>
                  {user?.created_at && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Member Since:</span>
                      <span className="font-normal">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {user?.last_login && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Login:</span>
                      <span className="font-normal">
                        {new Date(user.last_login).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Save Changes</CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Updating Profile...' : 'Save Changes'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate(-1)}
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
