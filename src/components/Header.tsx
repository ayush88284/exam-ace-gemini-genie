
import React from "react";
import { ThemeToggle } from "./ThemeProvider";
import { GraduationCap, LogIn, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

const Header: React.FC = () => {
  const { user, signOut } = useSupabaseAuth();
  const location = useLocation();

  return (
    <header className="border-b py-4 w-full bg-background/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            whileHover={{ rotate: 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <GraduationCap className="h-7 w-7 gama-gradient-text" />
          </motion.div>
          <span className="font-bold text-xl gama-gradient-text">GAMA AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex items-center gap-6 mr-4">
            <Link to="/" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}>
              Home
            </Link>
            {user && (
              <Link to="/app" className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/app' ? 'text-primary' : 'text-muted-foreground'}`}>
                Dashboard
              </Link>
            )}
          </nav>
          
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-muted-foreground">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/app">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden md:flex">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="hidden md:flex">
                <Link to="/auth?tab=signup">Sign Up</Link>
              </Button>
              <Button asChild variant="outline" className="md:hidden flex items-center gap-2">
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
