
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

type QuestionType = "multiple-choice" | "true-false" | "open-ended";

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string | number;
}

const CreateTest = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "q1",
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    }
  ]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q${questions.length + 1}`,
      type: "multiple-choice",
      text: "",
      options: ["", "", "", ""],
      correctAnswer: 0
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== id));
    } else {
      toast({
        title: "Cannot remove",
        description: "You need at least one question in your test.",
        variant: "destructive"
      });
    }
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map(q => {
        if (q.id === id) {
          if (field === "type") {
            if (value === "multiple-choice") {
              return { ...q, [field]: value, options: ["", "", "", ""], correctAnswer: 0 };
            } else if (value === "true-false") {
              return { ...q, [field]: value, options: ["True", "False"], correctAnswer: 0 };
            } else {
              return { ...q, [field]: value, options: undefined, correctAnswer: "" };
            }
          } else {
            return { ...q, [field]: value };
          }
        }
        return q;
      })
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options) {
          const newOptions = [...q.options];
          newOptions[optionIndex] = value;
          return { ...q, options: newOptions };
        }
        return q;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      toast({
        title: "Missing title",
        description: "Please provide a title for your test.",
        variant: "destructive"
      });
      return;
    }
    
    if (questions.some(q => !q.text.trim())) {
      toast({
        title: "Incomplete questions",
        description: "Please ensure all questions have text.",
        variant: "destructive"
      });
      return;
    }
    
    // Handle form submission (would send to API in real app)
    toast({
      title: "Test created!",
      description: "Your test has been successfully created.",
    });
    
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create a New Test</h1>
        
        <form onSubmit={handleSubmit}>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Test Information</CardTitle>
              <CardDescription>Provide basic details about your test</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Test Title</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="Enter test title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                  placeholder="Describe what this test is about"
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                <Input 
                  id="timeLimit" 
                  type="number" 
                  value={timeLimit} 
                  onChange={e => setTimeLimit(parseInt(e.target.value))} 
                  min={1}
                />
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold mb-4">Questions</h2>
          
          {questions.map((question, index) => (
            <Card key={question.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-xl">Question {index + 1}</CardTitle>
                  <CardDescription>
                    Configure your question and answer options
                  </CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => removeQuestion(question.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select 
                    value={question.type} 
                    onValueChange={(value: any) => updateQuestion(question.id, "type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select question type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple-choice">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="open-ended">Open Ended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Question Text</Label>
                  <Textarea 
                    value={question.text} 
                    onChange={e => updateQuestion(question.id, "text", e.target.value)} 
                    placeholder="Enter your question"
                    rows={2}
                  />
                </div>
                
                {question.type === "multiple-choice" && (
                  <div className="space-y-4">
                    <Label>Answer Options</Label>
                    {question.options?.map((option, optIndex) => (
                      <div key={optIndex} className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name={`correct-${question.id}`} 
                          checked={question.correctAnswer === optIndex} 
                          onChange={() => updateQuestion(question.id, "correctAnswer", optIndex)} 
                          className="w-4 h-4 text-indigo-600"
                        />
                        <Input 
                          value={option} 
                          onChange={e => updateOption(question.id, optIndex, e.target.value)} 
                          placeholder={`Option ${optIndex + 1}`}
                          className="flex-1"
                        />
                      </div>
                    ))}
                  </div>
                )}
                
                {question.type === "true-false" && (
                  <div className="space-y-3">
                    <Label>Correct Answer</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id={`${question.id}-true`} 
                          name={`correct-${question.id}`} 
                          checked={question.correctAnswer === 0} 
                          onChange={() => updateQuestion(question.id, "correctAnswer", 0)} 
                          className="mr-2 w-4 h-4 text-indigo-600"
                        />
                        <Label htmlFor={`${question.id}-true`}>True</Label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id={`${question.id}-false`} 
                          name={`correct-${question.id}`} 
                          checked={question.correctAnswer === 1} 
                          onChange={() => updateQuestion(question.id, "correctAnswer", 1)} 
                          className="mr-2 w-4 h-4 text-indigo-600"
                        />
                        <Label htmlFor={`${question.id}-false`}>False</Label>
                      </div>
                    </div>
                  </div>
                )}
                
                {question.type === "open-ended" && (
                  <div className="space-y-2">
                    <Label>Model Answer (optional)</Label>
                    <Textarea 
                      value={question.correctAnswer as string || ""} 
                      onChange={e => updateQuestion(question.id, "correctAnswer", e.target.value)} 
                      placeholder="Enter a model answer or leave blank"
                      rows={2}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={addQuestion} 
            className="mb-8 w-full py-6 border-dashed border-2 text-gray-500 hover:text-indigo-600 hover:border-indigo-600"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add Question
          </Button>
          
          <div className="flex justify-end gap-4 mb-12">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
              <Save className="mr-2 h-4 w-4" />
              Save Test
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTest;
