import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import QuestionList, { Question } from "@/components/QuestionList";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MessageSquare, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [content, setContent] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [questionCount, setQuestionCount] = useState("5");

  const handleContentUploaded = async (newContent: string, source: string) => {
    setContent(newContent);
    setContentSource(source);
    await generateQuestions(newContent);
  };

  const generateQuestions = async (contentToUse?: string) => {
    setIsGeneratingQuestions(true);
    const textContent = contentToUse || content;
    
    if (!textContent) {
      toast.error("No content available to generate questions");
      setIsGeneratingQuestions(false);
      return;
    }
    
    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          content: textContent,
          type: 'generate-questions',
          numQuestions: parseInt(questionCount)
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.generatedText) {
        throw new Error('No content was generated. The API response was empty.');
      }
      
      // Process the response to extract questions
      const generatedText = data.generatedText || '';
      console.log("Generated text:", generatedText.substring(0, 100) + "...");
      
      // Process the text to extract questions and answers
      // Better parsing to handle various formats from Gemini
      const parsedQuestions: Question[] = [];
      
      // Split by question patterns (numbered questions or "Question:" format)
      const questionPattern = /(?:^|\n)(?:(\d+[\.\)]|Question \d+:))\s*(.*?)(?=\s*ANSWER:|$)/gsi;
      const answerPattern = /ANSWER:\s*([\s\S]*?)(?=(?:\n\d+[\.\)]|\nQuestion \d+:|$))/gi;
      
      let questionMatches = [...generatedText.matchAll(questionPattern)];
      let answerMatches = [...generatedText.matchAll(answerPattern)];
      
      // If we don't have enough matches, try alternative parsing
      if (questionMatches.length < 2 && answerMatches.length < 2) {
        // Try splitting by double newlines and look for question/answer pairs
        const parts = generatedText.split(/\n\s*\n/).filter(p => p.trim());
        
        parts.forEach((part, index) => {
          const answerSplit = part.split(/ANSWER:/i);
          if (answerSplit.length >= 2) {
            // First part is the question, rest is the answer
            const questionText = answerSplit[0].replace(/^\d+[\.\)]\s*|^Question \d+:\s*/i, '').trim();
            const answerText = answerSplit[1].trim();
            
            parsedQuestions.push({
              id: `q${Date.now()}-${index}`,
              text: questionText,
              answer: answerText
            });
          } else {
            // If no "ANSWER:" found, try to determine if this is a question or answer
            // If followed by a part with "ANSWER:", this is likely a question
            if (index + 1 < parts.length && parts[index + 1].includes("ANSWER:")) {
              const questionText = part.replace(/^\d+[\.\)]\s*|^Question \d+:\s*/i, '').trim();
              parsedQuestions.push({
                id: `q${Date.now()}-${index}`,
                text: questionText,
                answer: "Not provided"
              });
            } else if (index > 0 && parts[index - 1].includes("?") && !part.includes("?")) {
              // If previous part had a question mark and this doesn't, likely an answer
              if (parsedQuestions.length > 0) {
                parsedQuestions[parsedQuestions.length - 1].answer = part;
              }
            } else {
              // Otherwise assume it's a question with no answer
              const questionText = part.replace(/^\d+[\.\)]\s*|^Question \d+:\s*/i, '').trim();
              parsedQuestions.push({
                id: `q${Date.now()}-${index}`,
                text: questionText,
                answer: "Not provided"
              });
            }
          }
        });
      } else {
        // Process using regex matches
        questionMatches.forEach((match, index) => {
          const questionText = match[2].replace(/^\*\*|\*\*$/g, '').trim();
          let answerText = "Answer not provided";
          
          if (index < answerMatches.length) {
            answerText = answerMatches[index][1].replace(/^\*\*|\*\*$/g, '').trim();
          }
          
          parsedQuestions.push({
            id: `q${Date.now()}-${index}`,
            text: questionText,
            answer: answerText
          });
        });
      }
      
      // Replace previous questions rather than append
      setQuestions(parsedQuestions);
      
      if (parsedQuestions.length === 0) {
        toast.warning("Generated content did not contain any valid questions. Try uploading different content.");
      }
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
      
      // Clear previous questions
      setQuestions([]);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };

  const handleGenerateMoreQuestions = () => {
    generateQuestions();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="container py-8 space-y-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
            <h1 className="text-4xl font-bold examace-gradient-text">
              GAMA AI - Ace Your Exams With AI
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your study materials and let our AI generate exam-focused questions and answers to help you prepare effectively.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-8">
            <UploadSection onContentUploaded={handleContentUploaded} />

            {content && (
              <Tabs 
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger 
                    value="questions"
                    className="flex items-center gap-2"
                  >
                    <HelpCircle className="h-4 w-4" />
                    <span>Questions</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="chat"
                    className="flex items-center gap-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>Chat</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="questions">
                  {content && !isGeneratingQuestions && questions.length === 0 && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <label htmlFor="question-count" className="text-sm font-medium">
                          Number of questions:
                        </label>
                        <Select 
                          value={questionCount} 
                          onValueChange={setQuestionCount}
                        >
                          <SelectTrigger className="w-[100px]" id="question-count">
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
                    </div>
                  )}
                  
                  <QuestionList 
                    questions={questions}
                    isLoading={isGeneratingQuestions}
                    contentSource={contentSource}
                    onGenerateMoreQuestions={handleGenerateMoreQuestions}
                    questionCount={parseInt(questionCount)}
                    onQuestionCountChange={setQuestionCount}
                  />
                </TabsContent>
                <TabsContent value="chat">
                  <ChatInterface 
                    contentSource={contentSource} 
                    studyContent={content}
                  />
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
