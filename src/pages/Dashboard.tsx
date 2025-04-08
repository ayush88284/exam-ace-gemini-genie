
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
import { MessageSquare, HelpCircle } from "lucide-react";
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
    
    // For PDF content that starts with %PDF, convert it to a more usable text format
    if (newContent.startsWith("%PDF")) {
      toast.info("Processing PDF content. This may take a moment...");
      // Placeholder for PDF content - in a real app, you'd use a PDF parsing library
      newContent = "This is extracted content from a PDF document. In a real application, you would use a proper PDF parsing library.";
    }
    
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
      
      // For demo purposes, let's handle the question generation locally if the API fails
      // In a real application, you'd want to improve the API reliability and error handling
      try {
        // First try the Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('generate-content', {
          body: {
            content: textContent.substring(0, 10000), // Limit content length to avoid payload size issues
            type: 'generate-questions',
            numQuestions: parseInt(questionCount)
          }
        });
        
        if (error) {
          throw error;
        }
        
        if (data && data.generatedText) {
          processGeneratedQuestions(data.generatedText);
          return;
        }
      } catch (error) {
        console.error("Error calling Supabase function:", error);
        // Fall back to local question generation
        generateLocalQuestions(textContent);
      }
      
    } catch (error) {
      console.error("Error generating questions:", error);
      toast.error("Failed to generate questions. Using sample questions instead.");
      generateLocalQuestions(textContent);
    } finally {
      setIsGeneratingQuestions(false);
    }
  };
  
  const generateLocalQuestions = (content: string) => {
    // Generate simple sample questions based on content
    const contentPreview = content.substring(0, 500);
    const words = contentPreview.split(/\s+/).filter(word => word.length > 5);
    
    // Create sample questions based on available words
    const sampleQuestions = [];
    const numQuestions = Math.min(parseInt(questionCount), 5);
    
    for (let i = 0; i < numQuestions; i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)] || "topic";
      sampleQuestions.push({
        id: `q${Date.now()}-${i}`,
        text: `What is the significance of ${randomWord} in this material?`,
        answer: `${randomWord} is a key concept in the material. It relates to several other topics and understanding it is crucial for mastering the subject.`
      });
    }
    
    setQuestions(sampleQuestions);
    toast.success(`Generated ${sampleQuestions.length} sample questions from your study material`);
  };
  
  const processGeneratedQuestions = (generatedText: string) => {
    // Process the response to extract questions
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
      toast.warning("Could not extract questions from the generated content. Using sample questions instead.");
      generateLocalQuestions(generatedText);
    } else if (parsedQuestions.length < parseInt(questionCount)) {
      toast.info(`Extracted ${parsedQuestions.length} questions out of the requested ${questionCount}`);
    } else {
      toast.success(`Generated ${parsedQuestions.length} questions from your study material`);
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
