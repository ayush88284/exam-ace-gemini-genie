import { supabase } from "./client";
import { toast } from "sonner";

// Enhanced prompts for better quality responses
const ENHANCED_PROMPTS = {
  questions: `
You are GAMA AI, powered by Google's Gemini, an expert academic assistant specializing in creating high-quality study questions. 
Analyze the provided study material thoroughly and generate thoughtful questions that:
1. Are precise, clear, and academically rigorous
2. Test comprehension of key concepts rather than minor details
3. Include a mix of recall, application, analysis, and critical thinking
4. Are properly formatted with clear question and answer sections
5. Provide thorough, accurate explanations in the answers
6. Use proper academic language and domain-specific terminology when appropriate

Format each question-answer pair as follows:
Question: [Clear, concise question text]
Answer: [Comprehensive, accurate answer with explanation]

Be thorough in your analysis and ensure questions cover the most important concepts in the material.
`,
  
  chat: `
You are GAMA AI, powered by Google's Gemini, an expert academic assistant helping students understand their study materials. 
When responding to questions:
1. Focus on accuracy and clarity in your explanations
2. Use examples to illustrate complex concepts
3. Break down difficult ideas into manageable components
4. Connect new information to established concepts
5. Cite specific sections from the uploaded content when relevant
6. Be concise but thorough - prioritize quality over verbosity
7. When appropriate, suggest additional questions the student might consider to deepen their understanding

If you're uncertain about something, acknowledge the limitations rather than providing potentially incorrect information.
`
};

// Generate questions from content
export const generateEnhancedQuestions = async (content: string, numQuestions: number = 5) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        content: content,
        type: 'generate-questions',
        numQuestions: numQuestions,
        enhancedPrompt: ENHANCED_PROMPTS.questions,
        model: 'gemini'
      }
    });
    
    if (error) throw new Error(error.message);
    
    // Check if we received an error status in the data
    if (data?.status === 'error') {
      console.warn("API returned error status:", data.error);
      
      if (data.errorType === 'API_KEY_MISSING') {
        toast.warning("GAMA AI is running in offline mode. Please configure Gemini API key.");
        console.info("Using fallback content generation due to missing Gemini API key");
      } else {
        toast.error("Error generating questions: " + (data.error || "Unknown error"));
      }
      
      if (data.generatedText) {
        return data.generatedText;
      }
      
      throw new Error(data.error || "Error generating content");
    }
    
    if (!data || !data.generatedText) {
      throw new Error('No content was generated. The API response was empty.');
    }
    
    return data.generatedText;
  } catch (error) {
    console.error("Error generating enhanced questions:", error);
    toast.error("Failed to generate questions. Using sample questions instead.");
    return generateClientSideFallbackQuestions(content, numQuestions);
  }
};

// Enhanced chat responses
export const getEnhancedChatResponse = async (
  userMessage: string,
  studyContent: string,
  conversationHistory: Array<{role: string, content: string}>
) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        content: studyContent,
        userMessage: userMessage,
        conversationHistory: conversationHistory,
        type: 'chat',
        model: 'gemini'
      }
    });
    
    if (error) throw new Error(error.message);
    
    if (data?.status === 'error') {
      console.warn("API returned error status:", data.error);
      
      if (data.errorType === 'API_KEY_MISSING') {
        toast.warning("GAMA AI is running in offline mode. Please configure Gemini API key.");
        console.info("Using fallback content for chat");
      } else {
        toast.error("Error generating response: " + (data.error || "Unknown error"));
      }
      
      if (data.generatedText) {
        return data.generatedText;
      }
      
      throw new Error(data.error || "Error generating content");
    }
    
    if (!data || !data.generatedText) {
      throw new Error('No response was generated. The API response was empty.');
    }
    
    return data.generatedText;
  } catch (error) {
    console.error("Error generating enhanced chat response:", error);
    toast.error("Failed to generate a response. Using fallback response.");
    return generateClientSideFallbackChatResponse(studyContent, userMessage);
  }
};

// Generate fallback questions on the client side if the API fails
const generateClientSideFallbackQuestions = (content: string, numQuestions: number = 5) => {
  let fallbackContent = '';
  const contentPreview = content.substring(0, 500);
  const words = contentPreview.split(/\s+/).filter(word => word.length > 5);
  
  for (let i = 1; i <= Math.min(numQuestions, 5); i++) {
    // Use some words from the content to make questions somewhat relevant
    const randomWord = words[Math.floor(Math.random() * words.length)] || "topic";
    
    fallbackContent += `Question: What is the significance of ${randomWord} in this material?\n`;
    fallbackContent += `Answer: ${randomWord} is a key concept in the material. It relates to several other topics and understanding it is crucial for mastering the subject.\n\n`;
  }
  
  return fallbackContent;
};

// Generate a fallback chat response on the client side if the API fails
const generateClientSideFallbackChatResponse = (content: string, userMessage: string) => {
  return "I'm currently operating in offline mode due to API configuration issues. I can see you've uploaded some study material, but I can't analyze it in detail right now. Please check with your administrator about the AI service configuration.";
};
