
import React, { useState } from "react";
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
import { LandingPage } from "@/components/LandingPage";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Navigate } from "react-router-dom";
import { generateEnhancedQuestions } from "@/integrations/supabase/aiHelpers";

const Index = () => {
  const [content, setContent] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("questions");
  const [questionCount, setQuestionCount] = useState("5");
  const { user, loading } = useSupabaseAuth();

  // If the user is authenticated, redirect to dashboard
  if (!loading && user) {
    return <Navigate to="/app" replace />;
  }

  const handleContentUploaded = async (newContent: string, source: string) => {
    console.log("Content received, length:", newContent.length);
    console.log("Content preview:", newContent.substring(0, 200));
    
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
      console.log("Generating questions with content length:", textContent.length);
      
      // Use our enhanced question generation
      const generatedText = await generateEnhancedQuestions(
        textContent, 
        parseInt(questionCount)
      );
      
      console.log("Generated text preview:", generatedText.substring(0, 300) + "...");
      
      // Enhanced parsing logic to correctly extract questions and answers
      const parsedQuestions: Question[] = [];
      
      // Split by "Question:" and "Answer:" patterns, handling the response format more carefully
      const lines = generatedText.split('\n');
      let currentQuestion = '';
      let currentAnswer = '';
      let isCollectingAnswer = false;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.toLowerCase().startsWith('question:')) {
          // If we were already collecting a previous Q&A pair, save it
          if (currentQuestion && currentAnswer) {
            parsedQuestions.push({
              id: `q${Date.now()}-${parsedQuestions.length}`,
              text: currentQuestion.replace(/^\*\*|\*\*$|"/g, '').trim(), // Remove any ** markdown and quotes
              answer: currentAnswer.replace(/^\*\*|\*\*$|"/g, '').trim() // Remove any ** markdown and quotes
            });
          }
          
          // Start a new question
          currentQuestion = line.substring("Question:".length).trim();
          currentAnswer = '';
          isCollectingAnswer = false;
        } else if (line.toLowerCase().startsWith('answer:')) {
          // Start collecting the answer
          currentAnswer = line.substring("Answer:".length).trim();
          isCollectingAnswer = true;
        } else if (line === '') {
          // Empty line - could be a separator between Q&A pairs
          continue;
        } else if (isCollectingAnswer) {
          // Continue building the current answer
          currentAnswer += ' ' + line;
        } else if (currentQuestion) {
          // If we have a question but no answer yet, this might be part of the question
          currentQuestion += ' ' + line;
        }
      }
      
      // Don't forget to add the last Q&A pair if we have one
      if (currentQuestion && currentAnswer) {
        parsedQuestions.push({
          id: `q${Date.now()}-${parsedQuestions.length}`,
          text: currentQuestion.replace(/^\*\*|\*\*$|"/g, '').trim(),
          answer: currentAnswer.replace(/^\*\*|\*\*$|"/g, '').trim()
        });
      }
      
      console.log(`Parsed ${parsedQuestions.length} questions from the response`);
      
      // Replace previous questions rather than append
      setQuestions(parsedQuestions);
      
      if (parsedQuestions.length === 0) {
        toast.warning("Could not extract questions from the generated content. Please try again with different content.");
      } else if (parsedQuestions.length < parseInt(questionCount)) {
        toast.info(`Only extracted ${parsedQuestions.length} questions out of the requested ${questionCount}`);
      } else {
        toast.success(`Generated ${parsedQuestions.length} questions from your study material`);
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

  // If content is not loaded yet, show the landing page
  if (!content) {
    return <LandingPage />;
  }

  // Show the application once content is loaded
  return (
    <div className="container py-8 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold gama-gradient-text">
          GAMA AI Study Assistant
        </h1>
        <p className="text-lg text-muted-foreground">
          Generate exam-focused questions and answers from your study materials.
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
  );
};

export default Index;
