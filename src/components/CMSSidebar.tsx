import {
  LayoutDashboard,
  Image,
  Users,
  Newspaper,
  Wrench,
  Music,
  FileText,
  Settings,
  LogOut,
  FolderOpen,
  BarChart3,
  MessageSquare,
  Shield,
  Search,
  Palette,
  Archive,
  HelpCircle,
  Monitor,
  UserCog,
  BookOpen,
  MessageCircle,
  UserCheck,
  Building,
  Phone,
  Star,
  FileCode,
  Award,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Permission mapping for each menu item
const mainItems = [
  { title: "Dashboard", url: "/cms", icon: LayoutDashboard, permissions: [] }, // Dashboard accessible to all authenticated users
  { title: "Manage Slider", url: "/cms/sliders", icon: Image, permissions: ["manage_sliders", "view_sliders"] },
  { title: "Manage About", url: "/cms/about", icon: FileText, permissions: ["manage_about", "view_about"] },
  { title: "Manage News", url: "/cms/news", icon: Newspaper, permissions: ["manage_news", "view_news"] },
  { title: "Manage Services", url: "/cms/services", icon: Wrench, permissions: ["manage_services", "view_services"] },
  { title: "Manage Website Services", url: "/cms/website-services", icon: Monitor, permissions: ["manage_website_services", "view_website_services"] },
  { title: "Manage Gallery", url: "/cms/gallery", icon: Image, permissions: ["manage_gallery", "view_gallery"] },
  { title: "Manage Members", url: "/cms/band", icon: Users, permissions: ["manage_members", "view_members"] },
  { title: "Manage Director General", url: "/cms/director-general", icon: UserCheck, permissions: ["manage_director_general", "view_director_general"] },
  { title: "Manage Authority Functions", url: "/cms/authority-functions", icon: Building, permissions: ["manage_authority_functions", "view_authority_functions"] },
  { title: "Manage Contact Offices", url: "/cms/contact", icon: Phone, permissions: ["manage_contacts", "view_contacts"] },
  { title: "Manage Muhimu Section", url: "/cms/muhimu", icon: Star, permissions: ["manage_muhimu", "view_muhimu"] },
  { title: "Miongozo ya Kisera", url: "/cms/policy-guidelines", icon: Shield, permissions: ["manage_policy_guidelines", "view_policy_guidelines"] },
  { title: "Viwango na Miongozo", url: "/cms/manage-viwango", icon: Award, permissions: ["manage_viwango", "view_viwango"] },
  { title: "Samples & Templates", url: "/cms/manage-sampuli", icon: FileCode, permissions: ["manage_samples", "view_samples"] },
  { title: "Orodha ya Miongozo na Viwango", url: "/cms/manage-orodha", icon: Building, permissions: ["manage_orodha", "view_orodha"] },
  { title: "Manage System", url: "/cms/brands", icon: Palette, permissions: ["manage_system", "view_system"] },
  { title: "Manage Users", url: "/cms/users", icon: UserCog, permissions: ["manage_users", "view_users"] },
  { title: "Manage Roles", url: "/cms/roles", icon: Shield, permissions: ["manage_roles", "view_roles"] },
  { title: "Manage Permissions", url: "/cms/permissions", icon: Shield, permissions: ["manage_permissions", "view_permissions"] },
  { title: "Add Permission", url: "/cms/add-permission", icon: Shield, permissions: ["manage_permissions", "create_permissions"] },
  { title: "User Role Assignment", url: "/cms/user-role-assignment", icon: UserCog, permissions: ["manage_user_roles", "assign_roles"] },
  { title: "Manage Menu", url: "/cms/menu", icon: Settings, permissions: ["manage_menu", "view_menu"] },
  { title: "Guidelines", url: "/cms/guides", icon: BookOpen, permissions: ["manage_guidelines", "view_guidelines"] },
  { title: "Manage Welcome Messages", url: "/cms/welcome-messages", icon: MessageSquare, permissions: ["manage_welcome_messages", "view_welcome_messages"] },
  { title: "Manage FAQs", url: "/cms/faqs", icon: MessageCircle, permissions: ["manage_faqs", "view_faqs"] },
];

const mediaItems = [
  { title: "Media Library", url: "/content/media", icon: FolderOpen },
  { title: "SEO Manager", url: "/content/seo", icon: Search },
  { title: "Themes", url: "/content/themes", icon: Palette },
];

const analyticsItems = [
  { title: "Analytics", url: "/content/analytics", icon: BarChart3 },
  { title: "Comments", url: "/content/comments", icon: MessageSquare },
  { title: "Backup", url: "/content/backup", icon: Archive },
];

const settingsItems = [
  { title: "Settings", url: "/content/settings", icon: Settings },
  { title: "Security", url: "/content/security", icon: Shield },
  { title: "System Status", url: "/status", icon: Monitor },
  { title: "Help", url: "/content/help", icon: HelpCircle },
];

export function CMSSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const { logout, hasPermission, hasAnyPermission, user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-primary text-primary-foreground font-normal"
      : "hover:bg-muted/50 transition-colors";

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Brand */}
        <div className="p-4 border-b border-sidebar-border bg-sidebar-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-accent flex items-center justify-center shadow-sm">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-normal text-lg text-sidebar-foreground">
                  CMS
                </h1>
                <p className="text-xs text-sidebar-foreground/70">
                  Content Manager
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-normal px-2">
            Content Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => {
                // Check permissions for each menu item
                let canAccess = false;
                
                // Check if user is loaded
                if (!user) {
                  // If user is not loaded, hide all items except dashboard
                  canAccess = item.url === "/cms";
                  if (!canAccess) return null;
                } else {
                  // Check super admin role - super admin can access everything
                  const isSuperAdmin = user?.role === 'super_admin' || 
                                (Array.isArray(user?.roles) && user.roles.some((r: any) => 
                                  (typeof r === 'string' ? r === 'super_admin' : r.name === 'super_admin')
                                ));
                  
                  if (isSuperAdmin) {
                    canAccess = true; // Super admin can access everything
                  } else {
                    // For non-admin users, check permissions
                    // Get user's permissions
                    const userPermissions = Array.isArray(user.permissions) 
                      ? user.permissions 
                      : user.permissions 
                        ? Object.values(user.permissions) 
                        : [];
                    
                    // Debug: Log permissions for troubleshooting
                    if (process.env.NODE_ENV === 'development' && item.url === "/cms") {
                      console.log('=== Permission Debug ===');
                      console.log('User:', user.name, user.email);
                      console.log('User role:', user.role);
                      console.log('User roles (many-to-many):', user.roles);
                      console.log('User permissions:', userPermissions);
                      console.log('Permissions count:', userPermissions.length);
                      console.log('Permission names:', userPermissions.map((p: any) => 
                        typeof p === 'string' ? p : p.name || p.display_name || p.id
                      ));
                    }
                    
                    // If item has no permission requirements (empty array), allow access
                    if (item.permissions && item.permissions.length > 0) {
                      // Item requires permissions - check if user has any of them
                      if (userPermissions.length === 0) {
                        // User has no permissions, deny access to items that require permissions
                        canAccess = false;
                      } else {
                        // Check if user has any of the required permissions
                        canAccess = hasAnyPermission(item.permissions);
                      }
                    } else {
                      // Items with no permission requirements (like Dashboard) are accessible to all authenticated users
                      canAccess = true;
                    }
                  }
                }
                
                if (!canAccess) return null;
                
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        end={item.url === "/"}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                            isActive
                              ? "bg-sidebar-nav-active text-white font-normal shadow-sm"
                              : "text-white hover:bg-sidebar-nav-hover hover:text-white"
                          }`
                        }
                      >
                        <item.icon className="w-4 h-4 flex-shrink-0" />
                        {!isCollapsed && (
                          <span className="truncate">{item.title}</span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Media & Tools */}
        {/* <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-normal px-2">
            Media & Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mediaItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-nav-active text-white font-normal shadow-sm"
                            : "text-white hover:bg-sidebar-nav-hover hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Analytics & Reports */}
        {/* <SidebarGroup className="px-2 py-4">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-normal px-2">
            Analytics & Reports
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {analyticsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-nav-active text-white font-normal shadow-sm"
                            : "text-white hover:bg-sidebar-nav-hover hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Settings */}
        {/* <SidebarGroup className="px-2 py-4 mt-auto">
          <SidebarGroupLabel className="text-sidebar-foreground/70 font-normal px-2">
            System
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-sidebar-nav-active text-white font-normal shadow-sm"
                            : "text-white hover:bg-sidebar-nav-hover hover:text-white"
                        }`
                      }
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="truncate">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 text-white hover:bg-destructive/20 hover:text-white cursor-pointer"
                >
                  <LogOut className="w-4 h-4 flex-shrink-0" />
                  {!isCollapsed && <span className="truncate">Logout</span>}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
      </SidebarContent>
    </Sidebar>
  );
}
