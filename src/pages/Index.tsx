
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
      
      if (!data || !data.generatedText) {
        throw new Error('No content was generated. The API response was empty.');
      }
      
      // Process the response to extract questions
      const generatedText = data.generatedText || '';
      console.log("Generated text:", generatedText.substring(0, 100) + "...");
      
      // Process the text to extract questions
      const questionBlocks = generatedText.split(/(?=\d+\.\s)/g).filter(block => block.trim());
      
      if (questionBlocks.length === 0) {
        throw new Error('Could not parse questions from the generated content.');
      }
      
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
      
      // Replace previous questions rather than append
      setQuestions(parsedQuestions);
      
      if (parsedQuestions.length === 0) {
        toast.warning("Generated content did not contain any valid questions. Try uploading different content.");
      }
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Please try again.");
      
      // Clear previous questions instead of falling back to demo questions
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
