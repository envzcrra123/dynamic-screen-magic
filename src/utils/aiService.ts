
// Define the interface for AI responses
export interface AIResponse {
  message: string;
  isError: boolean;
}

// Simple medical knowledge base
const medicalResponses: Record<string, string[]> = {
  'headache': [
    'Headaches can be caused by stress, dehydration, lack of sleep, or eye strain. For mild headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe or persistent, please consult a healthcare professional.',
    'Your headache symptoms might be related to tension, migraines, or other factors. It\'s advisable to monitor your triggers such as diet, stress levels, and sleep patterns.',
  ],
  'fever': [
    'Fever is often a sign that your body is fighting an infection. Rest, fluids, and appropriate medication to reduce fever may help. If fever is high (above 103°F/39.4°C for adults) or persists for more than a few days, seek medical attention.',
    'A fever typically indicates your immune system is responding to an infection or illness. Monitor your temperature, stay hydrated, and consult a doctor if it persists or is accompanied by other concerning symptoms.',
  ],
  'cough': [
    'Coughs can be caused by viruses, allergies, or irritants. For dry coughs, staying hydrated and using cough drops may help. For productive coughs, expectorants might be beneficial. If coughing persists or is accompanied by difficulty breathing, consult a healthcare provider.',
    'Your cough could be related to a respiratory infection, allergies, or irritation. Pay attention to any accompanying symptoms like fever or mucus production, which can help determine the cause.',
  ],
  'stomachache': [
    'Stomach pain can result from indigestion, gas, food poisoning, or more serious conditions. Mild cases may respond to rest, clear fluids, and over-the-counter remedies. If pain is severe, persistent, or accompanied by other concerning symptoms, seek medical advice.',
    'Abdominal pain has many potential causes ranging from digestive issues to inflammation. Consider any recent dietary changes and whether the pain is localized or general.',
  ],
  'rash': [
    'Rashes may be caused by allergies, infections, heat, or skin conditions. Keeping the area clean and dry, using mild soaps, and applying appropriate ointments may help. If a rash is widespread, painful, or doesn\'t improve, consult a dermatologist.',
    'Skin rashes can result from contact with irritants, allergic reactions, or underlying health conditions. Note when the rash appeared and any possible triggers to help identify the cause.',
  ],
  'dizziness': [
    'Dizziness can be related to inner ear issues, low blood pressure, dehydration, or medication side effects. Sitting or lying down when feeling dizzy and staying hydrated may help. For recurrent or severe dizziness, medical evaluation is recommended.',
    'Feeling dizzy or lightheaded might be due to various factors including vestibular issues, blood pressure changes, or dehydration. Take note of when symptoms occur and what seems to trigger or relieve them.',
  ],
};

// Keywords to match in user queries
const symptomKeywords = Object.keys(medicalResponses);

// General responses when no specific symptom is matched
const generalResponses = [
  'Based on the information provided, it would be best to consult with a healthcare professional for a proper diagnosis. Remember that online information cannot replace personalized medical advice.',
  'I understand your concern about these symptoms. While I can provide general information, a healthcare provider would be best positioned to evaluate your specific situation.',
  'The symptoms you\'ve described could be related to several different conditions. Monitoring your symptoms and consulting with a medical professional would be the most appropriate next step.',
  'Thank you for sharing your health concerns. For a comprehensive assessment, I recommend discussing these symptoms with a healthcare provider who can perform necessary examinations or tests.',
  'While I can offer general health information, your described symptoms should be evaluated by a medical professional for an accurate diagnosis and appropriate treatment recommendations.',
];

// Function to find the most relevant response based on keywords
const findRelevantResponse = (prompt: string): string => {
  const lowercasePrompt = prompt.toLowerCase();
  
  // Check for symptom keywords in the prompt
  for (const symptom of symptomKeywords) {
    if (lowercasePrompt.includes(symptom)) {
      const responses = medicalResponses[symptom];
      // Return a random response from the matched symptom
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }
  
  // If no specific symptoms matched, return a general response
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    // Simulate processing time to make it feel like an AI is thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a response based on the medical knowledge base
    const response = findRelevantResponse(prompt);
    
    return {
      message: response + '\n\nDisclaimer: This information is for educational purposes only and should not be used for self-diagnosis or as a substitute for professional medical advice.',
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
