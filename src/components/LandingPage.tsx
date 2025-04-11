
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, MessageSquare, ArrowRight, GraduationCap } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { GamaIcon } from "@/components/GamaIcon";

const stats = [
  { value: "745,000+", label: "Questions Generated" },
  { value: "85,000+", label: "Students Helped" },
  { value: "92%", label: "Avg. Success Boost" }
];

export const LandingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Animated background with gradient and blur effects */}
      <div className="absolute inset-0 -z-10 gama-landing-gradient overflow-hidden">
        {/* Animated blob decorations */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      {/* Main content */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div 
          className="w-full max-w-4xl mx-auto gama-card shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="p-8 md:p-16 flex flex-col items-center text-white">
            <motion.div 
              className="flex items-center gap-3 mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GamaIcon size={48} />
              <h2 className="text-3xl font-bold text-white">GAMA AI</h2>
            </motion.div>
            
            <motion.div 
              className="text-center space-y-6 md:space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
                Turn Notes into A+<br />Questions with AI
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Upload documents, paste text, or enter links — GAMA AI handles the rest.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white border border-indigo-500 h-14 px-8 text-lg gap-2 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40"
                  asChild
                >
                  <Link to={user ? "/app" : "/auth"}>
                    <Upload className="h-5 w-5" />
                    Upload Study Material
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 h-14 px-8 text-lg gap-2 rounded-xl transition-all"
                  asChild
                >
                  <Link to={user ? "/app" : "/auth"}>
                    <MessageSquare className="h-5 w-5" />
                    Chat with Notes or Links
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
          
          {/* Stats bar */}
          <div className="bg-gradient-to-r from-indigo-950 to-blue-900 py-8 px-4 border-t border-white/10">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-4 text-center">
                {stats.map((stat, index) => (
                  <motion.div 
                    key={index} 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  >
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-blue-200/80">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Feature highlight */}
          <motion.div 
            className="p-6 bg-gradient-to-r from-purple-900/50 to-indigo-900/50 text-center border-t border-white/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Link to="/learn-more" className="flex items-center justify-center gap-2 text-blue-200 hover:text-white transition-colors group">
              <span>Learn how GAMA AI boosts your exam preparation</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
