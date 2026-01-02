import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface PermissionGuardProps {
  children: React.ReactNode;
  permission?: string;
  permissions?: string[];
  role?: string;
  roles?: string[];
  requireAll?: boolean; // For permissions/roles arrays, require all or any
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  permissions,
  role,
  roles,
  requireAll = false,
  fallback = null,
  showFallback = false
}) => {
  const { hasPermission, hasRole, hasAllPermissions, hasAnyPermission } = useAuth();

  let hasAccess = true;

  // Check single permission
  if (permission) {
    hasAccess = hasAccess && hasPermission(permission);
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && hasAllPermissions(permissions);
    } else {
      hasAccess = hasAccess && hasAnyPermission(permissions);
    }
  }

  // Check single role
  if (role) {
    hasAccess = hasAccess && hasRole(role);
  }

  // Check multiple roles
  if (roles && roles.length > 0) {
    if (requireAll) {
      hasAccess = hasAccess && roles.every(r => hasRole(r));
    } else {
      hasAccess = hasAccess && roles.some(r => hasRole(r));
    }
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  if (showFallback) {
    return <>{fallback}</>;
  }

  return null;
};

export default PermissionGuard;

