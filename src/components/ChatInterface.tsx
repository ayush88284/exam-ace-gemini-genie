
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      content: `Hello! I'm your AI study assistant. Ask me anything about the material you've uploaded.`,
      isUser: false,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
    };
    setMessages([...messages, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Call our Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-content', {
        body: {
          prompt: inputMessage,
          content: studyContent,
          type: 'chat'
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: data.generatedText || "I'm sorry, I couldn't process that request. Please try again.",
        isUser: false,
      };
      
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    } catch (error) {
      console.error("Error in chat:", error);
      toast.error("Failed to get response. Please try again.");
      
      // Fallback response
      const fallbackResponse = {
        id: (Date.now() + 1).toString(),
        content: "I'm having trouble connecting to my knowledge base. Please try again in a moment.",
        isUser: false,
      };
      
      setMessages(prevMessages => [...prevMessages, fallbackResponse]);
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
    <Card className="gama-card w-full h-[500px] flex flex-col">
      <CardContent className="pt-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold gama-gradient-text">Chat with Your Study Material</h2>
          {contentSource && (
            <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              {contentSource}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.isUser ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full shrink-0",
                  message.isUser
                    ? "bg-examace-purple text-white"
                    : "bg-examace-blue text-white"
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
                    ? "bg-examace-purple/10 text-foreground rounded-tr-none"
                    : "bg-examace-blue/10 text-foreground rounded-tl-none"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-examace-blue text-white shrink-0">
                <Bot className="h-5 w-5" />
              </div>
              <div className="rounded-2xl px-4 py-3 bg-examace-blue/10 text-foreground rounded-tl-none">
                <span className="flex gap-1 items-center">
                  <span className="animate-bounce">•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>•</span>
                  <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>•</span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2 mt-auto">
          <Textarea
            placeholder="Ask a question about your study material..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!inputMessage.trim() || isLoading}
            className="gama-gradient-bg shrink-0"
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
