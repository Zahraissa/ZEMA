import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Eye, User, Mail, Lock, Shield } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { managementAPI } from "@/services/api"
import Swal from 'sweetalert2'

export default function AddUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "author",
    status: "active",
    sendWelcomeEmail: true
  })
  
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      await Swal.fire({
        icon: 'error',
        title: 'Missing Required Fields',
        text: 'Please fill in all required fields (name, email, password).',
        confirmButtonColor: '#3085d6'
      })
      return
    }

    // Validate name: should not start with a number and should not be only numbers
    const trimmedName = formData.name.trim()
    if (/^\d/.test(trimmedName)) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Full name cannot start with a number.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    if (/^\d+$/.test(trimmedName.replace(/\s/g, ''))) {
      await Swal.fire({
        icon: 'error',
        title: 'Invalid Name',
        text: 'Full name cannot be only numbers.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    if (formData.password !== formData.confirmPassword) {
      await Swal.fire({
        icon: 'error',
        title: 'Password Mismatch',
        text: 'Password and confirm password do not match.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    if (formData.password.length < 8) {
      await Swal.fire({
        icon: 'error',
        title: 'Weak Password',
        text: 'Password must be at least 8 characters long.',
        confirmButtonColor: '#ef4444'
      })
      return
    }

    try {
      setLoading(true)
      
      // Automatically append @egaz.go.tz if not already present
      let email = formData.email.trim()
      if (!email.includes('@')) {
        // If no @ symbol, append @egaz.go.tz
        email = `${email}@egaz.go.tz`
      } else {
        // If email has @, check if domain is egaz.go.tz
        const emailParts = email.split('@')
        if (emailParts.length === 2) {
          const domain = emailParts[1].toLowerCase()
          if (domain !== 'egaz.go.tz') {
            // Replace the domain with egaz.go.tz
            email = `${emailParts[0]}@egaz.go.tz`
          }
        }
      }
      
      const userData = {
        name: formData.name,
        email: email,
        password: formData.password,
        role: formData.role,
        status: formData.status,
        send_welcome_email: formData.sendWelcomeEmail
      }

      const response = await managementAPI.createUser(userData)
      
      await Swal.fire({
        icon: 'success',
        title: 'User Created!',
        text: `${formData.name} has been successfully created and ${formData.sendWelcomeEmail ? 'will receive a welcome email' : 'can now log in'}.`,
        confirmButtonColor: '#10b981',
        timer: 3000,
        timerProgressBar: true
      })
      navigate("/cms/users")
    } catch (error: any) {
      console.error('Error creating user:', error)
      let errorMessage = "Failed to create user. Please try again."
      
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
        title: 'Creation Failed',
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
      password: password,
      confirmPassword: password
    }))
    
    Swal.fire({
      icon: 'info',
      title: 'Password Generated',
      text: `Generated password: ${password}`,
      confirmButtonColor: '#10b981'
    })
  }

  const roles = [
    { value: "admin", label: "Administrator", description: "Full system access" },
    { value: "editor", label: "Editor", description: "Can manage content" },
    { value: "author", label: "Author", description: "Can create content" },
    { value: "subscriber", label: "Subscriber", description: "Read-only access" }
  ]

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/cms/users")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Add New User</h1>
          <p className="text-muted-foreground">
            Create a new user account with appropriate permissions
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Basic information and credentials for the new user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Enter full name..."
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className={formData.name && /^\d/.test(formData.name.trim()) ? "border-red-500" : ""}
                    />
                    <p className="text-xs text-muted-foreground">
                      Name cannot start with a number or be only numbers
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="text"
                        placeholder="username"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                        className="pr-32"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
                        @egaz.go.tz
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Email will automatically use @egaz.go.tz domain
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password..."
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="absolute right-1 top-1 h-7"
                        onClick={generatePassword}
                      >
                        Generate
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Minimum 8 characters
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password..."
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select value={formData.role} onValueChange={(value) => handleInputChange("role", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center space-x-2">
                            {getRoleIcon(role.value)}
                            <div>
                              <div className="font-normal">{role.label}</div>
                              <div className="text-xs text-muted-foreground">{role.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
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

                <div className="flex items-center space-x-2">
                  <Switch
                    id="sendWelcomeEmail"
                    checked={formData.sendWelcomeEmail}
                    onCheckedChange={(checked) => handleInputChange("sendWelcomeEmail", checked)}
                  />
                  <Label htmlFor="sendWelcomeEmail">Send welcome email with login credentials</Label>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                User Preview
              </CardTitle>
              <CardDescription>
                How the user will appear in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-normal">
                    {formData.name.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-normal">
                      {formData.name || "User Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      {formData.email ? (formData.email.includes('@') ? formData.email : `${formData.email}@egaz.go.tz`) : "user@egaz.go.tz"}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Role:</span>
                    <div className="flex items-center space-x-1">
                      {getRoleIcon(formData.role)}
                      <span className="text-sm capitalize">{formData.role}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Status:</span>
                    <span className={`text-sm capitalize ${formData.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                      {formData.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-normal">Welcome Email:</span>
                    <span className="text-sm">
                      {formData.sendWelcomeEmail ? "Yes" : "No"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Create User</CardTitle>
              <CardDescription>
                Review the information and create the user account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-accent"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating User...' : 'Create User Account'}
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => navigate("/cms/users")}
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
