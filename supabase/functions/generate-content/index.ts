
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const apiKey = Deno.env.get('GEMINI_API_KEY');

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
    const { prompt, content, type } = await req.json();

    // Determine which endpoint to use based on the request type
    let endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    
    const headers = {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    };

    // Prepare request payload based on the type of query
    let payload;
    if (type === 'chat') {
      // For chat with document
      payload = {
        contents: [
          {
            parts: [
              { text: "You are an AI study assistant. Use the following content to answer questions:" },
              { text: content },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
    } else if (type === 'generate-questions') {
      // For generating questions
      payload = {
        contents: [
          {
            parts: [
              { 
                text: `You are an AI study assistant. Generate 5 exam-focused questions with answers based on the following content. Format each question with its answer. Make the questions challenging and relevant for exam preparation:\n\n${content}` 
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      };
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Error generating content');
    }

    const generatedText = data.candidates[0]?.content?.parts?.[0]?.text || '';

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
