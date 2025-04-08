
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen, BrainCircuit, Upload, MessageSquare, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const features = [
  {
    icon: <Upload className="h-10 w-10 mb-2 text-primary" />,
    title: "Upload Study Materials",
    description: "Upload your PDFs, documents, or paste text from your study materials."
  },
  {
    icon: <HelpCircle className="h-10 w-10 mb-2 text-primary" />,
    title: "Generate Custom Questions",
    description: "GAMA AI analyzes your materials and creates targeted practice questions."
  },
  {
    icon: <MessageSquare className="h-10 w-10 mb-2 text-primary" />,
    title: "Interactive Chat",
    description: "Chat with GAMA AI about your study materials to deepen your understanding."
  },
  {
    icon: <BrainCircuit className="h-10 w-10 mb-2 text-primary" />,
    title: "Smart Learning",
    description: "Our AI adapts to your learning style and focuses on what you need to know."
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useSupabaseAuth();

  return (
    <div className="space-y-20 pb-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="gama-gradient-text">Study Smarter</span> with GAMA AI
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                Transform your study materials into interactive Q&A sessions, personalized quizzes, and AI-powered study assistance.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Button className="px-8" size="lg" asChild>
                  <Link to={user ? "/app" : "/auth"}>
                    {user ? "Go to Dashboard" : "Get Started"}
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </motion.div>
            </div>
            <motion.div 
              className="order-first md:order-last"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="gama-card p-6 shadow-xl w-full max-w-md mx-auto">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-6 w-6 gama-gradient-text" />
                      <h3 className="font-semibold text-lg">GAMA AI Assistant</h3>
                    </div>
                    <div className="border rounded-lg p-3 bg-background/50">
                      <p className="text-sm">What are the key concepts in this chapter?</p>
                    </div>
                    <div className="border rounded-lg p-3 ml-4 bg-primary/10">
                      <p className="text-sm">Based on your uploaded materials, the key concepts are:</p>
                      <ul className="text-sm list-disc pl-5 mt-2 space-y-1">
                        <li>Topic one from your document</li>
                        <li>Important concept from your notes</li>
                        <li>Critical element mentioned on page 5</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold gama-gradient-text mb-4">How GAMA AI Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform transforms how you prepare for exams, using your own study materials.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center p-6 gama-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="gama-card p-8 md:p-12 relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-6 gama-gradient-text" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Study Sessions?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of students who are using GAMA AI to study more efficiently and effectively for their exams.
              </p>
              <Button className="px-8 py-6 text-lg" size="lg" asChild>
                <Link to={user ? "/app" : "/auth"}>
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
