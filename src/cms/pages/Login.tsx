import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate()
  const { login, logout, user, isLoading } = useAuth();
  const { toast } = useToast();

  // Optionally redirect if already logged in (commented out to allow access to login page)
  // if (user) {
  //   return <Navigate to="/cms" replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: "Login Successful",
        description: "Welcome to the CMS Dashboard!",
      });
      navigate("/cms")
    } else {
      setError(result.error || 'Invalid email or password!');
    }
  };



    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-4"
             style={{backgroundImage: 'url(Zanzibar.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
            <Card className="w-full max-w-md shadow-2xl border-0 bg-card/95 backdrop-blur-md mb-8"style={{ backgroundColor:'#F3F7FB'}}>
                <CardHeader className="space-y-2 text-center">
                    {/* Logo */}
                    <div className="mx-auto mb-6">
                        <img
                            src="/blra-logo.jpneg" style={{ height: '150px', width: '150px' }}
                            alt="Blra Logo"
                            className="h-16 w-auto mx-auto"
                            onError={(e) => {
                                // Fallback to text logo if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <div className="hidden text-center">
                            <div className="text-sm text-gray-600">Blra logo</div>
                        </div>
                    </div>

                    {/* <div className="mx-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
            <LayoutDashboard className="w-8 h-8 text-white" />
          </div> */}
                    <div>
                        <CardTitle className="text-2xl font-bold">
                            {user ? 'Already Logged In' : 'ADMIN PORTAL'}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {user
                                ? `Hello ${user.name}! You're already logged in.`
                                : 'Sign in to access Admin Dashboard'
                            }
                        </CardDescription>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Show different content for logged in users */}
                    {user ? (
                        <div className="space-y-4">
                            <Alert className="border-green-200 bg-green-50">
                                <AlertDescription className="text-sm text-green-800">
                                    You are currently logged in as <strong>{user.name}</strong>
                                </AlertDescription>
                            </Alert>

                            <div className="grid grid-cols-1 gap-3">
                                <Button
                                    onClick={() => navigate('/cms')}
                                    className="w-full h-11 font-medium"
                                >
                                    Go to Dashboard
                                </Button>

                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        // Allow user to logout and login as different user
                                        logout();
                                        setEmail('');
                                        setPassword('');
                                    }}
                                    className="w-full h-11 font-medium"
                                >
                                    Logout & Login as Different User
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>


                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-11"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 pr-10"
                                            autoComplete="current-password"
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                </div>

                                {error && (
                                    <Alert variant="destructive">
                                        <AlertDescription className="text-sm">
                                            {error.includes('locked due to 3 failed') ? (
                                                <div className="space-y-2">
                                                    <div className="font-medium">🔒 Account Locked</div>
                                                    <div>{error}</div>
                                                </div>
                                            ) : error.includes('will be locked after this') ? (
                                                <div className="space-y-2">
                                                    <div className="font-medium">⚠️ Final Warning</div>
                                                    <div>{error}</div>
                                                    <div className="text-xs opacity-90 mt-2">
                                                        This is your last chance. Account will be locked for 10 minutes after this attempt.
                                                    </div>
                                                </div>
                                            ) : error.includes('attempts remaining') ? (
                                                <div className="space-y-2">
                                                    <div className="font-medium">⚠️ Login Attempt Warning</div>
                                                    <div>{error}</div>
                                                    <div className="text-xs opacity-90 mt-2">
                                                        Please check your credentials carefully to avoid account lockout.
                                                    </div>
                                                </div>
                                            ) : (
                                                error
                                            )}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full h-11 font-medium"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </Button>
                            </form>

                            {/* <div className="text-center text-sm text-muted-foreground">
            This is a demo environment. No real authentication required.
          </div> */}

                        </>
                    )}
                </CardContent>
            </Card>
            <div className="text-balance font-semibold font-sans text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary max-w-md text-zinc-950">

                Copyright © {new Date().getFullYear()}, Developed & Maintained by ICT UNIT
            </div>
        </div>

    );
}