"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import { 
  Home, 
  User, 
  Settings, 
  FileText, 
  Image, 
  Users, 
  Newspaper, 
  Wrench, 
  Phone, 
  Info, 
  HelpCircle,
  ChevronDown,
  Briefcase,
  Calendar,
  Mail,
  MapPin,
  Star,
  Heart,
  Download,
  ExternalLink
} from "lucide-react"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { publicAPI, MenuType } from "@/services/api"

interface DynamicMenuProps {
  variant?: 'desktop' | 'mobile'
}

const iconMap: { [key: string]: React.ComponentType<any> } = {
  home: Home,
  user: User,
  settings: Settings,
  'file-text': FileText,
  image: Image,
  users: Users,
  newspaper: Newspaper,
  wrench: Wrench,
  phone: Phone,
  info: Info,
  'help-circle': HelpCircle,
  briefcase: Briefcase,
  calendar: Calendar,
  mail: Mail,
  'map-pin': MapPin,
  star: Star,
  heart: Heart,
  download: Download,
  'external-link': ExternalLink,
}

function ListItem({
  title,
  children,
  href,
  icon,
  featured = false,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & { 
  href: string
  icon?: string
  featured?: boolean
}) {
  const IconComponent = icon ? iconMap[icon] : null

  if (featured) {
    return (
      <li className="row-span-3" {...props}>
        <NavigationMenuLink asChild>
          <Link
            to={href}
            className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 p-6 no-underline outline-none focus:shadow-md transition-all hover:bg-gradient-to-b hover:from-blue-100 hover:to-blue-200 dark:hover:from-blue-900/50 dark:hover:to-blue-800/50 shadow-sm hover:shadow-md"
          >
            <div className="p-2.5 rounded-full bg-primary/10 w-fit">
              {IconComponent && <IconComponent className="h-6 w-6 text-primary" />}
            </div>
            <div className="mb-2 mt-4 text-lg font-normal">{title}</div>
            <p className="text-sm leading-tight text-muted-foreground">
              {children}
            </p>
          </Link>
        </NavigationMenuLink>
      </li>
    )
  }

  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link to={href} className="block select-none rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground group">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-colors flex-shrink-0">
              {IconComponent && <IconComponent className="h-4 w-4 text-primary" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-normal leading-none">{title}</div>
              {children && (
                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                  {children}
                </p>
              )}
            </div>
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
}

export default function DynamicMenu({ variant = 'desktop' }: DynamicMenuProps) {
  const [menuData, setMenuData] = React.useState<MenuType[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const response = await publicAPI.getMenuStructure()
        if (response.success) {
          setMenuData(response.data)
        }
      } catch (error) {
        console.error('Error fetching menu structure:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuData()
  }, [])

  if (loading) {
    return null
  }

  if (menuData.length === 0) {
    return null
  }

  // For mobile variant, return a simplified dropdown
  if (variant === 'mobile') {
    return (
      <div className="space-y-3">
        {menuData.map((menuType) => (
          <div key={menuType.id} className="group">
            <div className="flex items-center justify-between py-2 px-4 text-base font-normal text-gray-700">
              <span>{menuType.name}</span>
              {menuType.menu_groups && menuType.menu_groups.length > 0 && (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </div>
            
            {menuType.menu_groups && menuType.menu_groups.length > 0 && (
              <div className="ml-4 space-y-2 border-l border-gray-200 pl-4">
                {menuType.menu_groups.map((group) => (
                  <div key={group.id} className="space-y-1">
                    <div className="text-sm font-normal text-gray-600 py-1">
                      {group.name}
                    </div>
                    {group.menu_items && group.menu_items.length > 0 && (
                      <div className="ml-4 space-y-1">
                        {group.menu_items.map((item) => {
                          const IconComponent = item.icon ? iconMap[item.icon] : null
                          return (
                            <Link
                              key={item.id}
                              to={item.link || '#'}
                              className="flex items-center gap-2 py-1 px-2 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
                            >
                              {IconComponent && <IconComponent className="h-3 w-3" />}
                              {item.name}
                            </Link>
                          )
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // For desktop variant, return the full NavigationMenu
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList className="gap-2">
        {menuData.map((menuType) => {
          // If menu has groups, create a dropdown
          if (menuType.menu_groups && menuType.menu_groups.length > 0) {
            return (
              <NavigationMenuItem key={menuType.id}>
                <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 font-normal text-base transition-all duration-300 hover:text-primary inline-flex items-center gap-2">
                  {menuType.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-2">
                    {/* Featured item - first item from first group */}
                    {menuType.menu_groups[0]?.menu_items?.[0] && (
                      <ListItem
                        key={`featured-${menuType.menu_groups[0].menu_items[0].id}`}
                        title={menuType.menu_groups[0].menu_items[0].name}
                        href={menuType.menu_groups[0].menu_items[0].link || '#'}
                        icon={menuType.menu_groups[0].menu_items[0].icon}
                        featured={true}
                      >
                        {menuType.menu_groups[0].menu_items[0].description || `Access ${menuType.menu_groups[0].menu_items[0].name} services`}
                      </ListItem>
                    )}
                    
                    {/* Regular items */}
                    {menuType.menu_groups.map((group) => (
                      group.menu_items && group.menu_items.slice(1).map((item) => (
                        <ListItem
                          key={item.id}
                          title={item.name}
                          href={item.link || '#'}
                          icon={item.icon}
                        >
                          {item.description}
                        </ListItem>
                      ))
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )
          }

          // If menu has no groups but has items directly, create a simple dropdown
          return (
            <NavigationMenuItem key={menuType.id}>
              <NavigationMenuTrigger className="bg-transparent hover:bg-accent/50 font-normal text-base transition-all duration-300 hover:text-primary inline-flex items-center gap-2">
                {menuType.name}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-6">
                  {/* Featured item - first item */}
                  {menuType.menu_items?.[0] && (
                    <ListItem
                      key={`featured-${menuType.menu_items[0].id}`}
                      title={menuType.menu_items[0].name}
                      href={menuType.menu_items[0].link || '#'}
                      icon={menuType.menu_items[0].icon}
                      featured={true}
                    >
                      {menuType.menu_items[0].description || `Access ${menuType.menu_items[0].name} services`}
                    </ListItem>
                  )}
                  
                  {/* Regular items */}
                  {menuType.menu_items && menuType.menu_items.slice(1).map((item) => (
                    <ListItem
                      key={item.id}
                      title={item.name}
                      href={item.link || '#'}
                      icon={item.icon}
                    >
                      {item.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          )
        })}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
