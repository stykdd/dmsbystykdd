
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const TestHero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">The Smarter Way to Test Knowledge</h1>
          <p className="text-xl mb-8 text-indigo-100">
            Create, share, and take tests with our intuitive platform.
            Get instant feedback and track progress over time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-700 hover:bg-indigo-100"
              onClick={() => navigate("/create")}
            >
              Create a Test
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => navigate("/take")}
            >
              Take a Test
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          className="fill-slate-50"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,42.7C1120,32,1280,32,1360,32L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
        </svg>
      </div>
    </div>
  );
};

export default TestHero;
