
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, ArrowLeft, Clock, Award, FileText, BarChart3 } from "lucide-react";

// Mock result data
const mockTestResult = {
  testId: "t1",
  title: "JavaScript Fundamentals",
  score: 12,
  totalQuestions: 15,
  timeSpent: "18:24",
  timeLimit: "20:00",
  answers: [
    { question: "What is a closure in JavaScript?", isCorrect: true },
    { question: "Which keyword declares a block-scoped variable?", isCorrect: true },
    { question: "What does the '===' operator do?", isCorrect: true },
    { question: "What is the purpose of the 'this' keyword?", isCorrect: false },
    { question: "How do you create a function in JavaScript?", isCorrect: true },
    { question: "What is event bubbling?", isCorrect: true },
    { question: "How do you add an element to the end of an array?", isCorrect: true },
    { question: "What is JSON?", isCorrect: true },
    { question: "What is a promise in JavaScript?", isCorrect: false },
    { question: "What is hoisting?", isCorrect: true },
    { question: "How do you declare a constant in JavaScript?", isCorrect: true },
    { question: "What is the DOM?", isCorrect: true },
    { question: "What does the spread operator do?", isCorrect: true },
    { question: "What is a callback function?", isCorrect: false },
    { question: "How do you handle errors in JavaScript?", isCorrect: true }
  ]
};

const TestResults = () => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<typeof mockTestResult | null>(null);
  
  useEffect(() => {
    // Simulate API request to get test results
    setTimeout(() => {
      setResult(mockTestResult);
      setLoading(false);
    }, 1500);
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <div className="animate-pulse">
            <div className="rounded-lg bg-gray-200 h-8 w-3/4 mx-auto mb-4"></div>
            <div className="rounded-lg bg-gray-200 h-4 w-1/2 mx-auto mb-8"></div>
            <div className="rounded-lg bg-gray-200 h-40 w-full mb-6"></div>
            <div className="rounded-lg bg-gray-200 h-64 w-full"></div>
          </div>
          <p className="text-gray-500 mt-8">Loading your test results...</p>
        </div>
      </div>
    );
  }
  
  if (!result) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-4">Test Not Found</h1>
          <p className="text-gray-500 mb-8">We couldn't find the test results you're looking for.</p>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  const scorePercentage = Math.round((result.score / result.totalQuestions) * 100);
  const correctAnswers = result.answers.filter(a => a.isCorrect).length;
  const incorrectAnswers = result.answers.filter(a => !a.isCorrect).length;
  
  let performance = "Excellent!";
  let performanceColor = "text-green-600";
  
  if (scorePercentage < 60) {
    performance = "Needs Improvement";
    performanceColor = "text-red-600";
  } else if (scorePercentage < 80) {
    performance = "Good";
    performanceColor = "text-yellow-600";
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="outline" className="mb-6" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">{result.title} Results</h1>
          <p className="text-gray-500 mt-2">Test completed successfully</p>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Your Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full">
                <Award className="h-12 w-12 text-indigo-600" />
              </div>
              <div className="mt-4">
                <span className="text-5xl font-bold">{scorePercentage}%</span>
                <p className={`text-xl font-medium mt-2 ${performanceColor}`}>
                  {performance}
                </p>
              </div>
              <p className="text-gray-500 mt-2">
                You scored {result.score} out of {result.totalQuestions} points
              </p>
            </div>
            
            <Progress value={scorePercentage} className="h-3 mb-8" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center mb-2">
                  <Clock className="h-6 w-6 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-500">Time Spent</p>
                <p className="text-lg font-medium">
                  {result.timeSpent} / {result.timeLimit}
                </p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center mb-2">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-lg font-medium">{correctAnswers}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-center mb-2">
                  <XCircle className="h-6 w-6 text-red-500" />
                </div>
                <p className="text-sm text-gray-500">Incorrect Answers</p>
                <p className="text-lg font-medium">{incorrectAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Question Breakdown</CardTitle>
            <CardDescription>Review your performance on each question</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {result.answers.map((answer, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg border flex items-start ${
                    answer.isCorrect ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="mr-3 mt-1">
                    {answer.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">Question {index + 1}</p>
                    <p className="text-gray-700">{answer.question}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex justify-center mt-8 gap-4">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            Download Results
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <BarChart3 className="mr-2 h-4 w-4" />
            View Detailed Analysis
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
