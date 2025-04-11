
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, Home, User } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">TestBuddy</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
              Home
            </Link>
            <Link to="/create" className="px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
              Create Test
            </Link>
            <Link to="/take" className="px-3 py-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-50">
              Take Test
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:inline-flex">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
            <Button size="sm" className="hidden md:inline-flex bg-indigo-600 hover:bg-indigo-700">
              Sign Up
            </Button>
            
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
