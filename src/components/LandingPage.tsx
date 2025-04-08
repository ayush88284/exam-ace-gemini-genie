
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  BookOpen, 
  BrainCircuit, 
  Upload, 
  MessageSquare, 
  HelpCircle, 
  ArrowRight,
  CheckCircle
} from "lucide-react";
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

const benefits = [
  "Save hours of study time",
  "Focus on what you need to learn",
  "Identify knowledge gaps quickly",
  "Prepare for exams more effectively",
  "Understand difficult concepts better",
  "Study anytime, anywhere"
];

export const LandingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-24 pb-16">
      {/* Decorative grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background [background:radial-gradient(#9b87f510_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-32">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div 
              className="space-y-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
                variants={itemVariants}
              >
                <span className="gama-gradient-text">Study Smarter</span> with GAMA AI
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground"
                variants={itemVariants}
              >
                Transform your study materials into interactive Q&A sessions, personalized quizzes, and AI-powered study assistance. Learn faster and more effectively.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                variants={itemVariants}
              >
                <Button className="px-8 group" size="lg" asChild>
                  <Link to={user ? "/app" : "/auth"}>
                    {user ? "Go to Dashboard" : "Get Started"}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="order-first md:order-last"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-examace-purple to-examace-blue opacity-75 blur"></div>
                <div className="gama-card p-6 shadow-xl w-full max-w-md mx-auto relative">
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
                    <div className="border rounded-lg p-3 bg-background/50">
                      <p className="text-sm">Can you create questions about topic two?</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative blurred gradient */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-examace-purple/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-examace-blue/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-20 w-72 h-72 bg-examace-light-blue/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Use GAMA AI?</h2>
            <p className="text-lg text-muted-foreground">
              Our platform helps you study more effectively and efficiently.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-3 p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                <p className="font-medium">{benefit}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/50">
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
                className="flex flex-col items-center text-center p-6 gama-card h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                {feature.icon}
                <h3 className="text-xl font-semibold mt-2">{feature.title}</h3>
                <p className="text-muted-foreground mt-2">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Step-by-Step Guide</h2>
              <p className="text-lg text-muted-foreground">
                Getting started with GAMA AI is quick and easy.
              </p>
            </div>
            
            <div className="space-y-12">
              {[
                {
                  step: "01",
                  title: "Upload Your Study Materials",
                  description: "Upload PDFs, Word documents, or paste text directly from your textbooks, notes, or lecture slides."
                },
                {
                  step: "02",
                  title: "Generate Custom Q&A",
                  description: "GAMA AI processes your materials and creates tailored practice questions based on the content."
                },
                {
                  step: "03",
                  title: "Interactive Learning",
                  description: "Practice with the generated questions or chat with GAMA AI to deepen your understanding of the material."
                },
                {
                  step: "04",
                  title: "Track Your Progress",
                  description: "Focus on areas that need improvement and generate new questions to solidify your knowledge."
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex gap-6 items-start"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-semibold">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="gama-card p-8 md:p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 z-0"></div>
            <div className="relative z-10 max-w-3xl mx-auto text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-6 gama-gradient-text" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Study Sessions?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands of students who are using GAMA AI to study more efficiently and effectively for their exams.
              </p>
              <Button className="px-8 py-6 text-lg group" size="lg" asChild>
                <Link to={user ? "/app" : "/auth"}>
                  {user ? "Go to Dashboard" : "Get Started for Free"}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
