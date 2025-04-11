
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Upload, MessageSquare, Brain, CheckCircle, Clock, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { motion } from "framer-motion";
import { GamaIcon } from "@/components/GamaIcon";

const LearnMore = () => {
  const { user } = useSupabaseAuth();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6 }
    }
  };
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  const benefits = [
    "Save hours of study time",
    "Focus on what you need to learn",
    "Identify knowledge gaps quickly",
    "Prepare for exams more effectively",
    "Understand difficult concepts better",
    "Study anytime, anywhere"
  ];

  const features = [
    {
      title: "Smart Question Generation",
      description: "Our AI creates customized questions based on your specific study materials, helping you test your understanding and prepare for exams more effectively.",
      icon: <BookOpen className="h-8 w-8" />
    },
    {
      title: "Interactive AI Chat",
      description: "Ask follow-up questions about your materials, get clarification on difficult concepts, and deepen your understanding through conversation with our AI.",
      icon: <MessageSquare className="h-8 w-8" />
    },
    {
      title: "Multiple Content Formats",
      description: "Upload PDFs, documents, or paste text directly. GAMA AI processes a variety of content types to accommodate different study materials.",
      icon: <Upload className="h-8 w-8" />
    },
    {
      title: "Spaced Repetition",
      description: "GAMA AI helps you remember more by intelligently scheduling review sessions based on proven cognitive science principles.",
      icon: <Clock className="h-8 w-8" />
    },
    {
      title: "Personalized Learning",
      description: "The system adapts to your knowledge level, focusing more on areas where you need additional practice.",
      icon: <Sparkles className="h-8 w-8" />
    },
    {
      title: "Instant Feedback",
      description: "Get immediate feedback on your answers to reinforce correct understanding and quickly address misconceptions.",
      icon: <Zap className="h-8 w-8" />
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Animated background elements */}
      <div className="gama-landing-gradient absolute inset-0 -z-10"></div>
      
      {/* Decorative grid background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-background/10 [background:radial-gradient(#9b87f510_1px,transparent_1px)] [background-size:32px_32px]"></div>
      
      {/* Decorative blurred gradient blobs */}
      <div className="absolute top-20 left-0 w-96 h-96 bg-examace-purple/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute bottom-0 right-20 w-96 h-96 bg-examace-blue/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-indigo-400/20 rounded-full mix-blend-multiply filter blur-xl opacity-60 animate-blob animation-delay-4000"></div>
      
      <div className="container mx-auto px-4 py-12 space-y-24 relative z-10">
        {/* Hero Section */}
        <motion.section 
          className="max-w-5xl mx-auto text-center space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <GamaIcon size={60} className="mb-6" />
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold gama-gradient-text">Learn More About GAMA AI</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover how our AI-powered study assistant can transform your learning experience and help you achieve academic success.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button asChild className="gama-button-primary">
              <Link to={user ? "/app" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started Now"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How GAMA AI Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform uses advanced AI to analyze your study materials and create personalized learning experiences.
            </p>
          </div>

          <div className="relative">
            {/* Process Steps */}
            <motion.div 
              className="grid md:grid-cols-3 gap-10 relative z-10"
              variants={container}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {[
                {
                  icon: <Upload className="h-10 w-10 text-examace-purple" />,
                  title: "1. Upload Your Materials",
                  description: "Upload PDFs, documents, or paste text from your study materials."
                },
                {
                  icon: <Brain className="h-10 w-10 text-examace-blue" />,
                  title: "2. AI Analysis",
                  description: "Our AI processes your content to identify key concepts and generate questions."
                },
                {
                  icon: <MessageSquare className="h-10 w-10 text-examace-light-blue" />,
                  title: "3. Interactive Learning",
                  description: "Practice with generated questions and chat with our AI about your materials."
                }
              ].map((step, index) => (
                <motion.div 
                  key={index} 
                  className="glass-card p-6 hover:shadow-md transition-shadow"
                  variants={item}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-4 p-3 rounded-full bg-primary/10">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Decorative elements behind the cards */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-examace-purple to-examace-blue opacity-30 hidden md:block -z-10"></div>
          </div>
        </motion.section>

        {/* Benefits Section */}
        <motion.section 
          className="max-w-5xl mx-auto glass-card p-8 md:p-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Benefits of Using GAMA AI</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform helps students study more effectively and efficiently.
            </p>
          </div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-150px" }}
          >
            {benefits.map((benefit, index) => (
              <motion.div 
                key={index} 
                className="flex items-start gap-3 p-4 bg-background/30 backdrop-blur-md rounded-lg"
                variants={item}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Features Section */}
        <motion.section 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore the powerful features that make GAMA AI your ideal study companion.
            </p>
          </div>

          <motion.div 
            className="space-y-8"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className="flex flex-col md:flex-row gap-6 items-start p-6 glass-card"
                variants={item}
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-primary/10 p-4 rounded-full">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* CTA Section */}
        <motion.section 
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
        >
          <div className="glass-card p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Study Experience?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Join thousands of students who are using GAMA AI to study more efficiently and effectively for their exams.
            </p>
            <Button asChild size="lg" className="gama-button-primary">
              <Link to={user ? "/app" : "/auth"}>
                {user ? "Go to Dashboard" : "Get Started for Free"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default LearnMore;
