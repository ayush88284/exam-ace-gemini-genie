
import React from "react";
import { Button } from "@/components/ui/button";
import { BookOpen, Github } from "lucide-react";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="rounded-full p-2 examace-gradient-bg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold examace-gradient-text">ExamAce</h1>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Button>
          <Button size="sm" className="examace-gradient-bg gap-2">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
