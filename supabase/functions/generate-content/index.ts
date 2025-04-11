
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
    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      throw new Error('OpenAI API key is not configured');
    }

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
        status: 'error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
