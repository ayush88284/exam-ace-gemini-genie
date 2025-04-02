
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FileSearch } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-radial from-background to-background/80">
      <div className="text-center space-y-6 max-w-md p-8 examace-card">
        <div className="mx-auto w-16 h-16 rounded-full examace-gradient-bg flex items-center justify-center">
          <FileSearch className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold examace-gradient-text">404</h1>
        <p className="text-xl text-foreground mb-4">Oops! Page not found</p>
        <p className="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <a href="/" className="inline-block">
          <Button className="examace-gradient-bg w-full">
            Return to Home
          </Button>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
