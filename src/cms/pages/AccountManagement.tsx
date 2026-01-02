import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, User, Mail, Shield, Clock, Lock, Trash2, AlertTriangle, Settings, Eye, EyeOff, Calendar, Database, Activity, Camera, Upload, X, RotateCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { managementAPI } from "@/services/api"
import Swal from 'sweetalert2'

export default function AccountManagement() {
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [accountData, setAccountData] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    browserNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    loginAlerts: true,
    timezone: "UTC",
    language: "en",
    theme: "system",
    sessionTimeout: "24"
  })
  
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    showCurrentPassword: false,
    lastPasswordChange: "",
    loginAttempts: 0,
    activeSessions: 1
  })
  
  const [loading, setLoading] = useState(false)
  const [deleteAccountMode, setDeleteAccountMode] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState("")
  
  // Avatar upload states
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

  useEffect(() => {
    // Load account settings (mock data for now)
    setSecurityData(prev => ({
      ...prev,
      lastPasswordChange: user?.updated_at || user?.created_at || new Date().toISOString(),
      loginAttempts: 0,
      activeSessions: 1
    }))
    
    // Set current avatar from user data
    setCurrentAvatar(user?.avatar || null)
  }, [user])

  const handleAccountUpdate = async (field: string, value: string | boolean) => {
    try {
      setAccountData(prev => ({ ...prev, [field]: value }))
      
      // Mock API call for settings update
      console.log(`Updating ${field} to ${value}`)
      
      await Swal.fire({
        icon: 'success',
        title: 'Setting Updated',
        text: `${field} has been updated successfully.`,
        confirmButtonColor: '#10b981',
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Error updating setting:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Failed to update setting. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    }
  }

  const handlePasswordReset = async () => {
    if (!securityData.currentPassword) {
      await Swal.fire({
        icon: 'warning',
        title: 'Current Password Required',
        text: 'Please enter your current password to proceed.',
        confirmButtonColor: '#f59e0b'
      })
      return
    }

    try {
      setLoading(true)
      
      // Mock password reset email
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      await Swal.fire({
        icon: 'success',
        title: 'Password Reset Email Sent',
        text: 'Check your email for password reset instructions.',
        confirmButtonColor: '#10b981'
      })
      
      setSecurityData(prev => ({ 
        ...prev, 
        currentPassword: "",
        showCurrentPassword: false 
      }))
    } catch (error) {
      console.error('Error sending password reset:', error)
      await Swal.fire({
        icon: 'error',
        title: 'Reset Failed',
        text: 'Failed to send password reset email. Please try again.',
        confirmButtonColor: '#ef4444'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorToggle = async (enabled: boolean) => {
    if (enabled) {
      // Mock 2FA setup
      const result = await Swal.fire({
        icon: 'info',
        title: 'Enable Two-Factor Authentication',
        text: 'This will enhance your account security. You will need an authenticator app.',
        showCancelButton: true,
        confirmButtonText: 'Enable 2FA',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#10b981'
      })
      
      if (result.isConfirmed) {
        setAccountData(prev => ({ ...prev, twoFactorEnabled: true }))
        await Swal.fire({
          icon: 'success',
          title: '2FA Enabled',
          text: 'Two-factor authentication has been enabled for your account.',
          confirmButtonColor: '#10b981'
        })
      }
    } else {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Disable Two-Factor Authentication',
        text: 'This will reduce your account security. Are you sure?',
        showCancelButton: true,
        confirmButtonText: 'Disable 2FA',
        cancelButtonText: 'Keep Enabled',
        confirmButtonColor: '#ef4444'
      })
      
      if (result.isConfirmed) {
        setAccountData(prev => ({ ...prev, twoFactorEnabled: false }))
        await Swal.fire({
          icon: 'info',
          title: '2FA Disabled',
          text: 'Two-factor authentication has been disabled.',
          confirmButtonColor: '#6b7280'
        })
      }
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== user?.email) {
      await Swal.fire({
        icon: 'error',
        title: 'Email Confirmation Required',
        text: 'Please type your email address exactly to confirm account deletion.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    const finalConfirm = await Swal.fire({
      icon: 'warning',
      title: 'Final Confirmation',
      text: 'This action cannot be undone. Your account and all data will be permanently deleted.',
      showCancelButton: true,
      confirmButtonText: 'Delete My Account',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc2626',
      input: 'password',
      inputPlaceholder: 'Enter your password to confirm',
      inputValidator: (value) => {
        if (!value) {
          return 'Password is required to delete account'
        }
      }
    })

    if (finalConfirm.isConfirmed) {
      try {
        setLoading(true)
        
        // Mock account deletion
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        await Swal.fire({
          icon: 'success',
          title: 'Account Deleted',
          text: 'Your account has been successfully deleted.',
          confirmButtonColor: '#10b981',
          timer: 3000,
          timerProgressBar: true
        })
        
        await logout()
        navigate('/login')
      } catch (error) {
        console.error('Error deleting account:', error)
        await Swal.fire({
          icon: 'error',
          title: 'Deletion Failed',
          text: 'Failed to delete account. Please contact support.',
          confirmButtonColor: '#ef4444'
        })
      } finally {
        setLoading(false)
      }
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Account Management</h1>
          <p className="text-muted-foreground">
            Manage your account security, preferences, and settings
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
              <CardDescription>
                Manage your account security settings and authentication methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Two-Factor Authentication */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <h4 className="font-normal">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch
                  checked={accountData.twoFactorEnabled}
                  onCheckedChange={handleTwoFactorToggle}
                />
              </div>

              {/* Password Reset */}
              <div className="space-y-4 border rounded-lg p-4">
                <h4 className="font-normal">Password Reset</h4>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="currentPasswordReset">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="currentPasswordReset"
                        type={securityData.showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password..."
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData(prev => ({ 
                          ...prev, 
                          currentPassword: e.target.value 
                        }))}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1 h-7 w-7"
                        onClick={() => setSecurityData(prev => ({ 
                          ...prev, 
                          showCurrentPassword: !prev.showCurrentPassword 
                        }))}
                      >
                        {securityData.showCurrentPassword ? 
                          <EyeOff className="h-3 w-3" /> : 
                          <Eye className="h-3 w-3" />
                        }
                      </Button>
                    </div>
                  </div>
                  <Button 
                    onClick={handlePasswordReset}
                    disabled={loading}
                    variant="outline"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Sending...' : 'Send Password Reset Email'}
                  </Button>
                </div>
              </div>

              {/* Security Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-normal">Last Password Change</Label>
                  <p className="text-sm text-muted-foreground">
                    {securityData.lastPasswordChange ? 
                      new Date(securityData.lastPasswordChange).toLocaleDateString() : 
                      'Never'
                    }
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-normal">Failed Login Attempts</Label>
                  <p className="text-sm text-muted-foreground">
                    {securityData.loginAttempts} in the last 24 hours
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-normal">Active Sessions</Label>
                  <p className="text-sm text-muted-foreground">
                    {securityData.activeSessions} active session(s)
                  </p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-normal">Account Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {user?.created_at ? 
                      new Date(user.created_at).toLocaleDateString() : 
                      'Unknown'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your account preferences and notification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Notification Settings */}
              <div className="space-y-4">
                <h4 className="font-normal">Notification Preferences</h4>
                <div className="space-y-3">
                  {[
                    { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive notifications via email' },
                    { key: 'browserNotifications', label: 'Browser Notifications', description: 'Show notifications in your browser' },
                    { key: 'marketingEmails', label: 'Marketing Emails', description: 'Receive updates and promotional content' },
                    { key: 'securityAlerts', label: 'Security Alerts', description: 'Get notified about security events' },
                    { key: 'loginAlerts', label: 'Login Alerts', description: 'Notify when someone logs into your account' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <h5 className="text-sm font-normal">{setting.label}</h5>
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      </div>
                      <Switch
                        checked={accountData[setting.key as keyof typeof accountData] as boolean}
                        onCheckedChange={(checked) => handleAccountUpdate(setting.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* System Preferences */}
              <div className="space-y-4">
                <h4 className="font-normal">System Preferences</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select 
                      value={accountData.timezone} 
                      onValueChange={(value) => handleAccountUpdate('timezone', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">Eastern Time</SelectItem>
                        <SelectItem value="America/Chicago">Central Time</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select 
                      value={accountData.language} 
                      onValueChange={(value) => handleAccountUpdate('language', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Theme</Label>
                    <Select 
                      value={accountData.theme} 
                      onValueChange={(value) => handleAccountUpdate('theme', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="system">System</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Session Timeout (hours)</Label>
                    <Select 
                      value={accountData.sessionTimeout} 
                      onValueChange={(value) => handleAccountUpdate('sessionTimeout', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hour</SelectItem>
                        <SelectItem value="8">8 hours</SelectItem>
                        <SelectItem value="24">24 hours</SelectItem>
                        <SelectItem value="168">1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!deleteAccountMode ? (
                <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <div className="space-y-1">
                    <h4 className="font-normal text-red-900 dark:text-red-100">Delete Account</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button 
                    variant="destructive" 
                    onClick={() => setDeleteAccountMode(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              ) : (
                <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50 dark:bg-red-950 dark:border-red-800">
                  <div className="space-y-2">
                    <h4 className="font-normal text-red-900 dark:text-red-100">Confirm Account Deletion</h4>
                    <p className="text-sm text-red-700 dark:text-red-300">
                      This action cannot be undone. Type your email address <strong>{user?.email}</strong> to confirm.
                    </p>
                  </div>
                  <Input
                    placeholder="Type your email to confirm..."
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    className="border-red-300"
                  />
                  <div className="flex gap-2">
                    <Button 
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      disabled={loading || deleteConfirmation !== user?.email}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {loading ? 'Deleting...' : 'Confirm Deletion'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setDeleteAccountMode(false)
                        setDeleteConfirmation("")
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Account Overview Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>
                Your account status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage 
                        src={avatarPreview || currentAvatar || undefined} 
                        alt={user?.name} 
                      />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-normal">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Avatar Upload Button */}
                    <label htmlFor="account-avatar-upload">
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full cursor-pointer"
                        asChild
                      >
                        <span>
                          <Camera className="h-2.5 w-2.5" />
                        </span>
                      </Button>
                    </label>
                    
                    {/* Hidden file input */}
                    <input
                      id="account-avatar-upload"
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
                          className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
                        >
                          {avatarLoading ? (
                            <RotateCw className="h-2.5 w-2.5 mr-1 animate-spin" />
                          ) : (
                            <Upload className="h-2.5 w-2.5 mr-1" />
                          )}
                          {avatarLoading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelAvatarUpload}
                          disabled={avatarLoading}
                          className="text-xs px-2 py-1 h-6"
                        >
                          <X className="h-2.5 w-2.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        Preview
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
                      className="text-red-600 hover:text-red-700 text-xs px-2 py-1 h-6"
                    >
                      <X className="h-2.5 w-2.5 mr-1" />
                      Remove
                    </Button>
                  )}
                  
                  <div className="text-center space-y-2">
                    <h3 className="font-normal text-lg">
                      {user?.name || "User Name"}
                    </h3>
                    <div className="flex items-center justify-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {user?.email || "user@email.com"}
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

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${accountData.twoFactorEnabled ? 'text-green-500' : 'text-orange-500'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-normal">Two-Factor Auth</p>
                      <p className="text-xs text-muted-foreground">
                        {accountData.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <Badge variant={accountData.twoFactorEnabled ? 'default' : 'secondary'}>
                      {accountData.twoFactorEnabled ? 'Secure' : 'Basic'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500" />
                    <div className="flex-1">
                      <p className="text-sm font-normal">Account Status</p>
                      <p className="text-xs text-muted-foreground">Active</p>
                    </div>
                    <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-normal">Session Timeout</p>
                      <p className="text-xs text-muted-foreground">
                        {accountData.sessionTimeout} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-purple-500" />
                    <div className="flex-1">
                      <p className="text-sm font-normal">Data Usage</p>
                      <p className="text-xs text-muted-foreground">Standard</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => navigate('/cms/profile')}
              >
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={handlePasswordReset}
                disabled={loading}
              >
                <Lock className="w-4 h-4 mr-2" />
                Reset Password
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => window.location.reload()}
              >
                <Activity className="w-4 h-4 mr-2" />
                Refresh Session
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
