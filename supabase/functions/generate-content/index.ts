
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
    const { content, type, numQuestions = 5, userMessage = '', conversationHistory = [] } = await req.json();

    // Check if Gemini API key is configured
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    
    // Add extensive logging for API key check
    console.log('API Key Check:');
    console.log('- API Key present:', !!apiKey);
    console.log('- API Key length:', apiKey?.length || 'N/A');
    console.log('- First 4 chars:', apiKey?.substring(0, 4) || 'N/A');

    if (!apiKey) {
      console.error('Gemini API key is not configured in Supabase secrets');
      
      return new Response(
        JSON.stringify({ 
          error: 'Gemini API key is not configured',
          status: 'error',
          errorType: 'API_KEY_MISSING',
          generatedText: generateFallbackResponse(type, content, numQuestions)
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json' 
          } 
        }
      );
    }

    // Prepare the prompt based on the request type
    const prompt = preparePrompt(type, content, numQuestions, userMessage, conversationHistory);

    // Call Gemini API
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048,
        },
      }),
    });

    const responseData = await response.json();
    
    if (responseData.error) {
      throw new Error(`Gemini API error: ${responseData.error.message}`);
    }

    const generatedText = responseData.candidates[0].content.parts[0].text;

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
        errorType: 'PROCESSING_ERROR',
        generatedText: generateFallbackResponse(type, content, 5)
      }),
      { 
        status: 200,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});

// Prepare prompt based on request type
function preparePrompt(type, content, numQuestions, userMessage = '', conversationHistory = []) {
  switch(type) {
    case 'generate-questions':
      return `Based on the following study content, generate ${numQuestions} high-quality exam questions with comprehensive answers:\n\n${content}`;
    
    case 'chat':
      const historyContext = conversationHistory.map(msg => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      return `Study Material Context:\n${content}\n\nConversation History:\n${historyContext}\n\nLatest User Message:\n${userMessage}\n\nProvide a helpful, contextual response based on the study material.`;
    
    default:
      return content;
  }
}

// Generate fallback content when Gemini API is not available
function generateFallbackResponse(type, content, numQuestions = 5) {
  if (type === 'generate-questions') {
    let fallbackContent = '';
    const contentPreview = content.substring(0, 500);
    const words = contentPreview.split(/\s+/).filter(word => word.length > 5);
    
    for (let i = 1; i <= Math.min(numQuestions, 5); i++) {
      const randomWord = words[Math.floor(Math.random() * words.length)] || "topic";
      
      fallbackContent += `Question: What is the significance of ${randomWord} in this material?\n`;
      fallbackContent += `Answer: ${randomWord} is a key concept in the material. It relates to several other topics and understanding it is crucial for mastering the subject.\n\n`;
    }
    
    return fallbackContent;
  } 
  else if (type === 'chat') {
    return "I'm currently operating in offline mode due to API configuration issues. I can see you've uploaded some study material, but I can't analyze it in detail right now. Please ask your administrator to configure the Gemini API key in the Supabase Edge Function settings.";
  }
  
  return "Unable to generate content due to API configuration issues.";
}
