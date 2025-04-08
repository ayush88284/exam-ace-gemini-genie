
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Book, Brain, Sparkles, Lightbulb, Target, BarChart } from "lucide-react";

const LearnMore = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="container py-16 px-4 md:px-6 space-y-24">
      {/* Hero Section */}
      <motion.section 
        className="text-center space-y-6"
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
      >
        <div className="inline-block p-2 bg-primary/10 rounded-full mb-4">
          <GraduationCap className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold gama-gradient-text">
          Learn More About GAMA AI
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Revolutionizing the way students prepare for exams with AI-powered study assistance
        </p>
      </motion.section>
      
      {/* What is GAMA AI */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What is GAMA AI?</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div 
            variants={itemVariants}
            className="space-y-4"
          >
            <p className="text-lg">
              <span className="font-bold">GAMA AI</span> is an intelligent study companion designed to help students master their course materials effectively and efficiently.
            </p>
            <p>
              Our platform uses advanced AI technology to analyze your study materials and generate tailored questions and explanations that reinforce your understanding of key concepts.
            </p>
            <p>
              Whether you're preparing for exams, working through assignments, or simply seeking to deepen your comprehension of a subject, GAMA AI provides the tools you need to succeed.
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="overflow-hidden shadow-lg gama-card">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-examace-purple/20 to-examace-blue/20 z-10"></div>
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Student studying with laptop" 
                  className="object-cover w-full h-64"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">AI-Powered Learning</h3>
                <p className="text-muted-foreground">
                  Our advanced algorithms transform passive reading into active learning through intelligent question generation and personalized explanations.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Key Features */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto"></div>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            {
              icon: <Book className="h-8 w-8 text-examace-purple" />,
              title: "Smart Question Generation",
              description: "Turn study materials into effective practice questions that test your understanding."
            },
            {
              icon: <Brain className="h-8 w-8 text-examace-blue" />,
              title: "AI-Powered Explanations",
              description: "Get clear, concise explanations for complex concepts to enhance your comprehension."
            },
            {
              icon: <Sparkles className="h-8 w-8 text-examace-purple" />,
              title: "Interactive Learning",
              description: "Engage with your study material through an interactive question-and-answer format."
            },
            {
              icon: <Lightbulb className="h-8 w-8 text-examace-blue" />,
              title: "Personalized Insights",
              description: "Discover knowledge gaps and focus your study efforts where they're needed most."
            },
            {
              icon: <Target className="h-8 w-8 text-examace-purple" />,
              title: "Exam-Focused Preparation",
              description: "Practice with questions styled after real exams to build confidence and familiarity."
            },
            {
              icon: <BarChart className="h-8 w-8 text-examace-blue" />,
              title: "Progress Tracking",
              description: "Monitor your learning journey and track improvements over time."
            }
          ].map((feature, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full gama-card hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="rounded-full bg-primary/10 p-2 w-fit mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* How It Works - Fixed to be more visible */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto"></div>
        </div>
        
        <motion.div 
          variants={staggerContainer}
          className="grid md:grid-cols-3 gap-12"
        >
          {[
            {
              step: "01",
              title: "Upload Your Material",
              description: "Simply upload your study notes, textbooks, or any learning material in text format."
            },
            {
              step: "02",
              title: "Generate Questions",
              description: "Our AI analyzes your content and creates relevant questions with comprehensive answers."
            },
            {
              step: "03",
              title: "Practice & Learn",
              description: "Test your knowledge, review explanations, and reinforce your understanding."
            }
          ].map((step, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              className="relative"
            >
              {/* Fixed step number visibility by adjusting color and position */}
              <div className="absolute -top-6 -left-4 text-7xl font-bold opacity-80 text-primary/30 z-0">
                {step.step}
              </div>
              <Card className="h-full gama-card relative z-10 pt-6 border-2 border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{step.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* CTA Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="text-center max-w-3xl mx-auto space-y-6"
      >
        <h2 className="text-3xl font-bold">Ready to transform your study routine?</h2>
        <p className="text-xl text-muted-foreground">
          Join thousands of students who are already using GAMA AI to achieve better results with less study time.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-examace-purple to-examace-blue hover:from-examace-purple/90 hover:to-examace-blue/90"
          >
            <Link to="/auth">Get Started</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
          >
            <Link to="/about">Meet Our Team</Link>
          </Button>
        </div>
      </motion.section>
    </div>
  );
};

export default LearnMore;
