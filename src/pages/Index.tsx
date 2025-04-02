
import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UploadSection from "@/components/UploadSection";
import QuestionList, { Question } from "@/components/QuestionList";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, HelpCircle } from "lucide-react";

const Index = () => {
  const [content, setContent] = useState<string | null>(null);
  const [contentSource, setContentSource] = useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState("questions");

  const handleContentUploaded = (newContent: string, source: string) => {
    setContent(newContent);
    setContentSource(source);
    generateQuestions();
  };

  const generateQuestions = () => {
    setIsGeneratingQuestions(true);
    // Simulate API call to Gemini for question generation
    setTimeout(() => {
      const newQuestions = [
        {
          id: `q${Date.now()}-1`,
          text: "What are the key factors affecting climate change?",
          answer: "The key factors affecting climate change include greenhouse gas emissions, deforestation, industrial processes, and natural climate variability. Human activities, particularly the burning of fossil fuels, have significantly increased the concentration of greenhouse gases in the atmosphere."
        },
        {
          id: `q${Date.now()}-2`,
          text: "How does photosynthesis work in plants?",
          answer: "Photosynthesis is the process by which plants convert light energy into chemical energy. The process takes place in chloroplasts, particularly in the chlorophyll-containing tissues. It uses carbon dioxide and water to produce glucose and oxygen through a series of light-dependent and light-independent reactions."
        },
        {
          id: `q${Date.now()}-3`,
          text: "What were the main causes of World War II?",
          answer: "The main causes of World War II include the harsh conditions imposed on Germany by the Treaty of Versailles, the global economic depression, the rise of fascism and militarism in Germany, Italy, and Japan, the policy of appeasement by Western powers, and territorial disputes in Europe and Asia."
        }
      ];
      
      setQuestions(prevQuestions => {
        const existingIds = new Set(prevQuestions.map(q => q.id));
        const uniqueNewQuestions = newQuestions.filter(q => !existingIds.has(q.id));
        return [...prevQuestions, ...uniqueNewQuestions];
      });
      
      setIsGeneratingQuestions(false);
    }, 2000);
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
              Ace Your Exams With AI
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
                  <ChatInterface contentSource={contentSource} />
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
