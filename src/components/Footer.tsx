
import React from "react";
import { BookOpen } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-8 mt-12">
      <div className="container">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full p-2 examace-gradient-bg">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold examace-gradient-text">ExamAce</h2>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            AI-powered study assistant for exam preparation
          </p>
          <div className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} ExamAce. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
