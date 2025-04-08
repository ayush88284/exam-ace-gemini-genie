
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import UploadSection from "@/components/UploadSection";
import QuestionList from "@/components/QuestionList";
import ChatInterface from "@/components/ChatInterface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { MessageSquare, HelpCircle, Upload, BrainCircuit } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const Dashboard = () => {
  const [content, setContent] = React.useState<string | null>(null);
  const [contentSource, setContentSource] = React.useState<string>("");
  const [isGeneratingQuestions, setIsGeneratingQuestions] = React.useState(false);
  const [questions, setQuestions] = React.useState<any[]>([]);
  const [activeTab, setActiveTab] = React.useState("questions");
  const [questionCount, setQuestionCount] = React.useState("5");
  const { user, loading } = useSupabaseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

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
      
      // Call our Supabase Edge Function with explicit document content
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
      
      // Enhanced parsing logic to correctly extract questions and answers
      const parsedQuestions: any[] = [];
      
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
              text: currentQuestion.replace(/^\*\*|\*\*$|"/g, '').trim(),
              answer: currentAnswer.replace(/^\*\*|\*\*$|"/g, '').trim()
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
        <motion.h1 
          className="text-4xl font-bold gama-gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          GAMA AI Study Assistant
        </motion.h1>
        <motion.p 
          className="text-lg text-muted-foreground"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Generate exam-focused questions and answers from your study materials.
        </motion.p>
      </div>

      <motion.div 
        className="max-w-3xl mx-auto space-y-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
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
      </motion.div>
    </div>
  );
};

export default Dashboard;
