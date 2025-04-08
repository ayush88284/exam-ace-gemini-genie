
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
    console.log('Content preview:', content?.substring(0, 100) + '...');

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
              { text: "You are an AI study assistant named GAMA AI. You must ONLY use the following content to answer questions. DO NOT use any other knowledge or information:" },
              { text: content },
              { text: prompt }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.05,
          topK: 10,
          topP: 0.5,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };
    } else if (type === 'generate-questions') {
      // For generating questions - with extremely strict instructions to use ONLY the content provided
      payload = {
        contents: [
          {
            parts: [
              { 
                text: `You are an AI study assistant named GAMA AI. Generate EXACTLY ${numQuestions} questions with answers based EXCLUSIVELY on this EXACT content:

### BEGIN CONTENT ###
${content}
### END CONTENT ###

IMPORTANT RULES:
1. ONLY use information directly stated in the provided content above.
2. DO NOT generate questions about machine learning, AI, or algorithms UNLESS the document specifically discusses these topics.
3. DO NOT use any external knowledge or general information about any topic.
4. DO NOT make up information or facts that are not explicitly in the text.
5. If the content doesn't contain enough information for ${numQuestions} questions, generate fewer questions but NEVER invent information.
6. Keep your questions diverse and cover different parts of the document.
7. Format each question with its answer as follows:

Question: [question text based only on the document]
Answer: [answer text based only on the document]

Include a blank line between each question-answer pair.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.01, // Extremely low temperature to be strictly deterministic
          topK: 1,
          topP: 0.1,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      };
    } else {
      throw new Error(`Invalid type: ${type}`);
    }

    console.log('Sending request to Gemini API...');
    
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
    console.log('Generated text snippet:', generatedText.substring(0, 100) + '...');

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
