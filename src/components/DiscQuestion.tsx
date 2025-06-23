
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { DiscQuestion as DiscQuestionType } from '@/data/disc';

interface DiscQuestionProps {
  question: DiscQuestionType;
  onResponse: (questionId: string, scoreA: number, scoreB: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const DiscQuestion: React.FC<DiscQuestionProps> = ({ 
  question, 
  onResponse, 
  questionNumber,
  totalQuestions 
}) => {
  const [scoreA, setScoreA] = useState<number>(3);
  const [scoreB, setScoreB] = useState<number>(3);

  const handleScoreChange = (statement: 'A' | 'B', score: number) => {
    if (statement === 'A') {
      setScoreA(score);
      onResponse(question.id, score, scoreB);
    } else {
      setScoreB(score);
      onResponse(question.id, scoreA, score);
    }
  };

  const ScaleComponent = ({ 
    statement, 
    value, 
    onChange 
  }: { 
    statement: 'A' | 'B'; 
    value: number; 
    onChange: (score: number) => void;
  }) => (
    <div className="space-y-4">
      <RadioGroup
        className="grid grid-cols-5 gap-2"
        value={value.toString()}
        onValueChange={(val) => onChange(parseInt(val))}
      >
        {[1, 2, 3, 4, 5].map((score) => (
          <div key={score} className="flex flex-col items-center space-y-1.5">
            <RadioGroupItem value={score.toString()} id={`${statement}-${score}`} />
            <Label 
              htmlFor={`${statement}-${score}`} 
              className="text-xs text-center cursor-pointer"
            >
              {score}
            </Label>
          </div>
        ))}
      </RadioGroup>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Not like me</span>
        <span>Very much like me</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Badge variant="outline" className="strength-badge-identity mb-2">
          Part 2: Behavioral Style Assessment
        </Badge>
        <p className="text-sm text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </p>
      </div>

      <div className="text-center mb-8">
        <p className="text-base text-gray-700 font-medium mb-2">
          Rate how much each statement describes you
        </p>
        <p className="text-sm text-gray-500">
          (1 = Not like me at all, 5 = Very much like me)
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <Badge variant="outline" className="text-blue-700 border-blue-300">
                Statement A
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-6 leading-relaxed">
              {question.statementA}
            </p>
            <ScaleComponent 
              statement="A" 
              value={scoreA} 
              onChange={(score) => handleScoreChange('A', score)} 
            />
          </CardContent>
        </Card>

        <Card className="border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <Badge variant="outline" className="text-green-700 border-green-300">
                Statement B
              </Badge>
            </div>
            <p className="text-sm font-medium text-gray-800 mb-6 leading-relaxed">
              {question.statementB}
            </p>
            <ScaleComponent 
              statement="B" 
              value={scoreB} 
              onChange={(score) => handleScoreChange('B', score)} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiscQuestion;
