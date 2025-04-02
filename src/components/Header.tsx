
import React from "react";
import { ThemeToggle } from "./ThemeProvider";
import { GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header className="border-b py-4 w-full">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-7 w-7 examace-gradient-text" />
          <span className="font-bold text-xl examace-gradient-text">GAMA AI</span>
        </Link>
        
        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};

export default Header;
