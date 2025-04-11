
import React from "react";
import { CheckCircle, Clock, FileText, BarChart3 } from "lucide-react";

const features = [
  {
    icon: <FileText className="h-12 w-12 text-indigo-600" />,
    title: "Easy Test Creation",
    description: "Build tests with multiple question types, add images, and customize scoring options."
  },
  {
    icon: <Clock className="h-12 w-12 text-indigo-600" />,
    title: "Time Management",
    description: "Set time limits for entire tests or individual questions to simulate real exam conditions."
  },
  {
    icon: <CheckCircle className="h-12 w-12 text-indigo-600" />,
    title: "Instant Feedback",
    description: "Get immediate results and detailed explanations after completing a test."
  },
  {
    icon: <BarChart3 className="h-12 w-12 text-indigo-600" />,
    title: "Progress Tracking",
    description: "Track performance over time with detailed analytics and improvement suggestions."
  }
];

const FeatureSection = () => {
  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureSection;
