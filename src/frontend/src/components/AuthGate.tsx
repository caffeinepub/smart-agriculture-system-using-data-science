import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGate({ children, fallback }: AuthGateProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  if (!identity) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle>Authentication Required</CardTitle>
          <CardDescription>Please sign in to access this feature</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} disabled={isLoggingIn} className="w-full">
            {isLoggingIn ? 'Signing in...' : 'Sign In'}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
