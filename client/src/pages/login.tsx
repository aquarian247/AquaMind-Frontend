import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeSelector } from '@/components/theme-selector';

// Shadcn/ui components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

// Form schema with validation
const loginFormSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

const LoginPage: React.FC = () => {
  // Auth context for login functionality
  const { login, isAuthenticated, isLoading, error, clearError } = useAuth();
  
  // Navigation
  const [, navigate] = useLocation();
  
  // Local form state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
      rememberMe: false,
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/executive');
    }
  }, [isAuthenticated, navigate]);

  // Clear any auth errors when form values change
  useEffect(() => {
    if (error) {
      const subscription = form.watch(() => clearError());
      return () => subscription.unsubscribe();
    }
  }, [error, form, clearError]);

  // Form submission handler
  const onSubmit = async (values: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      const success = await login(values.username, values.password);
      if (success) {
        navigate('/executive');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative">
      {/* Theme selector in top right corner */}
      <div className="absolute top-4 right-4">
        <ThemeSelector />
      </div>
      
      <div className="w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-6">
          {/* Theme-aware Bakkafrost logo */}
          <img
            src="/logo-light.png"
            alt="Bakkafrost Logo"
            className="h-12 w-auto mx-auto mb-4 block dark:hidden"
          />
          <img
            src="/logo-dark.png"
            alt="Bakkafrost Logo"
            className="h-12 w-auto mx-auto mb-4 hidden dark:block"
          />
          <h1 className="text-3xl font-bold text-foreground">AquaMind</h1>
          <p className="text-muted-foreground mt-1">
            Bakkafrost Aquaculture Management System
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Error alert */}
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Username field */}
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Enter your username" 
                          autoComplete="username"
                          disabled={isSubmitting}
                          autoFocus
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type="password" 
                          placeholder="Enter your password" 
                          autoComplete="current-password"
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Remember me checkbox */}
                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-1">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isSubmitting}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Remember me</FormLabel>
                        <FormDescription>
                          Keep me signed in on this device
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {/* Submit button */}
                <Button 
                  type="submit" 
                  variant="default"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 text-sm text-center">
            <p className="text-muted-foreground">Contact your administrator if you need access.</p>
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} AquaMind - Bakkafrost
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
