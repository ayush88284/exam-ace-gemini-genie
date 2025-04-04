
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
      // For generating questions - with much stricter instructions to use ONLY the content provided
      payload = {
        contents: [
          {
            parts: [
              { 
                text: `You are an AI study assistant named GAMA AI. Your task is to generate EXACTLY ${numQuestions} questions with answers based EXCLUSIVELY on the content provided below.

IMPORTANT RULES:
1. ONLY use information directly stated in the provided content.
2. DO NOT use any external knowledge about any topic.
3. DO NOT make up information or facts that are not explicitly in the text.
4. If the content is about history, only ask about the historical facts in the content.
5. If the content is about science, only ask about the scientific concepts in the content.
6. NEVER generate questions about machine learning unless the document is specifically about machine learning.
7. Create questions only from the exact text provided, not based on general knowledge of the subject.

Format your response as follows:
Question: [question text]
Answer: [answer text]

(Leave a blank line between each question-answer pair)

Here is the ONLY content you should use:

${content}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.01, // Extremely low temperature to be highly deterministic
          topK: 10,
          topP: 0.5,
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
