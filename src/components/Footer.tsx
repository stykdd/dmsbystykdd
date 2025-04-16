import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border py-4 bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap space-x-4 mb-4 md:mb-0">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms & Conditions
            </Link>
          </div>
          
          <div className="text-sm text-muted-foreground flex items-center">
            Made with <Heart size={16} className="mx-1 text-red-500" fill="#ea384c" /> by <a 
              href="https://stykdd.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline ml-1"
            >
              stykdd
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
