import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // Use useContext directly to avoid throwing error if AuthProvider is not available
  const authContext = useContext(AuthContext);
  
  // If AuthProvider is not available, show error message
  if (!authContext) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <p className="text-destructive">Authentication Error</p>
          <p className="text-muted-foreground">Please refresh the page or contact support.</p>
        </div>
      </div>
    );
  }

  const { user, isLoading } = authContext;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}