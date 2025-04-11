
import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/components/ThemeProvider";

interface GamaIconProps {
  size?: number;
  className?: string;
}

export const GamaIcon: React.FC<GamaIconProps> = ({ size = 40, className = "" }) => {
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
    hover: { 
      scale: 1.05,
      rotate: 5,
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      variants={variants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      {/* Main logo shape - brain/graduation cap hybrid */}
      <motion.div 
        className={`absolute inset-0 rounded-sm ${
          isLight 
            ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600" 
            : "bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500"
        }`}
        style={{ 
          clipPath: "polygon(50% 0%, 65% 25%, 98% 35%, 75% 55%, 85% 90%, 50% 75%, 15% 90%, 25% 55%, 2% 35%, 35% 25%)",
        }}
      />
      
      {/* Glowing effect */}
      <div 
        className={`absolute inset-0 blur-sm -z-10 opacity-70 ${
          isLight ? "bg-indigo-500" : "bg-indigo-400"
        }`}
        style={{ 
          clipPath: "polygon(50% 0%, 65% 25%, 98% 35%, 75% 55%, 85% 90%, 50% 75%, 15% 90%, 25% 55%, 2% 35%, 35% 25%)",
        }}
      />
      
      {/* Center dot */}
      <div className={`absolute rounded-full ${isLight ? "bg-white" : "bg-white/90"} shadow-sm h-[20%] w-[20%] left-[40%] top-[40%]`}></div>
    </motion.div>
  );
};
