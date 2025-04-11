
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import TestHero from "@/components/TestHero";
import FeatureSection from "@/components/FeatureSection";
import RecentTests from "@/components/RecentTests";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <TestHero />
      
      <div className="container mx-auto px-4 py-12">
        <FeatureSection />
        
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-12">Get Started Now</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Create a Test</CardTitle>
                <CardDescription>
                  Design your own custom test with multiple question types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Build tests with multiple-choice, true/false, or open-ended questions. Add images,
                  set time limits, and customize scoring.
                </p>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => navigate("/create")}>
                  Create Test
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle>Take a Test</CardTitle>
                <CardDescription>
                  Browse available tests or enter a test code
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Take tests shared with you, get instant feedback, and review your results. Track your
                  progress over time.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate("/take")}>
                  Take Test
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
        
        <RecentTests />
      </div>
    </div>
  );
};

export default Index;
