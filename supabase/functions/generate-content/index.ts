
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Use the provided API key directly as a fallback in case the env variable is not set
const apiKey = Deno.env.get('GEMINI_API_KEY') || 'AIzaSyBJwob9aavPXaUFP_J0PEt323HfRCvCEE0';

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
    const { prompt, content, type, numQuestions = 5 } = await req.json();
    
    console.log('Function called with type:', type);
    console.log('Content length:', content?.length || 0);
    console.log('Number of questions requested:', numQuestions);
    console.log('Content preview:', content?.substring(0, 100));

    // Validate content
    if (!content || content.length < 10) {
      throw new Error('Content is too short or missing');
    }

    // Determine which endpoint to use based on the request type
    const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent';
    
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
              { text: "You are an AI study assistant. Use the following content to answer questions. Only provide information based on this content:" },
              { text: content },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      };
    } else if (type === 'generate-questions') {
      // For generating questions - with more specific instructions
      payload = {
        contents: [
          {
            parts: [
              { 
                text: `You are an AI study assistant. Generate EXACTLY ${numQuestions} questions with answers based STRICTLY AND ONLY on the following content. These questions must be directly related to the exact material provided below, with no external knowledge or assumptions. Format each question as: "Question: [question text]" followed by "Answer: [answer text]" on a new line. DO NOT number the questions. DO NOT use any special characters, markdown formatting, or asterisks. The content is:\n\n${content}` 
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.1, // Lower temperature for more deterministic output
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 2048,
        }
      };
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    console.log('Sending request to Gemini API...');
    console.log('API Key used (first 5 chars):', apiKey.substring(0, 5));
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error('Gemini API returned an error:', data.error);
      throw new Error(data.error.message || 'Error generating content');
    }

    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log('Generated text snippet:', generatedText.substring(0, 200));

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
