import { StatCard } from "@/components/StatCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image, FileText, Newspaper, Wrench, Music, Plus, Edit, Eye } from "lucide-react"

const stats = [
  {
    title: "Total Sliders",
    value: "12",
    icon: Image,
    trend: { value: "2", isPositive: true }
  },
  {
    title: "News Articles",
    value: "48",
    icon: Newspaper,
    trend: { value: "8", isPositive: true }
  },
  {
    title: "Services",
    value: "6",
    icon: Wrench,
    trend: { value: "1", isPositive: true }
  },
  {
    title: "Band Members",
    value: "5",
    icon: Music,
    trend: { value: "0", isPositive: false }
  }
]

const recentActivity = [
  { action: "Updated About Page", time: "2 hours ago", type: "edit" },
  { action: "Added new slider image", time: "4 hours ago", type: "create" },
  { action: "Published news article", time: "1 day ago", type: "publish" },
  { action: "Modified service details", time: "2 days ago", type: "edit" },
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-normal tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's what's happening with your website.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-primary to-accent">
          <Plus className="w-4 h-4 mr-2" />
          Quick Add
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest changes to your website content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'create' ? 'bg-cms-success' :
                    activity.type === 'edit' ? 'bg-cms-warning' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-normal">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button variant="outline" className="justify-start h-12">
                <Image className="w-4 h-4 mr-3" />
                Add New Slider
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Newspaper className="w-4 h-4 mr-3" />
                Create News Article
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <FileText className="w-4 h-4 mr-3" />
                Edit About Page
              </Button>
              <Button variant="outline" className="justify-start h-12">
                <Wrench className="w-4 h-4 mr-3" />
                Manage Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}