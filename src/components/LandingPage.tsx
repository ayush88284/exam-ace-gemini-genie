
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Upload, 
  MessageSquare, 
  ArrowRight, 
  GraduationCap, 
  BookOpen,
  Star,
  Check,
  FileQuestion,
  Clock,
  Target,
  Brain,
  Zap,
  Trophy,
  Sparkles,
  BarChart3,
  Laptop,
  Lightbulb
} from "lucide-react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { GamaIcon } from "@/components/GamaIcon";
import { useTheme } from "@/components/ThemeProvider";

const stats = [
  { value: "745,000+", label: "Questions Generated" },
  { value: "85,000+", label: "Students Helped" },
  { value: "92%", label: "Avg. Success Boost" }
];

const features = [
  {
    title: "Smart Question Generation",
    description: "Transform any study material into relevant, exam-focused questions in seconds.",
    icon: <FileQuestion className="h-6 w-6 text-indigo-500" />
  },
  {
    title: "Interactive AI Chat",
    description: "Discuss concepts, ask follow-up questions, and deepen your understanding.",
    icon: <MessageSquare className="h-6 w-6 text-indigo-500" />
  },
  {
    title: "Spaced Repetition",
    description: "Review questions at optimal intervals to maximize knowledge retention.",
    icon: <Clock className="h-6 w-6 text-indigo-500" />
  },
  {
    title: "Focus on High-Yield Content",
    description: "AI identifies what's most likely to appear on exams based on your materials.",
    icon: <Target className="h-6 w-6 text-indigo-500" />
  },
  {
    title: "Conceptual Learning",
    description: "Not just facts, but deeper understanding of relationships between concepts.",
    icon: <Brain className="h-6 w-6 text-indigo-500" />
  },
  {
    title: "Rapid Implementation",
    description: "Start generating questions immediately - no lengthy setup required.",
    icon: <Zap className="h-6 w-6 text-indigo-500" />
  }
];

const testimonials = [
  {
    quote: "GAMA AI transformed my study routine. I went from passively reading to actively engaging with my material through questions - and my grades show it!",
    name: "Jamie Chen",
    role: "Medical Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
  },
  {
    quote: "I upload my lecture notes and GAMA generates the perfect practice questions. It's like having a tutor who knows exactly what I need to review.",
    name: "Michael Rodriguez",
    role: "Law Student",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop"
  },
  {
    quote: "As a teacher, GAMA helps me create assessments in minutes instead of hours. The AI understands curriculum content and generates relevant questions instantly.",
    name: "Sarah Johnson",
    role: "High School Teacher",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop"
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for occasional studying",
    features: [
      "10 question generations per month",
      "Basic chat with your materials",
      "PDF and text uploads",
      "Standard response quality"
    ],
    cta: "Start Free",
    highlight: false
  },
  {
    name: "Student Pro",
    price: "$12",
    period: "/month",
    description: "Everything you need for serious students",
    features: [
      "Unlimited question generations",
      "Advanced AI chat assistance",
      "All file formats supported",
      "High-quality, detailed responses",
      "Bookmarking and organization",
      "Spaced repetition system"
    ],
    cta: "Go Pro",
    highlight: true
  },
  {
    name: "Educator",
    price: "$29",
    period: "/month",
    description: "For teachers and institutions",
    features: [
      "All Student Pro features",
      "Create classroom question sets",
      "Export to various formats",
      "Student progress tracking",
      "Customizable difficulty levels",
      "Priority support"
    ],
    cta: "Get Educator",
    highlight: false
  }
];

const faqItems = [
  {
    question: "What kinds of documents can I upload to GAMA AI?",
    answer: "GAMA AI supports a wide range of formats including PDF, DOCX, PPTX, and TXT files. You can also simply paste text or share a URL, and our system will extract the relevant content."
  },
  {
    question: "How accurate are the generated questions?",
    answer: "Our AI is trained to generate highly relevant questions based on your study material. The quality depends on the clarity and structure of your uploaded content, but our system continuously improves through machine learning."
  },
  {
    question: "Can I use GAMA AI for any subject?",
    answer: "Yes! GAMA AI is subject-agnostic and works with materials from any field of study - from medicine and law to engineering, humanities, and more."
  },
  {
    question: "Is my data secure with GAMA AI?",
    answer: "Absolutely. We take data privacy very seriously. Your uploaded documents are encrypted, never shared with third parties, and you can delete them from our servers at any time."
  },
  {
    question: "How does the AI chat feature work?",
    answer: "Once you've uploaded a document or provided content, our AI can engage in a chat conversation about that material. It will answer questions, explain concepts, and help deepen your understanding based on the context you've provided."
  },
  {
    question: "What makes GAMA AI different from just using ChatGPT?",
    answer: "GAMA AI is specifically optimized for educational content and exam preparation. We've fine-tuned our models to generate high-quality questions with accurate answers, properly formatted explanations, and learning-focused interactions."
  }
];

export const LandingPage: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { theme } = useTheme();
  const isLight = theme === "light";
  
  // For FAQ functionality
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated background with gradient and blur effects */}
      <div className="absolute inset-0 -z-10 gama-landing-gradient overflow-hidden">
        {/* Animated blob decorations */}
        <div className="absolute top-1/4 -left-10 w-72 h-72 bg-purple-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute bottom-1/4 -right-10 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#4F46E510_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-20">
        <motion.div 
          className="w-full max-w-5xl mx-auto gama-card shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="p-8 md:p-16 flex flex-col items-center">
            <motion.div 
              className="flex items-center gap-3 mb-10"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <GamaIcon size={56} />
              <h2 className="text-3xl font-bold gama-gradient-text">GAMA AI</h2>
            </motion.div>
            
            <motion.div 
              className="text-center space-y-6 md:space-y-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 gama-gradient-text leading-tight">
                Turn Notes into A+<br />Questions with AI
              </h1>
              
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Upload documents, paste text, or enter links — GAMA AI handles the rest. 
                Transform any study material into focused questions for better learning.
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
                  className="gama-button-secondary h-14 px-8 text-lg gap-2 rounded-xl"
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
      
      {/* Features Section */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              Features That Transform Your Study Habits
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Stop memorizing. Start understanding. GAMA AI helps you engage with your materials
              in ways that improve both comprehension and retention.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-card"
                variants={itemVariants}
              >
                <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900/30 mb-2">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-background to-muted/50">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              How GAMA AI Works
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              A simple three-step process that transforms how you prepare for exams
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connect steps with line (visible on md and up) */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 z-0 opacity-50"></div>
            
            <motion.div 
              className="relative z-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6">1</div>
              <h3 className="text-xl font-semibold mb-3">Upload Your Materials</h3>
              <p className="text-muted-foreground">
                Simply upload your notes, textbooks, or lecture slides in any format. 
                You can also paste text or provide a URL to an article.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative z-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6">2</div>
              <h3 className="text-xl font-semibold mb-3">AI Generates Questions</h3>
              <p className="text-muted-foreground">
                Our advanced AI analyzes your materials and generates targeted questions
                focused on the most important concepts.
              </p>
            </motion.div>
            
            <motion.div 
              className="relative z-10 flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold mb-6">3</div>
              <h3 className="text-xl font-semibold mb-3">Study Smarter</h3>
              <p className="text-muted-foreground">
                Practice with the generated questions, chat with the AI about your material,
                and strengthen your understanding through active learning.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              What Students & Educators Say
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Join thousands of learners who have transformed their study experience with GAMA AI
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                className="testimonial-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-muted/50 to-background">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Choose the plan that fits your study needs
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <motion.div 
                key={index}
                className={`pricing-card ${plan.highlight ? 'pricing-card-highlight' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-indigo-600 text-white text-sm font-medium px-4 py-1 rounded-full">Most Popular</span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
                <p className="text-muted-foreground mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : ''}`}
                  variant={plan.highlight ? "default" : "outline"}
                  asChild
                >
                  <Link to="/auth">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-12 text-sm text-muted-foreground">
            All plans include a 7-day free trial. No credit card required.
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              Frequently Asked Questions
            </h2>
            <p className="text-lg max-w-3xl mx-auto">
              Everything you need to know about GAMA AI
            </p>
          </motion.div>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <motion.div 
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <button
                  className="flex justify-between items-center w-full text-left font-medium"
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                >
                  <span>{item.question}</span>
                  <span className="transform transition-transform duration-200">
                    {activeFaq === index ? '−' : '+'}
                  </span>
                </button>
                {activeFaq === index && (
                  <motion.div 
                    className="mt-4 text-muted-foreground"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.answer}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div 
          className="max-w-5xl mx-auto gama-card overflow-hidden relative"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-indigo-500/30 to-purple-500/30 opacity-80"></div>
          
          <div className="p-12 md:p-16 text-center">
            <GamaIcon size={60} className="mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4 gama-gradient-text">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students already using GAMA AI to prepare smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-8 text-lg rounded-xl"
                asChild
              >
                <Link to={user ? "/app" : "/auth"}>
                  Get Started Free
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gama-button-secondary h-14 px-8 text-lg rounded-xl"
                asChild
              >
                <Link to="/learn-more">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};
