
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Upload, MessageSquare } from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const stats = [
  { value: "745,000+", label: "Questions Generated" },
  { value: "85,000+", label: "Students Helped" },
  { value: "92%", label: "Avg. Success Boost" }
];

export const LandingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main gradient background */}
      <div 
        className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-950 via-purple-800 to-blue-600"
        style={{
          backgroundImage: "radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 25%), radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 30%)"
        }}
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="w-full max-w-4xl mx-auto bg-indigo-950/30 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-8 md:p-16 flex flex-col items-center text-white">
            <motion.div 
              className="text-center space-y-6 md:space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                Turn Notes into A+<br />Questions with AI
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Upload documents, paste text, or enter links — GAMA AI handles the rest.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                <Button 
                  size="lg" 
                  className="bg-indigo-900 hover:bg-indigo-800 text-white border border-indigo-700 h-14 px-6 text-lg gap-2"
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
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 h-14 px-6 text-lg gap-2"
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
          <div className="bg-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-3 gap-2 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-lg sm:text-xl md:text-2xl font-bold text-indigo-950">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-indigo-950/70">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
