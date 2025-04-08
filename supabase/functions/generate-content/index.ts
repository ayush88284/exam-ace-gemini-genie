
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateContentRequest {
  content: string;
  type: 'generate-questions' | 'generate-summary' | 'chat';
  numQuestions?: number;
  chatHistory?: Array<{ role: 'user' | 'assistant', content: string }>;
  query?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received to generate-content function");
    const { content, type, numQuestions = 5, chatHistory, query } = await req.json() as GenerateContentRequest;
    
    console.log(`Received request type: ${type}`);
    console.log(`Content length: ${content?.length}`);
    
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }
    
    let generatedText = "";
    
    if (type === 'generate-questions') {
      generatedText = await generateQuestions(content, numQuestions);
    } else if (type === 'chat') {
      if (!query) {
        throw new Error("Query is required for chat functionality");
      }
      
      generatedText = await answerQuestion(content, query, chatHistory || []);
    } else if (type === 'generate-summary') {
      generatedText = await generateSummary(content);
    } else {
      throw new Error(`Unknown generation type: ${type}`);
    }
    
    console.log(`Generated text length: ${generatedText.length}`);
    
    return new Response(
      JSON.stringify({ generatedText }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-content function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

async function generateQuestions(content: string, numQuestions: number): Promise<string> {
  console.log(`Generating ${numQuestions} questions from content of length ${content.length}`);
  
  // For demonstration purposes, we're generating simple questions
  // In a production environment, this would connect to a more sophisticated AI service
  
  // Trim content to avoid exceeding token limits
  const trimmedContent = content.length > 10000 ? content.substring(0, 10000) + "..." : content;
  
  // Improved prompt for better questions
  const prompt = `
  You are an expert educator with deep knowledge across various fields. 
  
  Based on the study material below, generate ${numQuestions} challenging but clear questions that test conceptual understanding, not just memorization. 
  
  For each question:
  1. Focus on key concepts and critical thinking
  2. Provide a comprehensive, detailed answer that explains the underlying principles
  3. Format consistently with "Question:" followed by the question and "Answer:" followed by a thorough explanation
  4. Create answers that are at least 3-4 sentences and provide depth
  5. Ensure questions require understanding rather than simple recall
  6. Include a mix of question types (conceptual, comparative, application, etc.)
  
  Study Material:
  ${trimmedContent}
  
  Format your response exactly as in this example:
  
  Question: [Conceptual question about a key topic]
  Answer: [Detailed, multi-sentence explanation that thoroughly addresses the question and provides deeper insights]
  
  Question: [Another question focusing on a different aspect]
  Answer: [Comprehensive explanation with specific examples from the content]
  `;
  
  // Mock question generation for demo purposes
  // In a real application, this would call an AI service API
  const generatedQuestions = await mockAIGeneration(prompt, numQuestions);
  
  return generatedQuestions;
}

async function answerQuestion(
  content: string, 
  query: string, 
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>
): Promise<string> {
  // For demo purposes, we'll return a simple response
  // In a real application, this would process the query against the content
  
  const trimmedContent = content.length > 8000 ? content.substring(0, 8000) + "..." : content;
  
  const prompt = `
  You are an expert tutor helping a student understand study material.
  
  Study Material: ${trimmedContent}
  
  Previous conversation:
  ${chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}
  
  Student's Question: ${query}
  
  Provide a clear, informative answer based specifically on the study material. If the information isn't present in the material, politely state that and suggest what related concepts might be helpful.
  `;
  
  // Mock answer generation
  const answer = await mockAIGeneration(prompt, 1, true);
  
  return answer;
}

async function generateSummary(content: string): Promise<string> {
  const trimmedContent = content.length > 10000 ? content.substring(0, 10000) + "..." : content;
  
  const prompt = `
  Summarize the following study material in a concise but comprehensive way:
  ${trimmedContent}
  
  Your summary should:
  1. Identify and explain the main concepts
  2. Highlight key relationships between ideas
  3. Retain the most important details
  4. Be organized in a logical structure
  `;
  
  // Mock summary generation
  const summary = await mockAIGeneration(prompt, 1, true);
  
  return summary;
}

async function mockAIGeneration(prompt: string, numItems: number, isSingleResponse: boolean = false): Promise<string> {
  console.log(`Mock AI generating ${numItems} items with prompt length ${prompt.length}`);
  
  // This function simulates what an actual AI service would do
  // Extract potential topics from the prompt (simplified approach)
  const content = prompt.split("Study Material:")[1] || prompt;
  const words = content.split(/\s+/).filter(word => word.length > 4);
  const uniqueWords = [...new Set(words)].sort(() => Math.random() - 0.5);
  
  if (isSingleResponse) {
    // Generate a coherent mock response
    return generateMockResponse(uniqueWords);
  }
  
  // For questions, generate numItems question-answer pairs
  let result = "";
  
  for (let i = 0; i < numItems; i++) {
    // Select different words for each question to create variety
    const questionWords = uniqueWords.slice(i * 5, (i + 1) * 5);
    const question = generateMockQuestion(questionWords, i);
    const answer = generateMockAnswer(questionWords, question);
    
    result += `Question: ${question}\nAnswer: ${answer}\n\n`;
  }
  
  return result.trim();
}

function generateMockQuestion(words: string[], questionIndex: number): string {
  // Create more sophisticated mock questions based on the content words
  const questionTypes = [
    `What is the significance of ${words[0]} in relation to ${words[1]}?`,
    `How does ${words[0]} contribute to our understanding of ${words[1]}?`,
    `Compare and contrast ${words[0]} and ${words[1]} in the context of ${words[2] || "this topic"}.`,
    `Explain the process of ${words[0]} and its impact on ${words[1]}.`,
    `What are the key factors that influence ${words[0]}?`,
    `Analyze the relationship between ${words[0]} and ${words[1]}.`,
    `What would happen if ${words[0]} changed in the context of ${words[1]}?`,
    `How might ${words[0]} be applied to solve problems related to ${words[1]}?`,
    `What evidence supports the connection between ${words[0]} and ${words[1]}?`,
    `Why is ${words[0]} considered important in the field of ${words[1]}?`
  ];
  
  // Select a question type based on the question index (to ensure variety)
  const questionType = questionTypes[questionIndex % questionTypes.length];
  
  return questionType;
}

function generateMockAnswer(words: string[], question: string): string {
  // Create more detailed and educational mock answers
  const phrases = [
    `${words[0]} plays a crucial role in ${words[1]} because it establishes the foundation for how we understand related concepts like ${words[2] || "related topics"}. Research has consistently shown that ${words[0]} affects multiple aspects of ${words[1]}, particularly when considering long-term outcomes and practical applications.`,
    
    `The relationship between ${words[0]} and ${words[1]} represents one of the most significant developments in this field. When we examine ${words[0]} carefully, we discover that it contains several important components that directly influence ${words[1]}. This connection has been verified through multiple studies and practical observations.`,
    
    `To properly understand ${words[0]}, we must consider both its theoretical framework and practical applications. In contexts involving ${words[1]}, ${words[0]} demonstrates remarkable adaptability and influence. This is particularly evident when examining case studies where ${words[0]} has been systematically applied to solve problems related to ${words[1]}.`,
    
    `${words[0]} represents a fundamental concept that has evolved significantly over time. Its relationship with ${words[1]} highlights important principles that apply across multiple domains. When analyzing this relationship, we should consider both the direct effects and secondary implications that emerge from their interaction.`,
    
    `The significance of ${words[0]} cannot be overstated when discussing ${words[1]}. This is because ${words[0]} provides essential context that helps explain why certain patterns emerge in ${words[1]}. Experts in the field have identified at least three critical ways that ${words[0]} influences outcomes related to ${words[1]}.`
  ];
  
  // Select a base answer format randomly
  const baseAnswer = phrases[Math.floor(Math.random() * phrases.length)];
  
  // Add a second paragraph for more depth
  const secondParagraph = `Furthermore, when examining ${words[0]} in different contexts, we can observe how its characteristics change in response to various factors. This adaptability makes ${words[0]} particularly relevant when studying ${words[1]} and similar topics. Recent developments have also shown promising applications in areas previously not associated with either ${words[0]} or ${words[1]}.`;
  
  return `${baseAnswer}\n\n${secondParagraph}`;
}

function generateMockResponse(words: string[]): string {
  // Create a coherent mock response for chat or summary
  const selectedWords = words.slice(0, 10);
  
  const paragraphs = [
    `When analyzing ${selectedWords[0]}, it's important to consider its relationship with ${selectedWords[1]} and ${selectedWords[2]}. These connections form the foundation of how we understand this topic. ${selectedWords[3]} also plays a significant role in this context, particularly when examining practical applications.`,
    
    `The concept of ${selectedWords[4]} has evolved considerably over time. Initially, it was primarily associated with ${selectedWords[5]}, but research has expanded its scope to include aspects of ${selectedWords[6]} as well. This broader understanding has led to more comprehensive approaches to the subject matter.`,
    
    `When considering real-world implications, ${selectedWords[7]} stands out as a key factor that influences outcomes. Studies have demonstrated that environments rich in ${selectedWords[8]} tend to produce more favorable results, especially when ${selectedWords[9]} is also present. This suggests potential strategies for optimization and improvement in various contexts.`,
    
    `Looking forward, future developments in this area will likely focus on better integrating these concepts and exploring their applications in new domains. This represents an exciting frontier for both research and practical implementation.`
  ];
  
  return paragraphs.join("\n\n");
}
