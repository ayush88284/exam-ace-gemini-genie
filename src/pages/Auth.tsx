
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { GraduationCap, Mail, Lock, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { GamaIcon } from "@/components/GamaIcon";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot 
} from "@/components/ui/input-otp";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const [showOTPVerification, setShowOTPVerification] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const { signIn, signUp, user, verifyOTP } = useSupabaseAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await signIn(email, password);
      
      if (!success) {
        throw new Error("Sign in failed");
      }
      
      toast({
        title: "Successfully signed in!",
        description: "Redirecting to your dashboard...",
      });
      
      navigate("/app");
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!name.trim()) {
        throw new Error("Please enter your name");
      }
      
      const success = await signUp(email, password);
      
      if (!success) {
        throw new Error("Sign up failed");
      }
      
      setShowOTPVerification(true);
      
      toast({
        title: "Verification code sent!",
        description: "Please check your email for the OTP code.",
      });
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive",
      });
      setShowOTPVerification(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!otp || otp.length !== 6) {
        throw new Error("Please enter a valid 6-digit code");
      }
      
      const success = await verifyOTP(email, otp);
      
      if (!success) {
        throw new Error("Invalid verification code");
      }
      
      toast({
        title: "Email verified successfully!",
        description: "You can now sign in with your credentials.",
      });
      
      setShowOTPVerification(false);
      setActiveTab("signin");
    } catch (error: any) {
      setOtpError(error.message || "Verification failed. Please try again.");
      toast({
        title: "Verification failed",
        description: error.message || "Please check the code and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="gama-landing-gradient absolute inset-0 -z-10"></div>
      
      {/* Decorative grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background/10 [background:radial-gradient(#9b87f510_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Decorative blurred gradient blobs */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-examace-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-examace-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      
      <motion.div 
        className="w-full max-w-md z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-10">
          <motion.div 
            className="flex flex-col items-center gap-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GamaIcon size={50} />
            <h1 className="text-3xl font-bold gama-gradient-text">GAMA AI</h1>
          </motion.div>
        </div>
        
        <Card className="gama-card overflow-hidden border-white/10 dark:border-white/5 shadow-xl">
          <CardContent className="pt-6">
            {showOTPVerification ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 py-4"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Email Verification</h2>
                  <p className="text-sm text-muted-foreground">
                    We've sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                
                <form onSubmit={handleVerifyOTP} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="otp" className="text-center block">Verification Code</Label>
                    <div className="flex justify-center">
                      <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                    {otpError && <p className="text-destructive text-sm text-center">{otpError}</p>}
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full gama-button-primary"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      variant="link" 
                      type="button"
                      onClick={() => {
                        setShowOTPVerification(false);
                        setActiveTab("signin");
                      }}
                      className="text-sm text-muted-foreground"
                    >
                      Back to Sign In
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin">
                  <motion.form 
                    onSubmit={handleSignIn}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="signin-email" className="mb-2 block">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 gama-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="signin-password" className="mb-2 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signin-password"
                          type="password"
                          placeholder="Enter your password"
                          className="pl-10 gama-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full gama-button-primary flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? "Signing in..." : "Sign In"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>
                
                <TabsContent value="signup">
                  <motion.form 
                    onSubmit={handleSignUp}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-6"
                  >
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="signup-name" className="mb-2 block">
                        Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="Enter your name"
                          className="pl-10 gama-input"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="signup-email" className="mb-2 block">
                        Email
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="Enter your email"
                          className="pl-10 gama-input"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Label htmlFor="signup-password" className="mb-2 block">
                        Password
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="Create a password"
                          className="pl-10 gama-input"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <Button 
                        type="submit" 
                        className="w-full gama-button-primary flex items-center justify-center gap-2"
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </motion.form>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
        
        <motion.p 
          className="mt-8 text-center text-sm text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          GAMA AI - Your Intelligent Study Companion
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Auth;
