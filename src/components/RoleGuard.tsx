import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  role?: string;
  roles?: string[];
  requireAll?: boolean; // For roles array, require all or any
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  role,
  roles,
  requireAll = false,
  fallback = null,
  showFallback = false
}) => {
  const { hasRole } = useAuth();

  let hasAccess = true;

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

export default RoleGuard;

