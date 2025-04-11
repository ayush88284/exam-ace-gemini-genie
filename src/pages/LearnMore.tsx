
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Upload, MessageSquare, Brain, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

const LearnMore = () => {
  const { user } = useSupabaseAuth();

  return (
    <div className="container mx-auto px-4 py-12 space-y-24">
      {/* Hero Section */}
      <section className="max-w-5xl mx-auto text-center space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold gama-gradient-text">Learn More About GAMA AI</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover how our AI-powered study assistant can transform your learning experience and help you achieve academic success.
        </p>
        <div className="flex flex-wrap justify-center gap-4 pt-6">
          <Button asChild className="bg-gradient-to-r from-examace-purple to-examace-blue">
            <Link to={user ? "/app" : "/auth"}>
              {user ? "Go to Dashboard" : "Get Started Now"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How GAMA AI Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform uses advanced AI to analyze your study materials and create personalized learning experiences.
          </p>
        </div>

        <div className="relative">
          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-10 relative z-10">
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
              <div 
                key={index} 
                className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Decorative elements behind the cards */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-examace-purple to-examace-blue opacity-30 hidden md:block -z-10"></div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-5xl mx-auto bg-muted/30 rounded-2xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Benefits of Using GAMA AI</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our platform helps students study more effectively and efficiently.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Save hours of study time",
            "Focus on what you need to learn",
            "Identify knowledge gaps quickly",
            "Prepare for exams more effectively",
            "Understand difficult concepts better",
            "Study anytime, anywhere"
          ].map((benefit, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 p-4 bg-background/80 rounded-lg"
            >
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Key Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore the powerful features that make GAMA AI your ideal study companion.
          </p>
        </div>

        <div className="space-y-8">
          {[
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
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="flex flex-col md:flex-row gap-6 items-start p-6 border rounded-xl"
            >
              <div className="bg-primary/10 p-4 rounded-full">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-5xl mx-auto">
        <div className="bg-gradient-to-r from-examace-purple/10 to-examace-blue/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Study Experience?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of students who are using GAMA AI to study more efficiently and effectively for their exams.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-examace-purple to-examace-blue">
            <Link to={user ? "/app" : "/auth"}>
              {user ? "Go to Dashboard" : "Get Started for Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LearnMore;
