import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { CMSSidebar } from "./CMSSidebar"
import { Bell, User, LogOut, Settings, ChevronDown, Shield, Mail, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Outlet } from "react-router-dom"
import { useContext, useState, useEffect, useRef } from "react"
import { AuthContext } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useInactivityTimeout } from "@/hooks/useInactivityTimeout"

export function CMSLayout() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(30);
  const warningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // This should never happen if ProtectedRoute is working correctly,
  // but we'll handle it gracefully
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive">Authentication Error</p>
          <p className="text-muted-foreground">Please refresh the page.</p>
        </div>
      </div>
    );
  }

  const { user, logout } = authContext;

  const handleLogout = async () => {
    setShowWarning(false);
    await logout();
    navigate('/login');
  };


  // Handle inactivity timeout warning
  const handleWarning = (seconds: number) => {
    // Clear any existing interval
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
    }
    
    setSecondsRemaining(seconds);
    setShowWarning(true);
    
    // Countdown timer
    warningIntervalRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (warningIntervalRef.current) {
            clearInterval(warningIntervalRef.current);
            warningIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (warningIntervalRef.current) {
        clearInterval(warningIntervalRef.current);
      }
    };
  }, []);

  // Use inactivity timeout hook (5 minutes = 300000ms, warning at 30 seconds = 30000ms)
  const { resetTimer } = useInactivityTimeout({
    timeout: 5 * 60 * 1000, // 5 minutes
    warningTime: 30 * 1000, // 30 seconds warning
    onLogout: handleLogout,
    onWarning: handleWarning,
    enabled: !!user, // Only enable when user is logged in
  });

  const handleStayLoggedIn = () => {
    // Clear any existing interval
    if (warningIntervalRef.current) {
      clearInterval(warningIntervalRef.current);
      warningIntervalRef.current = null;
    }
    setShowWarning(false);
    setSecondsRemaining(30);
    // Reset the inactivity timer
    resetTimer();
  };

  // Auto-logout when countdown reaches 0
  useEffect(() => {
    if (showWarning && secondsRemaining === 0) {
      handleLogout();
    }
  }, [showWarning, secondsRemaining]);

  const handleProfileSettings = () => {
    navigate('/cms/profile');
  };

  const handleAccountManagement = () => {
    navigate('/cms/account');
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="w-3 h-3 text-red-500" />
      case 'editor':
        return <User className="w-3 h-3 text-blue-500" />
      case 'author':
        return <User className="w-3 h-3 text-green-500" />
      default:
        return <User className="w-3 h-3 text-gray-500" />
    }
  };

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
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <SidebarProvider>
      {/* Inactivity Warning Dialog */}
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              <DialogTitle>Session Timeout Warning</DialogTitle>
            </div>
            <DialogDescription className="pt-2">
              You have been inactive for a while. Your session will expire in{' '}
              <span className="font-semibold text-orange-600">{secondsRemaining}</span> second(s).
              <br />
              <br />
              Click "Stay Logged In" to continue your session, or you will be automatically logged out.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700"
            >
              Logout Now
            </Button>
            <Button onClick={handleStayLoggedIn} className="bg-primary">
              Stay Logged In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen flex w-full bg-background">
        <CMSSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h2 className="text-lg font-normal text-foreground">Content Management System</h2>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <Button variant="ghost" size="icon" title="Notifications">
                <Bell className="w-4 h-4" />
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-10 px-3 hover:bg-muted/50">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-normal">
                        {user?.name ? getInitials(user.name) : 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-normal text-foreground">
                        {user?.name || 'User'}
                      </span>
                      <div className="flex items-center gap-1">
                        {user?.role && getRoleIcon(user.role)}
                        <span className="text-xs text-muted-foreground capitalize">
                          {user?.role || 'User'}
                        </span>
                      </div>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user?.avatar || undefined} alt={user?.name} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-normal">
                            {user?.name ? getInitials(user.name) : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <p className="text-sm font-normal leading-none">{user?.name || 'User'}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Mail className="h-3 w-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">{user?.email || 'user@email.com'}</p>
                          </div>
                        </div>
                      </div>
                      {user?.role && (
                        <Badge 
                          className={`${getRoleBadgeColor(user.role)} text-white w-fit text-xs`}
                        >
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            <span className="capitalize">{user.role}</span>
                          </div>
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={handleProfileSettings} className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAccountManagement} className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Account</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}