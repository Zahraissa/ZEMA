import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2, Eye, Search, Music, Users, Calendar, Award } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { managementAPI, BandMember } from "@/services/api"
import { useNavigate } from "react-router-dom"
import { STORAGE_BASE_URL } from "@/config"

const mockBandMembers = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Lead Vocalist",
    instrument: "Vocals",
    joinDate: "2018-01-15",
    status: "active",
    photo: "/api/placeholder/100/100",
    bio: "Passionate vocalist with 10+ years experience",
    featured: true
  },
  {
    id: 2,
    name: "Sarah Mitchell",
    role: "Lead Guitarist",
    instrument: "Electric Guitar",
    joinDate: "2018-03-20",
    status: "active",
    photo: "/api/placeholder/100/100",
    bio: "Master of rock and blues guitar",
    featured: true
  },
  {
    id: 3,
    name: "Mike Rodriguez",
    role: "Bassist",
    instrument: "Bass Guitar",
    joinDate: "2019-06-10",
    status: "active",
    photo: "/api/placeholder/100/100",
    bio: "Groove master and rhythm specialist",
    featured: true
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "Drummer",
    instrument: "Drums",
    joinDate: "2020-02-28",
    status: "active",
    photo: "/api/placeholder/100/100",
    bio: "Dynamic drummer with jazz background",
    featured: false
  },
  {
    id: 5,
    name: "Tom Wilson",
    role: "Keyboardist",
    instrument: "Piano/Synthesizer",
    joinDate: "2021-09-15",
    status: "inactive",
    photo: "/api/placeholder/100/100",
    bio: "Classical trained with modern flair",
    featured: false
  }
]

export default function BandManagement() {
  const [bandMembers, setBandMembers] = useState<BandMember[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    fetchBandMembers()
  }, [])

  const fetchBandMembers = async () => {
    try {
      setLoading(true)
      const response = await managementAPI.getBandMembers()
      setBandMembers(response.data.data || [])
    } catch (error) {
      console.error('Error fetching band members:', error)
      toast({
        title: "Error",
        description: "Failed to load band members.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredMembers = bandMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: number) => {
    try {
      await managementAPI.deleteBandMember(id)
      setBandMembers(bandMembers.filter(member => member.id !== id))
      toast({
        title: "Member Removed",
        description: "The band member has been successfully removed.",
      })
    } catch (error) {
      console.error('Error deleting band member:', error)
      toast({
        title: "Error",
        description: "Failed to delete band member.",
        variant: "destructive"
      })
    }
  }

  const toggleStatus = async (id: number) => {
    const member = bandMembers.find(m => m.id === id)
    if (!member) return

    try {
      const newStatus = member.status === 'active' ? 'inactive' : 'active'
      const formData = new FormData()
      formData.append('status', newStatus)
      
      await managementAPI.updateBandMember(id, formData)
      setBandMembers(bandMembers.map(member =>
        member.id === id ? { ...member, status: newStatus } : member
      ))
      toast({
        title: "Status Updated",
        description: "Member status has been updated.",
      })
    } catch (error) {
      console.error('Error updating member status:', error)
      toast({
        title: "Error",
        description: "Failed to update member status.",
        variant: "destructive"
      })
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
    
    // Use the storage base URL from config
    return `${STORAGE_BASE_URL}${cleanPath}`;
  };

  const activeMembers = bandMembers.filter(m => m.status === 'active').length

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading band members...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Band Management</h1>
          <p className="text-muted-foreground">
            Manage your band members and their information
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-primary to-accent"
          onClick={() => navigate('/cms/add-member')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal">{bandMembers.length}</div>
            <p className="text-xs text-muted-foreground">
              All band members
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Active Members</CardTitle>
            <Music className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-green-600">{activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Currently performing
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">Inactive Members</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-gray-500">{bandMembers.length - activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              Not currently active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-normal">With Images</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-normal text-blue-600">
              {bandMembers.filter(m => m.image_path).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Members with photos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Band Members Table */}
      <Card>
        <CardHeader>
          <CardTitle>Band Members</CardTitle>
          <CardDescription>
            Manage your band members and their roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search band members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Member</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <div className="text-center">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-normal text-gray-900 mb-2">
                        {searchTerm ? 'No members found' : 'No band members yet'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {searchTerm 
                          ? `No members match "${searchTerm}"` 
                          : 'Get started by adding your first band member.'
                        }
                      </p>
                      {!searchTerm && (
                        <Button 
                          onClick={() => navigate('/cms/add-member')}
                          className="bg-gradient-to-r from-primary to-accent"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add First Member
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-gray-200">
                            <AvatarImage 
                              src={getImageUrl(member.image_path) || ''} 
                              alt={member.name}
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = '/placeholder.svg';
                                console.log('Image failed to load for member:', member.name, 'Path:', member.image_path);
                              }}
                              onLoad={() => {
                                console.log('Image loaded successfully for member:', member.name, 'Path:', member.image_path);
                              }}
                            />
                            <AvatarFallback className="text-sm font-normal bg-gray-100">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          {member.image_path && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <div className="font-normal text-sm">{member.name}</div>
                          <div className="text-xs text-muted-foreground">
                            ID: {member.id} • Order: {member.order}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">
                        {member.position}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.image_path ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                            <span className="text-green-600 text-xs">📷</span>
                          </div>
                          <span className="text-xs text-green-600">Has Image</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">❌</span>
                          </div>
                          <span className="text-xs text-gray-500">No Image</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={member.status === 'active' ? 'default' : 'secondary'}
                        className={`text-xs ${
                          member.status === 'active' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {member.status === 'active' ? '🟢 Active' : '🔴 Inactive'}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleStatus(member.id)}
                          className="h-8 w-8 p-0"
                          title={`Toggle ${member.status === 'active' ? 'Inactive' : 'Active'}`}
                        >
                          {member.status === 'active' ? '🔴' : '🟢'}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigate(`/cms/edit-member/${member.id}`)}
                          className="h-8 w-8 p-0"
                          title="Edit Member"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(member.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                          title="Delete Member"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}