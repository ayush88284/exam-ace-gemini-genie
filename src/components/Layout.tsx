
import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  return (
    <div className={`min-h-screen flex flex-col ${isLight ? 'text-gray-800' : 'text-gray-100'} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="gama-landing-gradient absolute inset-0 -z-10"></div>
      
      {/* Decorative grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background/10 [background:radial-gradient(#9b87f510_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Decorative blurred gradient blobs - only on non-auth pages */}
      <div className="absolute top-0 left-1/4 w-72 h-72 bg-examace-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-examace-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      
      <Header />
      <motion.main 
        className="flex-1 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
};

export default Layout;
