
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Loader2, RefreshCcw, Lightbulb } from "lucide-react";

export interface Question {
  id: string;
  text: string;
  answer: string;
}

interface QuestionListProps {
  questions: Question[];
  isLoading: boolean;
  contentSource: string;
  onGenerateMoreQuestions: () => void;
  questionCount: number;
  onQuestionCountChange: (value: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  isLoading,
  contentSource,
  onGenerateMoreQuestions,
  questionCount,
  onQuestionCountChange
}) => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleAccordion = (id: string) => {
    if (openItems.includes(id)) {
      setOpenItems(openItems.filter(item => item !== id));
    } else {
      setOpenItems([...openItems, id]);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <h3 className="mt-4 text-lg font-medium">Generating Questions</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Our AI is analyzing your study material and creating targeted questions...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6 text-center py-8">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Generate Study Questions</h3>
            <p className="text-sm text-muted-foreground">
              Select how many questions you want to generate based on your study material
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="question-count-select" className="text-sm font-medium">
                  Number of questions:
                </label>
                <Select 
                  value={questionCount.toString()} 
                  onValueChange={onQuestionCountChange}
                >
                  <SelectTrigger className="w-[100px]" id="question-count-select">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                onClick={onGenerateMoreQuestions}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
              >
                Generate Questions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">Generated Questions</h2>
            <p className="text-sm text-muted-foreground">
              Based on: {contentSource}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Select 
                value={questionCount.toString()} 
                onValueChange={onQuestionCountChange}
              >
                <SelectTrigger className="w-[80px]">
                  <SelectValue placeholder="5" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onGenerateMoreQuestions}
              className="flex gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Generate
            </Button>
          </div>
        </div>

        <Accordion type="multiple" className="w-full">
          {questions.map((question, index) => (
            <AccordionItem 
              key={question.id} 
              value={question.id}
              className="border border-border rounded-lg mb-3 px-4 shadow-sm"
            >
              <AccordionTrigger 
                onClick={() => toggleAccordion(question.id)}
                className="hover:no-underline py-3"
              >
                <div className="flex items-start text-left gap-3">
                  <Lightbulb className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-base">Question {index + 1}: {question.text}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="text-left pt-2 pb-4">
                <div className="pl-8 prose prose-sm max-w-none">
                  <p className="text-muted-foreground font-medium text-sm mb-1">Answer:</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    {question.answer}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default QuestionList;
