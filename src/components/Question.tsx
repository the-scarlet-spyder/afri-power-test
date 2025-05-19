
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

interface QuestionProps {
  question: {
    id: string;
    text: string;
    strengthId: string;
  };
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelect: (option: number) => void;
}

const Question = ({ question, questionNumber, totalQuestions, selectedOption, onSelect }: QuestionProps) => {
  const progress = (questionNumber / totalQuestions) * 100;
  
  return (
    <Card className="shadow-lg border-none">
      <CardContent className="pt-6">
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Question {questionNumber} of {totalQuestions}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>
        
        <div className="mb-8 pt-2">
          <h2 className="text-xl font-medium mb-10 text-inuka-charcoal text-center font-poppins">
            {question.text}
          </h2>
          
          <div className="space-y-6 px-4 py-4">
            <RadioGroup 
              value={selectedOption !== undefined ? selectedOption.toString() : undefined} 
              onValueChange={(value) => onSelect(parseInt(value))}
              className="mt-8"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="r1" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                <Label htmlFor="r1" className="cursor-pointer">Totally disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="r2" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                <Label htmlFor="r2" className="cursor-pointer">Disagree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="r3" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                <Label htmlFor="r3" className="cursor-pointer">Neutral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="r4" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                <Label htmlFor="r4" className="cursor-pointer">Agree</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="r5" className="peer h-5 w-5 border border-gray-300 text-inuka-crimson focus:ring-0 focus:ring-offset-0" />
                <Label htmlFor="r5" className="cursor-pointer">Totally agree</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Question;
