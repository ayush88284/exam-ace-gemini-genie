
import React from "react";
import { BookOpen, GraduationCap, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-12 border-t">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 gama-gradient-text" />
              <h2 className="text-xl font-bold gama-gradient-text">GAMA AI</h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI-powered study assistant that transforms your materials into interactive questions and personalized learning.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/app" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Questions or feedback? Reach out to our team.
            </p>
            <Link to="/" className="text-sm text-primary hover:underline">
              support@gama-ai.com
            </Link>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} GAMA AI. All rights reserved.
          </p>
          <motion.div 
            className="flex items-center gap-1 text-xs text-muted-foreground"
            whileHover={{ scale: 1.05 }}
          >
            Made with <Heart className="h-3 w-3 text-red-500" /> by GAMA AI Team
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
