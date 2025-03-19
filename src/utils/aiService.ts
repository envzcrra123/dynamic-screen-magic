
import { pipeline, env } from '@huggingface/transformers';

// Set the environment to use HTTP requests to fetch models
env.allowLocalModels = false;
env.useBrowserCache = true;

let model: any = null;

// Define the interface for AI responses
export interface AIResponse {
  message: string;
  isError: boolean;
}

// Initialize the model
const initializeModel = async () => {
  try {
    if (model === null) {
      // Loading progress callback (optional)
      const progressCallback = (progress: { status: string; progress?: number; }) => {
        console.log(`Model loading: ${progress.status} ${progress.progress ? Math.round(progress.progress * 100) + '%' : ''}`);
      };

      // Initialize the model with a small text-generation model suitable for medical Q&A
      model = await pipeline(
        'text-generation',
        'gpt2', // Using a basic model - in a real app you'd use a medical-specific model
        { progress_callback: progressCallback }
      );
      
      console.log('Model loaded successfully');
      return true;
    }
    return true;
  } catch (error) {
    console.error('Failed to load model:', error);
    return false;
  }
};

export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    // Attempt to initialize the model if not already done
    const isModelReady = await initializeModel();
    
    if (!isModelReady) {
      return {
        message: 'The AI model is still loading or failed to load. Please try again in a moment.',
        isError: true
      };
    }

    // Prepare a medical-focused prompt
    const medicalPrompt = `As a helpful medical assistant, please provide information about the following medical question or symptom: ${prompt}\n\nResponse:`;
    
    // Generate response
    const result = await model(medicalPrompt, {
      max_new_tokens: 150,
      temperature: 0.7,
      top_p: 0.95,
      repetition_penalty: 1.2,
    });

    // Extract the generated text
    const generatedText = result[0].generated_text.substring(medicalPrompt.length);
    
    // Clean up the response
    const cleanedResponse = generatedText
      .replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
      .split('\n')[0]; // Take only the first paragraph
    
    return {
      message: cleanedResponse || 'I cannot provide a specific diagnosis, but I can offer general information. Please consult with a healthcare professional for personalized medical advice.',
      isError: false
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      message: 'Sorry, there was an error generating a response. Please try again later.',
      isError: true
    };
  }
};
