
import React from "react";
import { motion } from "framer-motion";

interface GamaIconProps {
  size?: number;
  className?: string;
}

export const GamaIcon: React.FC<GamaIconProps> = ({ size = 40, className = "" }) => {
  const variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
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
      {/* Main star shape */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-sm"
        style={{ 
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
      />
      
      {/* Glowing effect */}
      <div 
        className="absolute inset-0 blur-sm bg-indigo-400 -z-10 opacity-50"
        style={{ 
          clipPath: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
        }}
      />
    </motion.div>
  );
};
