
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, type, numQuestions = 5 } = await req.json();

    if (!content) {
      throw new Error('Content is required');
    }

    // Check if OpenAI API key is configured
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('OpenAI API key is not configured in Supabase secrets');
      
      // Instead of throwing an error, return a more informative response with a specific status code
      // that the client can handle
      return new Response(
        JSON.stringify({ 
          error: 'OpenAI API key is not configured',
          status: 'error',
          errorType: 'API_KEY_MISSING',
          generatedText: generateFallbackResponse(type, content, numQuestions)
        }),
        { 
          status: 200, // We're returning 200 with an error flag instead of 500 to make handling easier
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Set the appropriate system prompt based on type
    let systemPrompt = '';
    let prompt = '';
    
    if (type === 'generate-questions') {
      systemPrompt = `You are GAMA AI, an advanced educational AI designed to create high-quality exam questions and detailed answers based on study materials.
Your task is to carefully analyze the study content provided and generate the most relevant, challenging, and insightful questions that test deep understanding rather than memorization.
Follow these guidelines precisely:

1. Generate exactly ${numQuestions} questions with comprehensive answers
2. Format each question-answer pair as:
   Question: [clear, focused question]
   Answer: [detailed, educational answer with key concepts bolded]
3. Ensure questions:
   - Test conceptual understanding and critical thinking
   - Are structured for clear learning outcomes
   - Range from foundational knowledge to application and analysis
   - Are concise but precise in their wording
4. Ensure answers:
   - Provide complete explanations with justifications
   - Include relevant terminology and key principles
   - Are accurate, educational, and useful for learning
   - Would satisfy an expert in the field

Respond with only the questions and answers in the specified format. Do not include any other text.`;

      prompt = `Based on the following study content, generate ${numQuestions} high-quality exam questions with comprehensive answers:\n\n${content}`;
    } 
    else if (type === 'chat') {
      systemPrompt = `You are GAMA AI, an educational assistant designed to help students understand their study materials. You're analyzing a document or text that the student has uploaded or shared. 
When answering:
1. Draw exclusively from the provided content
2. Be specific and cite relevant sections from the content when appropriate
3. If the answer isn't in the content, admit that clearly and don't make up information
4. Format your answers clearly with paragraphs and bullet points when appropriate
5. Focus on being educational and helpful, not just providing answers
6. If relevant, explain underlying principles or concepts to deepen understanding

Your goal is to help the student truly master the material, not just get through an assignment.`;

      prompt = `The following is the study content I'm referring to:\n\n${content}\n\nBased on this content, please answer my question: ${type === 'chat' && req.query ? req.query.message : 'Can you summarize the key points?'}`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    const responseData = await response.json();
    
    if (responseData.error) {
      throw new Error(`OpenAI API error: ${responseData.error.message}`);
    }

    const generatedText = responseData.choices[0].message.content;

    return new Response(
      JSON.stringify({ 
        generatedText,
        status: 'success'
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in generate-content function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        status: 'error',
        errorType: 'PROCESSING_ERROR'
      }),
      { 
        status: 200, // Using 200 even for errors, but with error flag
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Generate fallback content when OpenAI API is not available
function generateFallbackResponse(type, content, numQuestions = 5) {
  if (type === 'generate-questions') {
    // Create simple generic questions based on the content length
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
  } 
  else if (type === 'chat') {
    return "I'm currently operating in offline mode due to API configuration issues. I can see you've uploaded some study material, but I can't analyze it in detail right now. Please ask your administrator to configure the OpenAI API key in the Supabase Edge Function settings to enable full AI capabilities.";
  }
  
  return "Unable to generate content due to API configuration issues.";
}
