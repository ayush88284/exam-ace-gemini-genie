
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { GraduationCap, Github, Linkedin, Twitter, Mail } from "lucide-react";

const AboutUs = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const teamVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const memberVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };
  
  const founders = [
    {
      name: "Gouri",
      role: "AI Research Lead",
      bio: "Expert in machine learning and natural language processing, focused on creating intelligent educational tools that adapt to student needs.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=500&auto=format&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Aneri",
      role: "Product Design Lead",
      bio: "Passionate about creating intuitive user experiences that make learning more accessible and enjoyable for students worldwide.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500&auto=format&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Meet",
      role: "Chief Technology Officer",
      bio: "Full-stack developer with expertise in creating scalable educational platforms. Dedicated to building robust systems that enable seamless learning.",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500&auto=format&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    },
    {
      name: "Ayush",
      role: "Education Strategy Lead",
      bio: "Former educator with a deep understanding of learning methodologies. Works to ensure GAMA AI truly enhances the educational experience.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500&auto=format&fit=crop",
      social: {
        twitter: "#",
        linkedin: "#",
        github: "#"
      }
    }
  ];

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
          Meet Our Team
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          The passionate minds behind GAMA AI, working together to revolutionize education
        </p>
      </motion.section>
      
      {/* Our Story */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-4">
            <p className="text-lg">
              GAMA AI was born from a shared experience that many students face: the challenge of efficiently preparing for exams with mountains of study material.
            </p>
            <p>
              Our founders, Gouri, Aneri, Meet, and Ayush, met during a hackathon focused on educational technology. They quickly discovered their shared passion for using AI to solve real-world educational challenges.
            </p>
            <p>
              What began as a prototype has evolved into a comprehensive learning platform that helps students transform passive reading into active learning through intelligent question generation and personalized explanations.
            </p>
            <p>
              Today, GAMA AI continues to grow, guided by our mission to make quality education more accessible and effective for learners everywhere.
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-examace-purple/20 to-examace-blue/20 rounded-xl blur-xl"></div>
            <Card className="overflow-hidden shadow-lg gama-card relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                alt="Team working together" 
                className="object-cover w-full h-72"
              />
            </Card>
          </div>
        </div>
      </motion.section>
      
      {/* Founders Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-12"
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Founders</h2>
          <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto"></div>
        </div>
        
        <motion.div 
          variants={teamVariants}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {founders.map((founder, index) => (
            <motion.div 
              key={index}
              variants={memberVariants}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="overflow-hidden gama-card h-full">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={founder.image} 
                    alt={founder.name} 
                    className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{founder.name}</h3>
                    <p className="text-sm text-primary">{founder.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm">{founder.bio}</p>
                  <div className="flex space-x-3 pt-2">
                    <a href={founder.social.twitter} className="text-muted-foreground hover:text-primary transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                    <a href={founder.social.linkedin} className="text-muted-foreground hover:text-primary transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={founder.social.github} className="text-muted-foreground hover:text-primary transition-colors">
                      <Github className="h-4 w-4" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.section>
      
      {/* Mission Section */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={sectionVariants}
        className="space-y-6 max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl font-bold">Our Mission</h2>
        <p className="text-xl text-muted-foreground">
          To empower learners worldwide by transforming passive study materials into active learning experiences through accessible AI technology.
        </p>
        <div className="h-1 w-20 bg-gradient-to-r from-examace-purple to-examace-blue mx-auto my-8"></div>
      </motion.section>
      
      {/* Contact CTA */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Get In Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have questions or feedback? We'd love to hear from you!
        </p>
        <Button
          className="bg-gradient-to-r from-examace-purple to-examace-blue hover:from-examace-purple/90 hover:to-examace-blue/90"
        >
          <Mail className="mr-2 h-4 w-4" />
          Contact Us
        </Button>
      </motion.section>
    </div>
  );
};

export default AboutUs;
