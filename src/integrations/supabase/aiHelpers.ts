
import { supabase } from "./client";
import { toast } from "sonner";

// Enhanced prompts for better quality responses
const ENHANCED_PROMPTS = {
  questions: `
You are GAMA AI, an expert academic assistant specializing in creating high-quality study questions. 
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
You are GAMA AI, an expert academic assistant helping students understand their study materials. 
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
export const generateEnhancedQuestions = async (
  content: string, 
  numQuestions: number = 5
) => {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: {
        content: content,
        type: 'generate-questions',
        numQuestions: numQuestions,
        enhancedPrompt: ENHANCED_PROMPTS.questions
      }
    });
    
    if (error) throw new Error(error.message);
    if (!data || !data.generatedText) {
      throw new Error('No content was generated. The API response was empty.');
    }
    
    return data.generatedText;
  } catch (error) {
    console.error("Error generating enhanced questions:", error);
    toast.error("Failed to generate questions. Please try again.");
    throw error;
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
        type: 'chat-response',
        enhancedPrompt: ENHANCED_PROMPTS.chat
      }
    });
    
    if (error) throw new Error(error.message);
    if (!data || !data.generatedText) {
      throw new Error('No response was generated. The API response was empty.');
    }
    
    return data.generatedText;
  } catch (error) {
    console.error("Error generating enhanced chat response:", error);
    toast.error("Failed to generate a response. Please try again.");
    throw error;
  }
};
