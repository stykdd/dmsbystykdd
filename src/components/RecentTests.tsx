
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, FileText } from "lucide-react";

const mockTests = [
  {
    id: 1,
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: 15,
    timeLimit: 20,
    participants: 128,
    category: "Programming"
  },
  {
    id: 2,
    title: "World History Trivia",
    description: "Challenge yourself with these world history questions",
    questions: 20,
    timeLimit: 30,
    participants: 85,
    category: "History"
  },
  {
    id: 3,
    title: "Biology 101",
    description: "Review your understanding of basic biology concepts",
    questions: 25,
    timeLimit: 40,
    participants: 210,
    category: "Science"
  }
];

const RecentTests = () => {
  return (
    <div className="py-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">Popular Tests</h2>
        <Button variant="link">View All Tests</Button>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockTests.map((test) => (
          <Card key={test.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{test.title}</CardTitle>
                <Badge variant="outline">{test.category}</Badge>
              </div>
              <CardDescription>{test.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-1" /> 
                  {test.questions} questions
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" /> 
                  {test.timeLimit} min
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" /> 
                  {test.participants}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">Take Test</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RecentTests;
