
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { getEnhancedChatResponse } from "@/integrations/supabase/aiHelpers";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

interface ChatInterfaceProps {
  contentSource: string;
  studyContent: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ contentSource, studyContent }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: `Hello! I'm your AI study assistant powered by Gemini. Ask me anything about the material you've uploaded.`,
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      console.log("Sending chat request with content length:", studyContent?.length || 0);
      
      const response = await getEnhancedChatResponse(
        inputMessage, 
        studyContent,
        messages.map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.content }))
      );
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
      };
      
      setMessages(prev => [...prev, aiResponse]);
      
      if (response.includes("offline mode")) {
        setIsOfflineMode(true);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Failed to process your request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="gama-card w-full h-[600px] flex flex-col bg-background/60 backdrop-blur-lg">
      <CardContent className="pt-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold gama-gradient-text flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Chat with Your Study Material
          </h2>
          {contentSource && (
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {contentSource}
            </span>
          )}
        </div>

        {isOfflineMode && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-md p-3 mb-4 flex items-center gap-2"
          >
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              GAMA AI is running in offline mode. Please configure the Gemini API key in your Supabase Edge Function settings.
            </p>
          </motion.div>
        )}

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-primary/10 hover:scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={cn(
                  "flex items-start gap-3",
                  message.isUser ? "flex-row-reverse" : ""
                )}
              >
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                    message.isUser
                      ? "bg-gradient-to-br from-purple-600 to-blue-600 text-white"
                      : "bg-gradient-to-br from-blue-600 to-purple-600 text-white"
                  )}
                >
                  {message.isUser ? (
                    <User className="h-5 w-5" />
                  ) : (
                    <Bot className="h-5 w-5" />
                  )}
                </div>
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[80%] break-words text-sm",
                    message.isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  )}
                >
                  {message.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-start gap-3"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-muted text-foreground rounded-tl-none">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 mt-auto relative">
          <Textarea
            placeholder="Ask a question about your study material..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none pr-12 bg-background/60"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="absolute right-2 bottom-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="icon"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface;
