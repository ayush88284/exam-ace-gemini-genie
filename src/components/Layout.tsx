
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
    <div className={`min-h-screen flex flex-col ${isLight ? 'text-gray-800' : 'text-gray-100'}`}>
      <Header />
      <motion.main 
        className="flex-1"
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
