
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import QuestionList, { Question } from "@/components/QuestionList";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, HelpCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [content, setContent] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("questions");

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
          type: 'generate-questions'
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Parse the response to extract questions and answers
      const generatedText = data.generatedText || '';
      
      // Process the text to extract questions
      const questionBlocks = generatedText.split(/(?=\d+\.\s)/g).filter(block => block.trim());
      
      const parsedQuestions: Question[] = questionBlocks.map((block, index) => {
        // Try to split question and answer
        const parts = block.split(/(?:Answer:|(?:\r?\n){2,})/);
        let text = parts[0].replace(/^\d+\.\s*/, '').trim();
        let answer = parts[1]?.trim() || "The answer is not provided for this question.";
        
        return {
          id: `q${Date.now()}-${index}`,
          text,
          answer
        };
      });
      
      setQuestions(prevQuestions => {
        const existingIds = new Set(prevQuestions.map(q => q.id));
        const uniqueNewQuestions = parsedQuestions.filter(q => !existingIds.has(q.id));
        return [...prevQuestions, ...uniqueNewQuestions];
      });
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
      
      // Fallback to demo questions if API fails
      const fallbackQuestions = [
        {
          id: `q${Date.now()}-1`,
          text: "What are the key factors affecting climate change?",
          answer: "The key factors affecting climate change include greenhouse gas emissions, deforestation, industrial processes, and natural climate variability. Human activities, particularly the burning of fossil fuels, have significantly increased the concentration of greenhouse gases in the atmosphere."
        },
        {
          id: `q${Date.now()}-2`,
          text: "How does photosynthesis work in plants?",
          answer: "Photosynthesis is the process by which plants convert light energy into chemical energy. The process takes place in chloroplasts, particularly in the chlorophyll-containing tissues. It uses carbon dioxide and water to produce glucose and oxygen through a series of light-dependent and light-independent reactions."
        }
      ];
      
      setQuestions(prevQuestions => {
        const existingIds = new Set(prevQuestions.map(q => q.id));
        const uniqueNewQuestions = fallbackQuestions.filter(q => !existingIds.has(q.id));
        return [...prevQuestions, ...uniqueNewQuestions];
      });
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
                  <QuestionList 
                    questions={questions}
                    isLoading={isGeneratingQuestions}
                    contentSource={contentSource}
                    onGenerateMoreQuestions={handleGenerateMoreQuestions}
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
