import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, User } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permissionName: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const savedUser = localStorage.getItem('user');
        
        if (token && savedUser) {
          try {
            // First set the saved user data (including avatar)
            const parsedUser = JSON.parse(savedUser);
            
            // Ensure permissions are an array
            if (parsedUser.permissions && !Array.isArray(parsedUser.permissions)) {
              parsedUser.permissions = Object.values(parsedUser.permissions);
            }
            
            setUser(parsedUser);
            
            // Then verify token is still valid by fetching user data
            const response = await authAPI.getUser();
            if (response.success) {
              // Update with fresh data from server, but preserve avatar if not in response
              const serverUser = response.data;
              
              // Ensure permissions are properly formatted as array
              if (serverUser.permissions && !Array.isArray(serverUser.permissions)) {
                serverUser.permissions = Object.values(serverUser.permissions);
              }
              
              const mergedUser = { 
                ...serverUser, 
                avatar: serverUser.avatar || parsedUser.avatar 
              };
              setUser(mergedUser);
              localStorage.setItem('user', JSON.stringify(mergedUser));
            } else {
              throw new Error('Invalid token');
            }
          } catch (error) {
            // Token is invalid, clear storage
            console.log('Token validation failed, clearing auth data');
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // No token or user data, set user to null
          setUser(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success) {
        const { user, token } = response.data;
        
        // Ensure permissions are properly formatted as array
        if (user.permissions && !Array.isArray(user.permissions)) {
          user.permissions = Object.values(user.permissions);
        }
        
        // Ensure roles are properly formatted as array
        if (user.roles && !Array.isArray(user.roles)) {
          user.roles = Object.values(user.roles);
        }
        
        setUser(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoading(false);
        return { success: true };
      }
      
      setIsLoading(false);
      return { success: false, error: 'Login failed. Please try again.' };
    } catch (error: any) {
      console.error('Login error:', error);
      setIsLoading(false);
      
      // Extract error message from validation errors
      let errorMessage = 'Invalid email or password!';
      if (error.response?.data?.errors?.email) {
        const emailErrors = error.response.data.errors.email;
        if (Array.isArray(emailErrors) && emailErrors.length > 0) {
          errorMessage = emailErrors[0];
        } else if (typeof emailErrors === 'string') {
          errorMessage = emailErrors;
        }
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    
    // Ensure roles is an array
    const roles = Array.isArray(user.roles) 
      ? user.roles 
      : user.roles 
        ? Object.values(user.roles) 
        : [];
    
    // Check many-to-many roles first (from API)
    if (roles && roles.length > 0) {
      return roles.some((role: any) => {
        if (typeof role === 'string') {
          return role === roleName;
        }
        return role.name === roleName;
      });
    }
    
    // Fallback to simple role field only if no many-to-many roles
    if (user.role === roleName) {
      return true;
    }
    
    return false;
  };

  const hasPermission = (permissionName: string): boolean => {
    if (!user) return false;
    
    // Ensure permissions is an array
    const permissions = Array.isArray(user.permissions) 
      ? user.permissions 
      : user.permissions 
        ? Object.values(user.permissions) 
        : [];
    
    // Use API permissions
    if (permissions && permissions.length > 0) {
      return permissions.some((permission: any) => {
        if (typeof permission === 'string') {
          return permission === permissionName;
        }
        return permission.name === permissionName;
      });
    }
    
    return false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissions: string[]): boolean => {
    if (!user) return false;
    return permissions.every(permission => hasPermission(permission));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      updateUser, 
      isLoading, 
      hasRole, 
      hasPermission, 
      hasAnyPermission, 
      hasAllPermissions 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
      // Return a default context to prevent crashes
      return {
        user: null,
        login: async () => ({ success: false }),
        logout: () => {},
        updateUser: () => {},
        isLoading: false,
        hasRole: () => false,
        hasPermission: () => false,
        hasAnyPermission: () => false,
        hasAllPermissions: () => false
      };
  }
  return context;
}