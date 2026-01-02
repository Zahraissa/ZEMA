import { Button } from "@/components/ui/button";
import {
    Menu,
    X,
    ChevronDown,
    Search,
    ArrowRight,
    Star,
    Zap,
    Shield,
    Users,
    Building,
    FileText,
    Calendar,
    Award,
    Heart,
    Eye,
    TrendingUp,
    Clock,
    ArrowUpRight,
    Globe,
    Mail,
    Phone, ChevronRight, CheckCircle2Icon, Grid3X3
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useMenu } from "@/hooks/useMenu";
import { useLanguage } from "./LanguageContext";

interface NavigationItem {
  name: string;
  href: string;
  hasDropdown: boolean;
  dropdownItems?: {
    name: string;
    href: string;
    description: string;
    icon?: string;
    badge?: string;
  }[];
}

const translations = {
  sw: {
    title: "WIZARA YA BIASHARA NA VIWANDA",
    subtitle: "MAMLAKA YA UDHIBITI WA LESENI ZA BIASHARA",
    search: "Tafuta...",
    weather: "Hali ya Hewa",
    navigation: "Menyu",
    explore: "Gusa huduma zetu",
    menuFailed: "Menyu haipatikani",
    retry: "Jaribu tena",
    popular: "Huduma Maarufu",
    new: "Mpya",
    featured: "Maalum",
    trending: "Inavuma",
    updated: "Imesasishwa",
    viewAll: "Angalia Zote",
    quickLinks: "Viungo vya Haraka",
    services: "Huduma",
    contact: "Wasiliana Nasi",
    seeMore: "Ona Zaidi",
    mostUsed: "Inatumika Sana",
    allServices: "Huduma Zote",
  },
  en: {
    title: "MINISTRY OF TRADE AND INDUSTRIAL DEVELOPMENT",
    subtitle: "BUSINESS LICENSING REGULATORY COUNCIL",
    search: "Search...",
    weather: "Weather",
    navigation: "Navigation",
    explore: "Explore our services",
    menuFailed: "Menu loading failed",
    retry: "Retry",
    popular: "Popular Services",
    new: "New",
    featured: "Featured",
    trending: "Trending",
    updated: "Recently Updated",
    viewAll: "View All",
    quickLinks: "Quick Links",
    services: "Services",
    contact: "Contact Us",
    seeMore: "See More",
    mostUsed: "Most Used",
    allServices: "All Services",
  },
};



const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { lang } = useLanguage();
  const { navigationItems, loading, error, refreshMenu } = useMenu();

  // Filter out login-related navigation items
  const filteredNavigationItems = navigationItems.filter((item) => {
    const isLoginItem =
      item.name.toLowerCase().includes("login") ||
      item.href.toLowerCase().includes("login") ||
      item.name.toLowerCase().includes("signin") ||
      item.href.toLowerCase().includes("signin") ||
      item.name.toLowerCase().includes("signup") ||
      item.href.toLowerCase().includes("signup");

    if (isLoginItem) return false;

    if (item.hasDropdown && item.dropdownItems) {
      item.dropdownItems = item.dropdownItems.filter(
        (dropdownItem) =>
          !dropdownItem.name.toLowerCase().includes("login") &&
          !dropdownItem.href.toLowerCase().includes("login") &&
          !dropdownItem.name.toLowerCase().includes("signin") &&
          !dropdownItem.href.toLowerCase().includes("signin") &&
          !dropdownItem.name.toLowerCase().includes("signup") &&
          !dropdownItem.href.toLowerCase().includes("signup")
      );
    }

    return true;
  });

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Enhanced dropdown item with appropriate icons
  const getEnhancedDropdownItems = (items: any[]) => {
    const genericIcons = ['file', 'users', 'calendar', 'building', 'globe', 'shield', 'zap', 'mail', 'phone', 'award'];
    return items.map((item, index) => ({
      ...item,
      icon: genericIcons[index % genericIcons.length],
      badge: index < 2 ? translations[lang].featured :
        index === 3 ? translations[lang].new :
          index === 4 ? translations[lang].trending : undefined
    }));
  };

  // const getIconComponent = (iconName: string) => {
  //   const IconComponent = iconMap[iconName as keyof typeof iconMap] || FileText;
  //   return <IconComponent className="w-4 h-4" />;
  // };

  // Get badge color based on type
  const getBadgeColor = (badgeType: string) => {
    switch (badgeType) {
      case translations[lang].featured:
        return "bg-gradient-to-r from-blue-500 to-blue-500";
      case translations[lang].new:
        return "bg-gradient-to-r from-green-400 to-blue-500";
      case translations[lang].trending:
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-blue-400 to-blue-500";
    }
  };

  const getBadgeTextColor = (badgeType: string) => {
    switch (badgeType) {
      case translations[lang].featured:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case translations[lang].new:
        return "bg-green-700 text-white rounded-lg";
      case translations[lang].trending:
        return "bg-blue-100 text-blue-800 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <header className="bg-green-500 shadow-elegant">
      {/* Spacer for fixed header */}
      {isScrolled && <div className="h-16 sm:h-20"></div>}

      {/* Logo Section */}
      <div
        className={`hidden sm:flex justify-between items-center px-6 py-4 bg-white transition-all duration-300 ${isScrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        style={{
          backgroundImage: "url('/banner-background.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="w-32 h-24 flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>

        <div className="flex flex-col items-center text-center notranslate mx-4 flex-1 max-w-4xl">
          <h1 className="text-gray-900 font-bold text-xl lg:text-2xl xl:text-3xl leading-tight bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent px-4 break-words whitespace-normal">
            {translations[lang].title}
          </h1>
          <p className="text-gray-800 text-xl lg:text-2xl xl:text-3xl font-semibold mt-2 px-4 break-words whitespace-normal">
            {translations[lang].subtitle}
          </p>
        </div>

        <div className="w-32 h-20 flex-shrink-0 transform hover:scale-105 transition-transform duration-300">
          <img
            src="/Logo_zie.png"
            alt="Logo"
            className="w-full h-full object-contain drop-shadow-lg"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <div
        className={`${isScrolled
          ? "fixed top-0 left-0 right-0 z-50 shadow-2xl bg-gradient-to-r from-green-600 via-green-600 to-green-600 animate-slideDown bg-opacity-95 container"
          : "relative shadow-lg bg-gradient-to-r from-green-600 via-green-600 to-green-600"
          } transition-all duration-100 border-b border-white/20`}
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center w-full">
              <div className="text-white font-semibold text-lg flex-1 text-center bg-white/10 py-2 rounded-xl backdrop-blur-sm line-clamp-2 px-2">
                {translations[lang].subtitle}
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                >
                  <Search className="w-5 h-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20 rounded-lg transition-all duration-200 hover:scale-110 backdrop-blur-sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </Button>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2 mx-auto">
              {loading ? (
                <div className="flex items-center space-x-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="animate-pulse bg-white/20 h-8 w-28 rounded-xl"></div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-white text-sm flex items-center space-x-3 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm">
                  <span>{translations[lang].menuFailed}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={refreshMenu}
                    className="text-white hover:bg-white/20"
                  >
                    {translations[lang].retry}
                  </Button>
                </div>
              ) : (
                filteredNavigationItems.map((item, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setActiveDropdown(item.name)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    {item.hasDropdown ? (
                      <div className="relative">
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/20 flex items-center space-x-2 px-5 py-3 rounded-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg backdrop-blur-sm border border-white/10 min-w-[120px] justify-center"
                        >
                          <span className="font-semibold text-sm tracking-wide text-center whitespace-nowrap">
                            {item.name}
                          </span>
                          <ChevronDown className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180 flex-shrink-0" />
                        </Button>

                        {/* Magical Blue/bulue/blue Dropdown Menu */}
                        <div
                          className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[720px] bg-white shadow-lg border border-green-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 transform-gpu group-hover:translate-y-0 translate-y-2 scale-98 group-hover:scale-100 overflow-hidden ${activeDropdown === item.name ? 'animate-in fade-in-0 zoom-in-95' : ''
                            }`}
                        >
                          {/* Elegant Header */}
                          <div className="bg-gradient-to-r from-green-500 via-green-500 to-green-500 bg-opacity-95 z-50 px-6 py-4 border-b border-green-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                  <Grid3X3 className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                  <h3 className="text-white font-bold text-lg tracking-tight">
                                    {item.name}
                                  </h3>
                                  <p className="text-blue-100 text-sm font-medium">
                                    current {item.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Services Grid */}
                          <div className="p-6 bg-gradient-to-br from-blue-50 via-white to-bulue-50">
                            <div className="grid grid-cols-2 gap-3">
                              {getEnhancedDropdownItems(item.dropdownItems || [])
                                .slice(0, 8)
                                .map((dropdownItem, idx) => (
                                  <Link
                                    key={idx}
                                    to={dropdownItem.href}
                                    className="group/item block p-4 bg-white border border-blue-100 hover:border-bulue-300 hover:shadow-lg transition-all duration-200 hover:translate-y-[-2px] relative overflow-hidden"
                                  >
                                    {/* Background Gradient Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>

                                    <div className="relative flex items-start space-x-3">
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between mb-2">
                                          <span className="font-semibold text-gray-900 text-sm group-hover/item:text-blue-600 transition-colors leading-tight break-words">
                                            {dropdownItem.name}
                                          </span>
                                          <span>{dropdownItem.badge && (
                                              <div className="mb-2">
                                            <span className={`text-xs px-2 py-1 font-medium ${getBadgeTextColor(dropdownItem.badge)}`}>
                                              {dropdownItem.badge}
                                            </span>
                                              </div>
                                          )}</span>
                                        </div>

                                        <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">
                                          {dropdownItem.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                            </div>

                            {/* View All Section */}
                            {item.dropdownItems && item.dropdownItems.length > 8 && (
                              <div className="mt-4 pt-4 border-t border-blue-100">
                                <Link
                                  to={item.href}
                                  className="group/view-all flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-semibold transition-colors bg-white border border-blue-200 hover:border-bulue-300 py-3 hover:shadow-md"
                                >
                                  <span>{translations[lang].viewAll} {item.name}</span>
                                  <ChevronRight className="w-4 h-4 group-hover/view-all:translate-x-1 transition-transform" />
                                </Link>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link to={item.href}>
                        <Button
                          variant="ghost"
                          className="text-white hover:bg-white/20 px-5 py-3 rounded-sm transition-all duration-300 hover:scale-105 font-semibold text-sm tracking-wide backdrop-blur-sm border border-white/10 hover:shadow-lg min-w-[120px] justify-center"
                        >
                          <span className="text-center whitespace-nowrap">
                            {item.name}
                          </span>
                        </Button>
                      </Link>
                    )}
                  </div>
                ))
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Sheet */}
      {isMenuOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-50 animate-in fade-in duration-300"
            onClick={() => setIsMenuOpen(false)}
          />

          <div className="lg:hidden fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 animate-in slide-in-from-right duration-300 ease-out border-l border-blue-200">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="relative p-6 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 text-white border-b border-blue-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold truncate">{translations[lang].navigation}</h2>
                    <p className="text-blue-100 text-sm mt-1 truncate">
                      {translations[lang].explore}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 flex-shrink-0 ml-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Mobile Navigation Content */}
              <nav className="flex-1 p-6 overflow-y-auto bg-gradient-to-b from-blue-50 to-white">
                <div className="space-y-3">
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse bg-gray-200 h-16"></div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">{translations[lang].menuFailed}</p>
                      <Button
                        variant="outline"
                        onClick={refreshMenu}
                        className="w-full border-blue-300 text-blue-600 hover:bg-blue-50"
                      >
                        {translations[lang].retry}
                      </Button>
                    </div>
                  ) : (
                    filteredNavigationItems.map((item, index) => (
                      <div key={index} className="group">
                        {item.hasDropdown ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-4 text-base font-semibold text-gray-700 bg-white border border-blue-100 hover:border-blue-300 transition-all duration-200 shadow-sm">
                              <div className="flex items-center space-x-3 min-w-0 flex-1">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-500 flex items-center justify-center shadow flex-shrink-0">
                                  <span className="text-white font-bold text-sm">
                                    {item.name.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-gray-800 truncate">{item.name}</span>
                              </div>
                              <ChevronDown className="w-4 h-4 text-gray-500 transition-transform duration-300 group-hover:rotate-180 flex-shrink-0" />
                            </div>

                            <div className="ml-4 space-y-2 border-l-2 border-bulue-200 pl-3">
                              {getEnhancedDropdownItems(item.dropdownItems || []).map((dropdownItem, idx) => (
                                <Link
                                  key={idx}
                                  to={dropdownItem.href}
                                  className="block p-3 text-sm text-gray-600 hover:text-gray-900 bg-white border border-blue-50 hover:border-bulue-200 transition-all duration-200 group/item shadow-sm"
                                  onClick={() => setIsMenuOpen(false)}
                                >
                                  <div className="flex items-start space-x-3">

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between mb-1">
                                        <span className="font-semibold text-gray-900 group-hover/item:text-blue-600 transition-colors leading-tight break-words">
                                          {dropdownItem.name}
                                        </span>
                                        {dropdownItem.badge && (
                                          <span className={`text-xs px-1.5 py-0.5 font-medium ${getBadgeTextColor(dropdownItem.badge)} flex-shrink-0 ml-2`}>
                                            {dropdownItem.badge}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                        {dropdownItem.description}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <Link to={item.href}>
                            <Button
                              variant="ghost"
                              className="w-full justify-start text-left p-4 text-base font-semibold hover:bg-blue-50 rounded-none border border-blue-100 hover:border-bulue-300 transition-all duration-200 group-hover:shadow-sm bg-white"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <div className="flex items-center space-x-3 w-full min-w-0">
                                <div className="w-10 h-10 bg-gradient-to-r from-bulue-500 to-blue-500 flex items-center justify-center shadow flex-shrink-0">
                                  <span className="text-white font-bold text-sm">
                                    {item.name.charAt(0)}
                                  </span>
                                </div>
                                <span className="text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                                  {item.name}
                                </span>
                              </div>
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;