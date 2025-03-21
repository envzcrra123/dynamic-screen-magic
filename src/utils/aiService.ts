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
      'Headaches are commonly associated with stress, dehydration, inadequate sleep, or visual strain. For mild cases, adequate rest, hydration, and appropriate analgesics are recommended. Severe or persistent headaches warrant clinical evaluation.',
      'Your headache presentation may be indicative of tension-type headache, migraine, or other underlying conditions. It is advisable to monitor potential triggers including dietary factors, stress levels, and sleep patterns.',
      'Recurrent headaches require comprehensive evaluation. Consider the pattern, intensity, and associated symptoms when consulting with your healthcare provider for proper diagnosis and management.'
    ],
    severity: 'medium',
    followUpQuestions: ['What is the duration of your headache symptoms?', 'Are there associated symptoms such as photophobia or nausea?']
  },
  fever: {
    keywords: ['fever', 'high temperature', 'feeling hot', 'chills', 'sweating'],
    responses: [
      'Fever indicates an immune response to potential infection. Treatment recommendations include adequate rest, hydration, and appropriate antipyretics. For temperatures exceeding 39.4°C (103°F) in adults or persistent fever beyond 72 hours, immediate medical consultation is indicated.',
      'Elevated body temperature typically represents an immunological response to infection. Monitor temperature regularly, maintain hydration, and consult a healthcare provider if fever persists or if accompanied by concerning clinical manifestations.',
      'Fever in conjunction with respiratory symptoms, pharyngitis, or myalgia may indicate viral or bacterial etiology. Clinical evaluation is recommended if symptoms persist beyond 48-72 hours or if there is significant deterioration.'
    ],
    severity: 'medium',
    followUpQuestions: ['What is your current temperature reading?', 'Have you administered any antipyretic medication?']
  },
  cough: {
    keywords: ['cough', 'coughing', 'hack', 'chest congestion', 'phlegm', 'mucus'],
    responses: [
      'Cough may result from viral infection, allergic response, or environmental irritants. For non-productive cough, adequate hydration and antitussives may provide relief. For productive cough, expectorants may be beneficial. Dyspnea or persistent cough warrants clinical evaluation.',
      'Your cough presentation may be associated with upper respiratory infection, allergic response, or bronchial irritation. Clinical correlation with accompanying symptoms such as fever or sputum production is valuable for determining etiology.',
      'Persistent cough exceeding 2-3 weeks duration requires medical assessment, particularly if productive of purulent sputum, hemoptysis, or accompanied by respiratory distress.'
    ],
    severity: 'medium',
    followUpQuestions: ['Is your cough productive or non-productive?', 'Have you identified any exacerbating factors?']
  },
  stomachache: {
    keywords: ['stomachache', 'stomach pain', 'abdominal pain', 'tummy ache', 'gut pain', 'nausea', 'vomiting'],
    responses: [
      'Abdominal pain may result from digestive dysfunction, gastroenteritis, or more significant pathology. Mild cases may respond to rest, clear fluid intake, and appropriate symptomatic treatment. Severe, persistent, or associated symptoms require prompt medical assessment.',
      'Epigastric discomfort has multiple potential etiologies ranging from gastritis to inflammatory processes. Consider recent dietary modifications and whether pain is localized or diffuse for diagnostic purposes.',
      'If abdominal pain is accompanied by pyrexia, persistent emesis, or inability to maintain hydration, these may indicate significant pathology requiring immediate clinical evaluation.'
    ],
    severity: 'medium',
    followUpQuestions: ['Can you precisely localize the pain?', 'Is the pain intermittent or constant in nature?']
  },
  rash: {
    keywords: ['rash', 'skin irritation', 'hives', 'itchy skin', 'red spots', 'skin outbreak'],
    responses: [
      'Dermatological manifestations may result from allergic response, infectious process, thermal influence, or dermatological conditions. Management includes maintaining skin hygiene, avoiding irritants, and applying appropriate topical preparations. Widespread, painful, or non-resolving eruptions require dermatological consultation.',
      'Cutaneous eruptions may result from contact with irritants, hypersensitivity reactions, or underlying systemic conditions. Documenting onset and potential precipitants will assist in identifying etiology.',
      'Rapidly progressing cutaneous manifestations, particularly when accompanied by pyrexia or significant discomfort, may indicate serious conditions requiring prompt medical evaluation.'
    ],
    severity: 'medium',
    followUpQuestions: ['When did you first observe the cutaneous manifestation?', 'Is the affected area pruritic, painful, or asymptomatic?']
  },
  dizziness: {
    keywords: ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'faint', 'balance problems'],
    responses: [
      'Vertigo or lightheadedness may relate to vestibular dysfunction, orthostatic hypotension, dehydration, or medication effect. Assuming a recumbent position when symptomatic and ensuring adequate hydration may provide relief. Recurrent or severe symptoms warrant medical evaluation.',
      'Sensations of lightheadedness or imbalance may result from various factors including vestibular disorders, hemodynamic changes, or fluid status. Documentation of precipitating factors and alleviating measures provides valuable clinical information.',
      'Persistent or severe dizziness, particularly when accompanied by neurological manifestations such as cephalgia, visual disturbances, or dysarthria, necessitates immediate medical attention.'
    ],
    severity: 'medium',
    followUpQuestions: ['Do positional changes precipitate symptoms?', 'Are there associated auditory changes with episodes of dizziness?']
  },
  fatigue: {
    keywords: ['fatigue', 'tired', 'exhaustion', 'no energy', 'lethargy', 'weakness'],
    responses: [
      'Fatigue may result from inadequate rest, nutritional deficiencies, psychological stressors, or underlying medical conditions. Ensuring proper sleep hygiene, balanced nutrition, and regular physical activity is recommended. Severe or persistent fatigue despite lifestyle modifications warrants clinical consultation.',
      'Unexplained or persistent fatigue may be associated with various conditions including anemia, thyroid dysfunction, mood disorders, or chronic illness. Tracking energy levels and associated symptomatology provides valuable diagnostic information.',
      'When fatigue significantly impairs daily functioning or presents with other concerning symptoms such as unexplained weight loss or pyrexia, comprehensive medical evaluation is essential to exclude serious underlying conditions.'
    ],
    severity: 'medium',
    followUpQuestions: ['Has your fatigue developed gradually or acutely?', 'How would you characterize your sleep quality and duration?']
  },
  sore_throat: {
    keywords: ['sore throat', 'throat pain', 'painful swallowing', 'strep', 'scratchy throat'],
    responses: [
      'Pharyngitis is commonly caused by viral pathogens, but may also result from bacterial infection, allergic response, or environmental irritants. Symptomatic management includes warm saline gargles, appropriate lozenges, and adequate hydration for mild cases.',
      'Severe odynophagia, persistent symptoms beyond 7 days, or accompanying manifestations such as high-grade fever, lymphadenopathy, or tonsillar exudates may indicate bacterial etiology requiring medical evaluation and potential antimicrobial therapy.',
      'Recurrent or chronic pharyngeal discomfort may relate to underlying conditions such as allergic rhinitis, gastroesophageal reflux, or environmental factors. Identifying and addressing these underlying causes is essential for symptom management.'
    ],
    severity: 'medium',
    followUpQuestions: ['Is the discomfort unilateral or bilateral?', 'Have you observed any tonsillar exudates or white patches?']
  },
  breathing: {
    keywords: ['breathing difficulty', 'shortness of breath', 'can\'t breathe', 'breathless', 'wheezing'],
    responses: [
      'Dyspnea requires prompt medical attention, particularly if acute in onset or severe in nature. Potential etiologies include bronchospasm, allergic reaction, infectious process, or cardiac pathology.',
      'If experiencing respiratory distress accompanied by chest pain, cyanosis, or altered mental status, immediate emergency medical intervention is indicated.',
      'For chronic or recurrent dyspnea, potential triggers may include allergens, physical exertion, emotional stressors, or environmental factors. Comprehensive evaluation and management strategy development with a healthcare provider is essential.'
    ],
    severity: 'high',
    followUpQuestions: ['Did the dyspnea develop acutely or gradually?', 'Are there factors that ameliorate or exacerbate symptoms?']
  },
  chest_pain: {
    keywords: ['chest pain', 'chest tightness', 'heart pain', 'pressure in chest'],
    responses: [
      'Chest pain requires immediate medical assessment, particularly when accompanied by dyspnea, diaphoresis, nausea, or radiation to the arm or jaw, as these may indicate acute coronary syndrome.',
      'Not all chest discomfort is cardiac in origin - potential etiologies include musculoskeletal strain, gastroesophageal reflux, or anxiety. However, thorough evaluation is warranted to exclude serious cardiovascular pathology.',
      'For patients experiencing chest pain, immediate medical attention is recommended rather than attempted self-diagnosis. Emergency medical services should be activated or immediate transport to an emergency department arranged.'
    ],
    severity: 'high',
    followUpQuestions: ['Is the pain sharp, dull, or pressure-like in quality?', 'Does the discomfort radiate to the arm, jaw, or back?']
  }
};

// Enhanced general responses
const generalResponses = [
  'Based on the information provided, clinical evaluation is recommended for proper diagnosis. These assessments are intended to supplement, not replace, personalized medical consultation.',
  'I understand your clinical concerns. While I can provide general medical information, direct evaluation by a healthcare provider would be optimal for your specific presentation.',
  'The symptoms described may be consistent with several clinical entities. Monitoring symptom progression and consulting with a healthcare professional is advised for appropriate management.',
  'Thank you for sharing your health concerns. For comprehensive assessment, discussion with a healthcare provider who can perform appropriate examination and diagnostic testing is recommended.',
  'While I can offer general clinical information, your specific presentation should be evaluated by a medical professional for accurate diagnosis and treatment recommendations.',
  'Individual clinical presentations vary significantly. The information provided is general in nature, and your specific symptoms may require personalized medical assessment.',
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
  treatment: 'Treatment options may include {treatments}. However, it is important to consult with a healthcare provider before initiating any treatment.',
  severity: 'The severity of {condition} can vary widely. {severity_info}',
  duration: '{condition} typically {duration_info}. If symptoms persist beyond this timeframe, medical evaluation is recommended.',
  medical_advice: 'For {condition}, it is advisable to seek medical attention {when_to_see_doctor}.',
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
      return `Based on your mention of ${condition}, I can provide the following clinical information:

${conditionData.responses[Math.floor(Math.random() * conditionData.responses.length)]}

${conditionData.severity === 'high' ? 'This condition requires prompt medical attention.' : 
  conditionData.severity === 'medium' ? 'This condition may require medical evaluation if symptoms persist or worsen.' :
  'This condition is typically manageable with appropriate care, but clinical consultation is recommended if concerned.'}`;
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
        followUpText = `\n\nTo better assess your condition: ${followUps[Math.floor(Math.random() * followUps.length)]}`;
      }
    }
    
    return {
      message: response + followUpText,
      isError: false
    };
  } catch (error) {
    console.error('AI service error:', error);
    return {
      message: 'We apologize, but there was an error processing your inquiry. Please try again.',
      isError: true
    };
  }
};
