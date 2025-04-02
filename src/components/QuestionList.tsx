
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
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
}

const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  isLoading,
  contentSource,
  onGenerateMoreQuestions
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
      <Card className="examace-card w-full">
        <CardContent className="pt-6 text-center py-12">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-examace-purple" />
          <h3 className="mt-4 text-lg font-medium">Generating Questions</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Our AI is analyzing your study material and creating targeted questions...
          </p>
        </CardContent>
      </Card>
    );
  }

  if (questions.length === 0) {
    return null;
  }

  return (
    <Card className="examace-card w-full animate-fade-in">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold examace-gradient-text">Generated Questions</h2>
            <p className="text-sm text-muted-foreground">
              Based on: {contentSource}
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onGenerateMoreQuestions}
            className="flex gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Generate More
          </Button>
        </div>

        <Accordion type="multiple" className="w-full">
          {questions.map((question) => (
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
                  <Lightbulb className="h-5 w-5 text-examace-purple shrink-0 mt-0.5" />
                  <span className="font-medium text-base">{question.text}</span>
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
