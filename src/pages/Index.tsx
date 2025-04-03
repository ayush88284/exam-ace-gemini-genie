
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
      console.log("Generated text preview:", generatedText.substring(0, 300) + "...");
      
      // Improved parsing logic to extract questions and answers
      const parsedQuestions: Question[] = [];
      
      // Split text by lines to process each question-answer pair
      const lines = generatedText.split('\n').filter(line => line.trim());
      let currentQuestion = '';
      let currentAnswer = '';
      let isReadingAnswer = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
          .replace(/^\d+[\.\)]\s*/, '') // Remove numeric prefixes like "1." or "1)"
          .replace(/^\*\*|\*\*$/g, '') // Remove markdown-style asterisks
          .replace(/^Question:?\s*/i, ''); // Remove "Question:" prefix
        
        if (line.toLowerCase().includes('answer:')) {
          // We found the start of an answer
          isReadingAnswer = true;
          const parts = line.split(/answer:?/i);
          if (parts.length > 1) {
            // The line contains both question end and answer start
            if (!currentQuestion) {
              currentQuestion = parts[0].trim();
            }
            currentAnswer = parts[1].trim();
          }
        } else if (i < lines.length - 1 && 
                  lines[i+1].trim().toLowerCase().includes('answer:')) {
          // The next line is an answer, so this must be a question
          currentQuestion = line;
        } else if (isReadingAnswer) {
          // Continue building the current answer
          currentAnswer += ' ' + line;
        } else if (line.trim() && line.endsWith('?')) {
          // This is likely a question (ends with question mark)
          currentQuestion = line;
        } else if (currentQuestion && !isReadingAnswer) {
          // Part of a multi-line question
          currentQuestion += ' ' + line;
        }
        
        // Check if we should save the current Q&A and move to the next
        const isEndOfAnswer = isReadingAnswer && 
          (i === lines.length - 1 || 
           (lines[i+1].trim().endsWith('?') || 
            /^\d+[\.\)]/.test(lines[i+1]) ||
            lines[i+1].toLowerCase().includes('question')));
        
        if (isEndOfAnswer || (i === lines.length - 1 && currentQuestion)) {
          if (currentQuestion) {
            parsedQuestions.push({
              id: `q${Date.now()}-${parsedQuestions.length}`,
              text: currentQuestion.trim(),
              answer: currentAnswer.trim() || "No answer provided"
            });
          }
          
          // Reset for next Q&A pair
          currentQuestion = '';
          currentAnswer = '';
          isReadingAnswer = false;
        }
      }
      
      // If we didn't find any questions with the detailed parsing,
      // try a simpler approach by splitting on "ANSWER:"
      if (parsedQuestions.length === 0) {
        const questionBlocks = generatedText.split(/\n\s*\n/).filter(block => block.trim());
        
        questionBlocks.forEach((block, index) => {
          const parts = block.split(/ANSWER:/i);
          if (parts.length >= 2) {
            const questionText = parts[0]
              .replace(/^\d+[\.\)]\s*/, '')
              .replace(/^\*\*|\*\*$/g, '')
              .replace(/^Question:?\s*/i, '')
              .trim();
            
            const answerText = parts[1].trim();
            
            parsedQuestions.push({
              id: `q${Date.now()}-${index}`,
              text: questionText,
              answer: answerText
            });
          }
        });
      }
      
      console.log(`Parsed ${parsedQuestions.length} questions from the response`);
      
      // Replace previous questions rather than append
      setQuestions(parsedQuestions);
      
      if (parsedQuestions.length === 0) {
        toast.warning("Could not extract questions from the generated content. Please try again with different content.");
      } else if (parsedQuestions.length < parseInt(questionCount)) {
        toast.info(`Only extracted ${parsedQuestions.length} questions out of the requested ${questionCount}`);
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
