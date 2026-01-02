import { Outlet } from 'react-router-dom';
import { CMSLayout } from './CMSLayout';
import { ProtectedRoute } from './ProtectedRoute';

/**
 * Wrapper component to ensure ProtectedRoute is rendered within AuthProvider context
 */
export function CMSRoutes() {
  return (
    <ProtectedRoute>
      <CMSLayout>
        <Outlet />
      </CMSLayout>
    </ProtectedRoute>
  );
}

