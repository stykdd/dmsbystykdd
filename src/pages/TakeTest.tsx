
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Clock, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const mockAvailableTests = [
  {
    id: "t1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    questions: 15,
    timeLimit: 20,
    difficulty: "Intermediate"
  },
  {
    id: "t2",
    title: "World History Trivia",
    description: "Challenge yourself with these world history questions",
    questions: 20,
    timeLimit: 30,
    difficulty: "Easy"
  },
  {
    id: "t3",
    title: "Biology 101",
    description: "Review your understanding of basic biology concepts",
    questions: 25,
    timeLimit: 40,
    difficulty: "Intermediate"
  },
  {
    id: "t4",
    title: "Advanced Chemistry",
    description: "Test your knowledge of chemical reactions and bonds",
    questions: 30,
    timeLimit: 45,
    difficulty: "Hard"
  },
  {
    id: "t5",
    title: "Literature Classics",
    description: "How well do you know the world's greatest literary works?",
    questions: 22,
    timeLimit: 35,
    difficulty: "Intermediate"
  }
];

const TakeTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [testCode, setTestCode] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredTests = mockAvailableTests.filter(
    test => test.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEnterCode = () => {
    if (!testCode.trim()) {
      toast({
        title: "Missing test code",
        description: "Please enter a valid test code",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would validate the code with an API
    toast({
      title: "Starting test",
      description: "Preparing your test environment...",
    });
    
    setTimeout(() => {
      navigate(`/results/${testCode}`);
    }, 1500);
  };

  const handleStartTest = (testId: string) => {
    toast({
      title: "Starting test",
      description: "Preparing your test environment...",
    });
    
    setTimeout(() => {
      navigate(`/results/${testId}`);
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Take a Test</h1>
        
        <Tabs defaultValue="browse">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse">Browse Tests</TabsTrigger>
            <TabsTrigger value="code">Enter Test Code</TabsTrigger>
          </TabsList>
          
          <TabsContent value="browse">
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search tests..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            {filteredTests.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-600">No tests found</h3>
                <p className="text-gray-500 mt-2">Try a different search term</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTests.map(test => (
                  <Card key={test.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-1" /> 
                          {test.questions} questions
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" /> 
                          {test.timeLimit} min
                        </div>
                        <div>
                          Difficulty: <span className="font-medium">{test.difficulty}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={() => handleStartTest(test.id)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700"
                      >
                        Start Test
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="code">
            <Card>
              <CardHeader>
                <CardTitle>Enter Test Code</CardTitle>
                <CardDescription>
                  Input the test code provided by your instructor or test creator
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Input
                    placeholder="Enter test code (e.g., XYZ123)"
                    value={testCode}
                    onChange={e => setTestCode(e.target.value)}
                    className="text-center text-lg py-6"
                  />
                  <Button 
                    onClick={handleEnterCode} 
                    className="w-full bg-indigo-600 hover:bg-indigo-700"
                  >
                    Enter Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TakeTest;
