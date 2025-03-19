// Define the interface for AI responses
export interface AIResponse {
  message: string;
  isError: boolean;
}

// Define a more structured medical knowledge base
interface MedicalCondition {
  keywords: string[];
  responses: string[];
  severity: 'low' | 'medium' | 'high';
  followUpQuestions?: string[];
}

// Enhanced medical knowledge base with more structured data
const medicalKnowledgeBase: Record<string, MedicalCondition> = {
  headache: {
    keywords: ['headache', 'migraine', 'head pain', 'head ache', 'head hurts'],
    responses: [
      'Headaches can be caused by stress, dehydration, lack of sleep, or eye strain. For mild headaches, rest, hydration, and over-the-counter pain relievers may help. If headaches are severe or persistent, please consult a healthcare professional.',
      'Your headache symptoms might be related to tension, migraines, or other factors. It\'s advisable to monitor your triggers such as diet, stress levels, and sleep patterns.',
      'Frequent headaches could indicate various conditions ranging from tension to more serious concerns. Consider the pattern, intensity, and any accompanying symptoms when discussing with a healthcare provider.'
    ],
    severity: 'medium',
    followUpQuestions: ['How long have you been experiencing headaches?', 'Are the headaches accompanied by other symptoms like nausea or sensitivity to light?']
  },
  fever: {
    keywords: ['fever', 'high temperature', 'feeling hot', 'chills', 'sweating'],
    responses: [
      'Fever is often a sign that your body is fighting an infection. Rest, fluids, and appropriate medication to reduce fever may help. If fever is high (above 103°F/39.4°C for adults) or persists for more than a few days, seek medical attention.',
      'A fever typically indicates your immune system is responding to an infection or illness. Monitor your temperature, stay hydrated, and consult a doctor if it persists or is accompanied by other concerning symptoms.',
      'Fever combined with other symptoms like cough, sore throat, or body aches might indicate a viral or bacterial infection. If symptoms worsen or don\'t improve within a few days, medical attention is recommended.'
    ],
    severity: 'medium',
    followUpQuestions: ['What is your current temperature?', 'Have you taken any medication to reduce the fever?']
  },
  cough: {
    keywords: ['cough', 'coughing', 'hack', 'chest congestion', 'phlegm', 'mucus'],
    responses: [
      'Coughs can be caused by viruses, allergies, or irritants. For dry coughs, staying hydrated and using cough drops may help. For productive coughs, expectorants might be beneficial. If coughing persists or is accompanied by difficulty breathing, consult a healthcare provider.',
      'Your cough could be related to a respiratory infection, allergies, or irritation. Pay attention to any accompanying symptoms like fever or mucus production, which can help determine the cause.',
      'A persistent cough lasting more than 2-3 weeks should be evaluated by a healthcare professional, especially if it produces colored phlegm or blood, or is accompanied by shortness of breath.'
    ],
    severity: 'medium',
    followUpQuestions: ['Is your cough productive (bringing up mucus) or dry?', 'Have you noticed any triggers that make the cough worse?']
  },
  stomachache: {
    keywords: ['stomachache', 'stomach pain', 'abdominal pain', 'tummy ache', 'gut pain', 'nausea', 'vomiting'],
    responses: [
      'Stomach pain can result from indigestion, gas, food poisoning, or more serious conditions. Mild cases may respond to rest, clear fluids, and over-the-counter remedies. If pain is severe, persistent, or accompanied by other concerning symptoms, seek medical advice.',
      'Abdominal pain has many potential causes ranging from digestive issues to inflammation. Consider any recent dietary changes and whether the pain is localized or general.',
      'If your stomach pain is accompanied by fever, persistent vomiting, or inability to keep fluids down, these could be signs of a more serious condition requiring prompt medical attention.'
    ],
    severity: 'medium',
    followUpQuestions: ['Where exactly is the pain located?', 'Does the pain come and go, or is it constant?']
  },
  rash: {
    keywords: ['rash', 'skin irritation', 'hives', 'itchy skin', 'red spots', 'skin outbreak'],
    responses: [
      'Rashes may be caused by allergies, infections, heat, or skin conditions. Keeping the area clean and dry, using mild soaps, and applying appropriate ointments may help. If a rash is widespread, painful, or doesn\'t improve, consult a dermatologist.',
      'Skin rashes can result from contact with irritants, allergic reactions, or underlying health conditions. Note when the rash appeared and any possible triggers to help identify the cause.',
      'If your rash is spreading rapidly, accompanied by fever, or causing significant discomfort, these could indicate a more serious condition requiring prompt medical evaluation.'
    ],
    severity: 'medium',
    followUpQuestions: ['When did you first notice the rash?', 'Is the rash itchy, painful, or neither?']
  },
  dizziness: {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'faint', 'balance problems'],
    responses: [
      'Dizziness can be related to inner ear issues, low blood pressure, dehydration, or medication side effects. Sitting or lying down when feeling dizzy and staying hydrated may help. For recurrent or severe dizziness, medical evaluation is recommended.',
      'Feeling dizzy or lightheaded might be due to various factors including vestibular issues, blood pressure changes, or dehydration. Take note of when symptoms occur and what seems to trigger or relieve them.',
      'Persistent or severe dizziness, especially when accompanied by other neurological symptoms like headache, vision changes, or difficulty speaking, should prompt immediate medical attention.'
    ],
    severity: 'medium',
    followUpQuestions: ['Does the dizziness occur when changing positions?', 'Have you experienced any hearing changes along with the dizziness?']
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'exhaustion', 'no energy', 'lethargy', 'weakness'],
    responses: [
      'Fatigue can result from inadequate sleep, poor nutrition, stress, or underlying medical conditions. Ensuring proper rest, balanced diet, and regular exercise may help. If fatigue is severe or persistent despite lifestyle changes, consider consulting a healthcare provider.',
      'Unexplained or persistent fatigue might be linked to various factors including anemia, thyroid issues, depression, or chronic conditions. Tracking your energy levels and any associated symptoms can provide valuable information for assessment.',
      'When fatigue significantly interferes with daily activities or is accompanied by other symptoms like unexplained weight loss or fever, it\'s important to seek medical evaluation to rule out serious conditions.'
    ],
    severity: 'medium',
    followUpQuestions: ['Has your fatigue developed gradually or suddenly?', 'How is your sleep quality and duration?']
  },
  sore_throat: {
    keywords: ['sore throat', 'throat pain', 'painful swallowing', 'strep', 'scratchy throat'],
    responses: [
      'Sore throats are commonly caused by viral infections like colds or flu, but can also result from bacterial infections, allergies, or environmental irritants. Gargling with warm salt water, using throat lozenges, and staying hydrated may provide relief for minor cases.',
      'If your sore throat is severe, persists longer than a week, or is accompanied by high fever, difficulty swallowing, or enlarged lymph nodes, it might indicate a bacterial infection like strep throat that requires medical attention.',
      'Repeated or chronic sore throats might be related to issues such as allergies, acid reflux, or environmental factors. Identifying and addressing these underlying causes can help prevent recurrence.'
    ],
    severity: 'medium',
    followUpQuestions: ['Is the pain on one side or both sides of your throat?', 'Have you noticed any white patches in your throat?']
  },
  breathing: {
    keywords: ['breathing difficulty', 'shortness of breath', 'can\'t breathe', 'breathless', 'wheezing'],
    responses: [
      'Difficulty breathing requires prompt medical attention, especially if it's sudden or severe. It can be caused by asthma, allergic reactions, infections, or heart problems.',
      'If you're experiencing breathing difficulties along with chest pain, blue lips or fingers, or extreme anxiety, please seek emergency medical care immediately.',
      'For milder, chronic breathing issues, triggers may include allergens, exercise, stress, or environmental factors. Working with a healthcare provider to identify and manage these triggers is important.'
    ],
    severity: 'high',
    followUpQuestions: ['Did the breathing difficulty start suddenly or gradually?', 'Does anything make the breathing easier or worse?']
  },
  chest_pain: {
    keywords: ['chest pain', 'chest tightness', 'heart pain', 'pressure in chest'],
    responses: [
      'Chest pain can be serious and requires immediate medical attention, especially if accompanied by shortness of breath, sweating, nausea, or pain radiating to the arm or jaw, as these may indicate a heart attack.',
      'Not all chest pain is heart-related - it can also be caused by muscle strain, digestive issues like acid reflux, or anxiety. However, it\'s always safest to have chest pain evaluated by a medical professional.',
      'If you\'re experiencing chest pain, don\'t wait to seek help or try to diagnose yourself. Call emergency services or have someone take you to the nearest emergency department immediately.'
    ],
    severity: 'high',
    followUpQuestions: ['Is the pain sharp, dull, or pressure-like?', 'Does the pain spread to your arm, jaw, or back?']
  }
};

// Enhanced general responses
const generalResponses = [
  'Based on the information provided, it would be best to consult with a healthcare professional for a proper diagnosis. Remember that online information cannot replace personalized medical advice.',
  'I understand your concern about these symptoms. While I can provide general information, a healthcare provider would be best positioned to evaluate your specific situation.',
  'The symptoms you\'ve described could be related to several different conditions. Monitoring your symptoms and consulting with a medical professional would be the most appropriate next step.',
  'Thank you for sharing your health concerns. For a comprehensive assessment, I recommend discussing these symptoms with a healthcare provider who can perform necessary examinations or tests.',
  'While I can offer general health information, your described symptoms should be evaluated by a medical professional for an accurate diagnosis and appropriate treatment recommendations.',
  'It\'s important to note that individual health situations vary greatly. The information I provide is general in nature, and your specific symptoms may require personalized medical attention.',
];

// Training data for simple pattern recognition
const trainingPatterns = [
  { pattern: /(how|what) (can|should|do) (i|you|we) (do|use|take) for/i, responseType: 'treatment' },
  { pattern: /(is|are) (this|it|these) (serious|dangerous|concerning)/i, responseType: 'severity' },
  { pattern: /(how long|when) (will|should|does) (it|this|symptoms) (last|improve|get better)/i, responseType: 'duration' },
  { pattern: /(should|do) (i|we) (see|visit|call) (a|the) doctor/i, responseType: 'medical_advice' },
  { pattern: /(what|which) (causes|is causing) (this|my|these)/i, responseType: 'cause' },
];

// Response templates for different question types
const responseTemplates = {
  treatment: 'Treatment options may include {treatments}. However, it\'s important to consult with a healthcare provider before starting any treatment.',
  severity: 'The severity of {condition} can vary widely. {severity_info}',
  duration: '{condition} typically {duration_info}. If symptoms persist beyond this timeframe, medical evaluation is recommended.',
  medical_advice: 'For {condition}, it\'s advisable to seek medical attention {when_to_see_doctor}.',
  cause: '{condition} can be caused by {causes}. Identifying specific triggers in your case may help with management.'
};

// Function to find matching conditions based on keywords
const findMatchingConditions = (prompt: string): string[] => {
  const lowercasePrompt = prompt.toLowerCase();
  const matchingConditions: string[] = [];
  
  // Check each condition for keyword matches
  for (const [condition, data] of Object.entries(medicalKnowledgeBase)) {
    for (const keyword of data.keywords) {
      if (lowercasePrompt.includes(keyword)) {
        matchingConditions.push(condition);
        break; // Found a match for this condition, move to next
      }
    }
  }
  
  return matchingConditions;
};

// Function to analyze question type
const analyzeQuestionType = (prompt: string): string | null => {
  for (const pattern of trainingPatterns) {
    if (pattern.pattern.test(prompt)) {
      return pattern.responseType;
    }
  }
  return null;
};

// Function to generate a comprehensive response
const generateResponse = (prompt: string): string => {
  const matchingConditions = findMatchingConditions(prompt);
  const questionType = analyzeQuestionType(prompt);
  
  // If we have matching conditions
  if (matchingConditions.length > 0) {
    // Get a random matching condition if multiple matches
    const condition = matchingConditions[Math.floor(Math.random() * matchingConditions.length)];
    const conditionData = medicalKnowledgeBase[condition];
    
    // If question type is identified, use appropriate template
    if (questionType && responseTemplates[questionType as keyof typeof responseTemplates]) {
      // This is a simple placeholder - in a real system, we'd have more sophisticated filling of templates
      return `Based on your mention of ${condition}, I can provide some information.

${conditionData.responses[Math.floor(Math.random() * conditionData.responses.length)]}

${conditionData.severity === 'high' ? 'This condition may require prompt medical attention.' : 
  conditionData.severity === 'medium' ? 'This condition may require medical attention if symptoms persist or worsen.' :
  'This condition is typically manageable with self-care, but consult a doctor if concerned.'}`;
    }
    
    // Otherwise return a general response about the condition
    return conditionData.responses[Math.floor(Math.random() * conditionData.responses.length)];
  }
  
  // If no condition matched, return a general response
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

// Function to track conversation context (very basic implementation)
let conversationContext = {
  lastMentionedCondition: '',
  questionCount: 0,
  lastResponseTime: 0
};

export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    // Update conversation context
    conversationContext.questionCount++;
    conversationContext.lastResponseTime = Date.now();
    
    // Simulate processing time (longer for first question, shorter for follow-ups)
    const processingTime = conversationContext.questionCount === 1 ? 1500 : 800;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generate response based on enhanced knowledge base
    const response = generateResponse(prompt);
    
    // Update the last mentioned condition if we found matches
    const matchingConditions = findMatchingConditions(prompt);
    if (matchingConditions.length > 0) {
      conversationContext.lastMentionedCondition = matchingConditions[0];
    }
    
    // Add a follow-up question if appropriate and we have one for this condition
    let followUpText = '';
    if (conversationContext.lastMentionedCondition && 
        medicalKnowledgeBase[conversationContext.lastMentionedCondition].followUpQuestions) {
      const followUps = medicalKnowledgeBase[conversationContext.lastMentionedCondition].followUpQuestions;
      if (followUps && followUps.length > 0) {
        followUpText = `\n\nTo better understand your situation: ${followUps[Math.floor(Math.random() * followUps.length)]}`;
      }
    }
    
    return {
      message: response + followUpText + '\n\nDisclaimer: This information is for educational purposes only and should not be used for self-diagnosis or as a substitute for professional medical advice.',
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
