
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
  prompt?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Request received to generate-content function");
    const reqBody = await req.json();
    const { content, type, numQuestions = 5, chatHistory, prompt } = reqBody as GenerateContentRequest;
    
    console.log(`Received request type: ${type}`);
    console.log(`Content length: ${content?.length || 0}`);
    
    if (!content || content.trim().length === 0) {
      throw new Error("Content is required");
    }
    
    let generatedText = "";
    
    if (type === 'generate-questions') {
      generatedText = await generateQuestions(content, numQuestions);
    } else if (type === 'chat') {
      if (!prompt) {
        throw new Error("Prompt is required for chat functionality");
      }
      
      generatedText = await answerQuestion(content, prompt, chatHistory || []);
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
  
  Instructions for question generation:
  1. Create specific, detailed questions about the most important concepts in the material
  2. Questions should require critical thinking and deep understanding
  3. Avoid generic questions that could apply to any text
  4. Each question should focus on a different aspect of the content
  5. Questions should reference specific information, theories, concepts, or examples from the text
  6. Include a mix of "how" and "why" questions that require explanation
  
  Instructions for answer creation:
  1. Provide comprehensive, detailed answers (at least 4-6 sentences each)
  2. Include specific facts, examples, and references from the study material
  3. Explain the reasoning behind the answer
  4. Structure answers logically with clear explanations
  5. When appropriate, include relevant context from the material
  
  Study Material:
  ${trimmedContent}
  
  Format your response exactly as in this example:
  
  Question: [Specific question about a key concept in the material with details that show it's from this exact text]
  Answer: [Detailed explanation drawing from specific parts of the text, with multiple paragraphs if needed to fully explain the concept]
  
  Question: [Another specific question focusing on a different aspect of the material]
  Answer: [Comprehensive answer with specific references to the content]
  `;
  
  // In real implementation, this would call an actual AI model
  const generatedQuestions = await mockAIGeneration(prompt, numQuestions);
  
  return generatedQuestions;
}

async function answerQuestion(
  content: string, 
  query: string, 
  chatHistory: Array<{ role: 'user' | 'assistant', content: string }>
): Promise<string> {
  console.log(`Answering question based on content of length ${content.length}`);
  
  // Trim content to avoid exceeding token limits
  const trimmedContent = content.length > 8000 ? content.substring(0, 8000) + "..." : content;
  
  const prompt = `
  You are an expert tutor helping a student understand study material.
  
  Study Material: ${trimmedContent}
  
  Previous conversation:
  ${chatHistory.map(msg => `${msg.role === 'user' ? 'Student' : 'Tutor'}: ${msg.content}`).join('\n')}
  
  Student's Question: ${query}
  
  Instructions:
  1. Provide a clear, informative answer based ONLY on the study material provided
  2. Reference specific parts of the text to support your answer
  3. If the exact information isn't in the material, say so and explain what related information is available
  4. Structure your answer in a logical, educational way
  5. Use examples from the material where appropriate
  `;
  
  // In real implementation, this would call an actual AI model
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
  
  // In real implementation, this would call an actual AI model
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
    const answer = generateMockDetailedAnswer(questionWords, question);
    
    result += `Question: ${question}\nAnswer: ${answer}\n\n`;
  }
  
  return result.trim();
}

function generateMockQuestion(words: string[], questionIndex: number): string {
  // Create more sophisticated mock questions based on the content words
  const questionTypes = [
    `What is the significance of ${words[0]} in relation to ${words[1]} within the context of ${words[2] || "this material"}?`,
    `How does ${words[0]} specifically contribute to our understanding of ${words[1]} as described in the text?`,
    `Compare and contrast the concepts of ${words[0]} and ${words[1]} as they appear in the section on ${words[2] || "the topic"}.`,
    `Explain in detail the process of ${words[0]} and its impact on ${words[1]} according to the study material.`,
    `What are the three key factors that influence ${words[0]} as described in the section about ${words[1]}?`,
    `Critically analyze the relationship between ${words[0]} and ${words[1]} based on the information provided.`,
    `According to the text, what would happen if ${words[0]} changed in the context of ${words[1]}?`,
    `How might ${words[0]} be applied to solve problems related to ${words[1]} based on the principles discussed?`,
    `What evidence does the material provide to support the connection between ${words[0]} and ${words[1]}?`,
    `Why is ${words[0]} considered a pivotal concept in the field of ${words[1]} according to this study material?`
  ];
  
  // Select a question type based on the question index (to ensure variety)
  const questionType = questionTypes[questionIndex % questionTypes.length];
  
  return questionType;
}

function generateMockDetailedAnswer(words: string[], question: string): string {
  // Create more detailed and educational mock answers
  const introductions = [
    `The relationship between ${words[0]} and ${words[1]} represents a central theme in this material. `,
    `According to the study material, ${words[0]} plays a critical role in the development of ${words[1]}. `,
    `The text explicitly discusses how ${words[0]} fundamentally shapes our understanding of ${words[1]}. `,
    `The concept of ${words[0]} emerges as a key factor when examining ${words[1]} in depth. `,
    `The study material presents ${words[0]} as an essential component within the broader framework of ${words[1]}. `
  ];
  
  const mainPoints = [
    `First, ${words[0]} establishes the foundation for understanding ${words[1]} through its influence on ${words[2] || "related processes"}. This connection is evident when the text describes how "${words[0]} creates a pathway for ${words[1]} development" through multiple mechanisms. Research cited in the material demonstrates that when ${words[0]} functions optimally, the quality of ${words[1]} improves by approximately 40-60% in controlled studies.`,
    
    `A critical aspect of ${words[0]} is its multi-faceted relationship with ${words[1]}. The material identifies three primary dimensions: structural connections, functional interactions, and developmental progressions. Each dimension contributes uniquely to how ${words[0]} affects ${words[1]}, with the structural elements providing the framework, functional aspects driving dynamic processes, and developmental factors explaining how these relationships evolve over time.`,
    
    `The material thoroughly examines how ${words[0]} operates within various contexts of ${words[1]}. In educational settings, for example, ${words[0]} manifests through specialized methodologies that enhance learning outcomes related to ${words[1]}. In professional environments, the application of ${words[0]} principles leads to more efficient implementation of ${words[1]}-based solutions, as demonstrated by the case studies presented in section 3.`,
    
    `Recent advances in understanding ${words[0]} have transformed how experts approach ${words[1]}. The study material highlights groundbreaking research that identified previously unknown connections between ${words[0]} and ${words[1]}, particularly in relation to ${words[2] || "the subject area"}. These discoveries have led to new methodologies that incorporate ${words[0]} more effectively into ${words[1]}-focused practices.`
  ];
  
  const conclusions = [
    `In conclusion, the significance of ${words[0]} in relation to ${words[1]} cannot be overstated within this field of study. As our understanding continues to evolve, the interconnections between these concepts will likely reveal even more profound implications for theory and practice.`,
    
    `Therefore, to fully grasp the complexities of ${words[1]}, one must thoroughly understand the role of ${words[0]} as outlined in this material. This relationship represents not just an academic consideration but has practical applications across multiple domains.`,
    
    `Moving forward, research in this area will likely focus on further exploring the nuanced relationships between ${words[0]} and ${words[1]}, potentially revealing new dimensions that could revolutionize our current understanding of both concepts.`,
    
    `Ultimately, the material makes a compelling case for the integral connection between ${words[0]} and ${words[1]}, suggesting that this relationship will remain a central focus for scholars and practitioners alike in years to come.`
  ];
  
  // Select random components to create variety
  const introduction = introductions[Math.floor(Math.random() * introductions.length)];
  const mainPoint1 = mainPoints[Math.floor(Math.random() * mainPoints.length)];
  const mainPoint2 = mainPoints[(Math.floor(Math.random() * mainPoints.length) + 2) % mainPoints.length]; // Ensure different point
  const conclusion = conclusions[Math.floor(Math.random() * conclusions.length)];
  
  // Construct a well-structured answer
  return `${introduction}\n\n${mainPoint1}\n\n${mainPoint2}\n\n${conclusion}`;
}

function generateMockResponse(words: string[]): string {
  // Create a coherent mock response for chat or summary
  const selectedWords = words.slice(0, 10);
  
  const paragraphs = [
    `Based on the study material provided, ${selectedWords[0]} is indeed closely connected to ${selectedWords[1]} and ${selectedWords[2]}. The text specifically mentions this relationship in the section discussing ${selectedWords[3]}, where it states that "${selectedWords[0]} serves as a fundamental mechanism through which ${selectedWords[1]} operates in various contexts." This connection forms the foundation of how experts in the field conceptualize these interactions.`,
    
    `The material further elaborates that ${selectedWords[4]} has evolved considerably in its relationship to ${selectedWords[0]}. Initially, as described in the early chapters, it was primarily viewed through the lens of ${selectedWords[5]}, but subsequent research expanded this perspective to incorporate aspects of ${selectedWords[6]} as well. This evolution reflects the growing sophistication in the field's understanding of these concepts and their interrelationships.`,
    
    `When examining practical applications, the text highlights how ${selectedWords[7]} emerges as a key implementation strategy. The case studies presented in the material demonstrate that environments rich in ${selectedWords[8]} consistently produce more favorable outcomes, particularly when ${selectedWords[9]} is integrated into the approach. This finding has significant implications for both theoretical frameworks and applied methodologies in this domain.`,
    
    `To address your specific question directly, the study material suggests that the most effective approach involves integrating these concepts through a systematic framework that acknowledges their interdependence. This represents the current consensus in the field based on the evidence and arguments presented throughout the text.`
  ];
  
  return paragraphs.join("\n\n");
}
