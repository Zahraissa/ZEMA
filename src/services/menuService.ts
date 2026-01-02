import { publicAPI } from './api';

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  link?: string;
  icon?: string;
  status: 'active' | 'inactive';
  order: number;
  created_at: string;
  updated_at: string;
}

export interface MenuGroup {
  id: number;
  menu_type_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  order: number;
  menu_items?: MenuItem[];
  created_at: string;
  updated_at: string;
}

export interface MenuType {
  id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive';
  menu_groups?: MenuGroup[];
  created_at: string;
  updated_at: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: {
    name: string;
    href: string;
    description: string;
  }[];
}

class MenuService {
  private static cachedMenu: NavigationItem[] | null = null;
  private static cacheExpiry: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  async getMenuStructure(): Promise<NavigationItem[]> {
    // Check if we have valid cached data
    if (MenuService.cachedMenu && Date.now() < MenuService.cacheExpiry) {
      return MenuService.cachedMenu;
    }

    try {
      const response = await publicAPI.getMenuStructure();
      
      if (response.success && response.data) {
        const menuTypes = response.data as MenuType[];
        
        // Transform the API data to match the Header component's expected format
        const navigationItems = this.transformMenuData(menuTypes);
        
        // Cache the result
        MenuService.cachedMenu = navigationItems;
        MenuService.cacheExpiry = Date.now() + this.CACHE_DURATION;
        
        return navigationItems;
      } else {
        console.error('Failed to fetch menu structure:', response.message);
        return this.getDefaultMenu();
      }
    } catch (error) {
      console.error('Error fetching menu structure:', error);
      return this.getDefaultMenu();
    }
  }

  private transformMenuData(menuTypes: MenuType[]): NavigationItem[] {
    const navigationItems: NavigationItem[] = [];

    // Find the main navigation menu type (you might want to adjust this logic)
    const mainMenu = menuTypes.find(type => type.name.toLowerCase().includes('main') || type.name.toLowerCase().includes('navigation')) || menuTypes[0];

    if (!mainMenu || !mainMenu.menu_groups) {
      return this.getDefaultMenu();
    }

    // Transform menu groups to navigation items
    mainMenu.menu_groups.forEach(group => {
      if (group.status === 'active' && group.menu_items && group.menu_items.length > 0) {
        const hasDropdown = group.menu_items.length > 1;
        
        if (hasDropdown) {
          // Create dropdown menu item
          const dropdownItems = group.menu_items
            .filter(item => item.status === 'active')
            .map(item => ({
              name: item.name,
              href: item.link || `/${group.name.toLowerCase().replace(/\s+/g, '-')}/${item.name.toLowerCase().replace(/\s+/g, '-')}`,
              description: item.description || ''
            }));

          navigationItems.push({
            name: group.name,
            href: `/${group.name.toLowerCase().replace(/\s+/g, '-')}`,
            hasDropdown: true,
            dropdownItems
          });
        } else {
          // Create single menu item
          const item = group.menu_items[0];
          navigationItems.push({
            name: group.name,
            href: item.link || `/${group.name.toLowerCase().replace(/\s+/g, '-')}`,
            hasDropdown: false
          });
        }
      }
    });

    // Add login item at the end
    navigationItems.push({
      name: "Login",
      href: "/login",
      hasDropdown: false
    });

    return navigationItems;
  }

  private getDefaultMenu(): NavigationItem[] {
    // Fallback menu structure
    return [
      { name: "Home", href: "/", hasDropdown: false },
      { 
        name: "About Us",
        href: "/about", 
        hasDropdown: true,
        dropdownItems: [
          { name: "Who we are", href: "/about", description: "Mamlaka ya Serikali Mtandao (e-GA) ni taasisi ya umma iliyoanzishwa kwa Sheria ya Serikali Mtandao Na. 10 ya mwaka 2019." },
          { name: "What we do", href: "/what-we-do", description: "Tunaimarisha na Kuendeleza Utoaji wa Huduma za Serikali Mtandao kwa Taasisi za Umma" },
          { name: "Message Of Director General", href: "/director-general", description: "Kwa niaba ya Menejimenti na Watumishi wa Mamlaka ya Serikali Mtandao (e-GA), ninayo furaha kuwakaribisha kwenye tovuti yetu mpya" },
        ]
      },
      { 
        name: "Regulator System",
        href: "/services", 
        hasDropdown: true,
        dropdownItems: [
          { name: "Introduction", href: "/introduction", description: "Mamlaka kwa kushirikiana na Taasisi mbalimbali za Umma, imesanifu, kujenga na kusimamia mifumo na miundombinu mbalimbali ya TEHAMA" },
          { name: "Compliance", href: "/accountability-LA", description: "Mamlaka imesanifu na kutengeneza Tovuti mbalimbali za taasisi za umma kwa lengo la kuwezesha utoaji na upatikanaji wa taarifa" },
        ]
      },
      { 
        name: "Standard and Guidelines",
        href: "/guidelines", 
        hasDropdown: true,
        dropdownItems: [
          { name: "Policy", href: "/policy", description: "Miongozo iliyoandaliwa na Ofisi ya Rais Menejimenti ya Utumishi wa Umma na Utawala Bora" },
          { name: "Guidlines", href: "/guidelines", description: "Miongozo iliyoandaliwa na Mamlaka ya Serikali Mtandao kwa lengo kutoa maelekezo ya kiufundi" },
        ]
      },
      { 
        name: "Media Center",
        href: "/news", 
        hasDropdown: true,
        dropdownItems: [
          { name: "News And Events", href: "/news", description: "Sehemu hii inaonesha picha za matukio mbalimbali yanayohusiana na e-GA" },
          { name: "Library", href: "/gallery", description: "Sehemu hii inaonesha video za matukio mbalimbali yanayohusiana na e-GA" },
          // { name: "Video Library", href: "/news/articles", description: "Sehemu hii ni maalumu kwa ajili ya habari na matukio yote yaliyojiri na yanayohusiana na e-GA" },
        ]
      },
      { name: "Contact Us", href: "/contact", hasDropdown: false },
      // { name: "Login", href: "/login", hasDropdown: false}
    ];
  }

  clearCache(): void {
    MenuService.cachedMenu = null;
    MenuService.cacheExpiry = 0;
  }

  // Method to clear cache when menu is updated
  clearMenuCache(): void {
    MenuService.cachedMenu = null;
    MenuService.cacheExpiry = 0;
  }

  // Method to force refresh menu data
  async refreshMenu(): Promise<NavigationItem[]> {
    this.clearCache();
    return await this.getMenuStructure();
  }
}

export const menuService = new MenuService();

