import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NeuroDashLogo } from "@/components/NeuroDashLogo";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { validateEmail, validatePassword, validateUsername, validateFullName, validateReferralCode, sanitizeInput, authRateLimiter } from "@/lib/security";
import type { Session } from '@supabase/supabase-js';
const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const referralCode = searchParams.get('ref');
  const {
    toast
  } = useToast();
  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate]);
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Rate limiting check
    const clientId = `signup_${email || 'unknown'}`;
    if (!authRateLimiter.isAllowed(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    try {
      // Validate all inputs
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        toast({
          title: "Invalid email",
          description: emailValidation.error,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        toast({
          title: "Invalid password",
          description: passwordValidation.error,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const usernameValidation = validateUsername(username);
      if (!usernameValidation.isValid) {
        toast({
          title: "Invalid username",
          description: usernameValidation.error,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const fullNameValidation = validateFullName(fullName);
      if (!fullNameValidation.isValid) {
        toast({
          title: "Invalid full name",
          description: fullNameValidation.error,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Validate referral code if present
      if (referralCode) {
        const referralValidation = validateReferralCode(referralCode);
        if (!referralValidation.isValid) {
          toast({
            title: "Invalid referral code",
            description: referralValidation.error,
            variant: "destructive"
          });
          setLoading(false);
          return;
        }
      }

      // Sanitize inputs
      const sanitizedEmail = sanitizeInput(email);
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedFullName = sanitizeInput(fullName);
      // Use neurodash.space for production, current origin for development
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable');
      const redirectUrl = isProduction ? 'https://neurodash.space/' : `${window.location.origin}/`;
      
      const {
        error
      } = await supabase.auth.signUp({
        email: sanitizedEmail,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: sanitizedFullName,
            username: sanitizedUsername
          }
        }
      });
      if (error) {
        if (error.message.includes("User already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please sign in instead.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign up failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        // If there's a referral code, process it after successful signup
        if (referralCode) {
          try {
            const {
              error: referralError
            } = await supabase.functions.invoke('process-referral', {
              body: {
                referral_code: referralCode,
                user_email: email
              }
            });
            if (!referralError) {
              toast({
                title: "Welcome! 🎉",
                description: "Check your email to complete registration. You'll get 1 week free premium once verified!"
              });
            } else {
              toast({
                title: "Check your email",
                description: "We sent you a confirmation link. Check your email to complete registration."
              });
            }
          } catch {
            toast({
              title: "Check your email",
              description: "We sent you a confirmation link. Check your email to complete registration."
            });
          }
        } else {
          toast({
            title: "Check your email",
            description: "We sent you a confirmation link. Check your email to complete registration."
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Rate limiting check
    const clientId = `signin_${email || 'unknown'}`;
    if (!authRateLimiter.isAllowed(clientId)) {
      toast({
        title: "Too many attempts",
        description: "Please wait before trying again.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    try {
      // Basic email validation
      const emailValidation = validateEmail(email);
      if (!emailValidation.isValid) {
        toast({
          title: "Invalid email",
          description: emailValidation.error,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }
      const sanitizedEmail = sanitizeInput(email);
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password
      });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please check your credentials and try again.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Sign in failed",
            description: error.message,
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully signed in."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    try {
      // Use neurodash.space for production, current origin for development
      const isProduction = window.location.hostname !== 'localhost' && !window.location.hostname.includes('lovable');
      const redirectUrl = isProduction ? 'https://neurodash.space/' : `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl
        }
      });
      
      if (error) {
        toast({
          title: "Google sign in failed",
          description: error.message,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  return <div className="min-h-screen neural-grid bg-black">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <NeuroDashLogo />
            <h1 className="text-2xl font-bold text-gradient mt-4">
              Welcome to NeuroDash
            </h1>
            <p className="text-muted-foreground mt-2">
              Sign in to save and track your cognitive progress
            </p>
            
            {referralCode && <div className="mt-4 p-4 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30">
                <div className="text-gradient text-lg font-semibold">🎉 Special Offer!</div>
                <p className="text-sm text-slate-300 mt-1">
                  You've been invited! Sign up now to get <span className="text-gradient font-bold">1 week free premium</span>
                </p>
              </div>}
            
            <Button variant="ghost" onClick={() => navigate("/")} className="mt-4 text-slate-50 bg-purple-600 hover:bg-purple-500">
              Continue without account
            </Button>
          </div>

          <Card className="card-neural">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Authentication</CardTitle>
              <CardDescription className="text-center">
                Sign in to your account or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-4">
                  {/* Google Sign In Button */}
                  <Button 
                    onClick={handleGoogleAuth} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? "Signing In..." : "Continue with Google"}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black px-2 text-slate-400">Or continue with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <Input id="signin-password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full" variant="neural" disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-4">
                  {/* Google Sign Up Button */}
                  <Button 
                    onClick={handleGoogleAuth} 
                    variant="outline" 
                    className="w-full flex items-center justify-center gap-2 border-slate-600 hover:border-slate-500 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
                    disabled={loading}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {loading ? "Signing Up..." : "Sign up with Google"}
                  </Button>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-600"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-black px-2 text-slate-400">Or sign up with email</span>
                    </div>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-fullname">Full Name</Label>
                      <Input id="signup-fullname" type="text" placeholder="Enter your full name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-username">Username</Label>
                      <Input id="signup-username" type="text" placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
                    </div>
                    <Button type="submit" className="w-full" variant="neural" disabled={loading}>
                      {loading ? "Creating Account..." : "Sign Up"}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>;
};
export default Auth;