
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Moon, Sun, Menu, GraduationCap, User, LogOut, Settings } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const { user, signOut } = useSupabaseAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast.success("Signed out successfully");
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Updated navItems - removed learn more 
  const navItems = [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
  ];

  // Additional nav items for authenticated users
  const authNavItems = [
    { label: "Dashboard", path: "/app" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-between h-16 px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 gama-gradient-text" />
          <span className="font-bold text-xl hidden sm:inline-block gama-gradient-text">
            GAMA AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user && authNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.path)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          {!user && navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive(item.path)
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full"
                  >
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/app")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/auth")}
                className="hidden sm:flex"
              >
                Sign In
              </Button>
              <Button
                onClick={() => {
                  navigate("/auth");
                  setTimeout(() => {
                    const signupTab = document.querySelector('[value="signup"]');
                    if (signupTab instanceof HTMLElement) {
                      signupTab.click();
                    }
                  }, 100);
                }}
                size="sm"
                className="bg-gradient-to-r from-examace-purple to-examace-blue hover:from-examace-purple/90 hover:to-examace-blue/90 hidden sm:flex"
              >
                Sign Up
              </Button>
            </div>
          )}

          {/* Theme toggle simplified to just light/dark */}
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-background/95 backdrop-blur-md border-b"
        >
          <div className="container py-4 space-y-3">
            {!user && navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "block py-2 text-sm font-medium",
                  isActive(item.path)
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <>
                {authNavItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "block py-2 text-sm font-medium",
                      isActive(item.path)
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  to="/profile"
                  className={cn(
                    "block py-2 text-sm font-medium",
                    isActive("/profile")
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <Link
                  to="/settings"
                  className={cn(
                    "block py-2 text-sm font-medium",
                    isActive("/settings")
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
              </>
            )}
            {!user && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                  }}
                  className="w-full"
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    navigate("/auth");
                    setIsMenuOpen(false);
                    setTimeout(() => {
                      const signupTab = document.querySelector(
                        '[value="signup"]'
                      );
                      if (signupTab instanceof HTMLElement) {
                        signupTab.click();
                      }
                    }, 100);
                  }}
                  className="w-full bg-gradient-to-r from-examace-purple to-examace-blue"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
