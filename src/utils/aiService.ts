// Define the interface for AI responses
export interface AIResponse {
  message: string;
  isError: boolean;
}

// Define intent types
type IntentType = 
  | 'symptom_check' 
  | 'medication_inquiry' 
  | 'suggest_medication' 
  | 'dosage_inquiry'
  | 'side_effect_inquiry'
  | 'treatment_duration'
  | 'severity_assessment'
  | 'follow_up_needed'
  | 'general_inquiry'
  | 'user_frustration'  // New intent for emotional detection
  | 'user_anxiety'      // New intent for anxiety detection
  | 'user_confusion';   // New intent for confusion detection

// Define entity types
interface Entity {
  name: string;
  value: string;
  position: [number, number]; // Start and end position in the text
}

// Define conversation context
interface ConversationContext {
  lastIntent: IntentType | null;
  lastEntities: Entity[];
  lastMentionedCondition: string;
  lastMentionedMedication: string | null;
  questionCount: number;
  lastResponseTime: number;
  userEmotionalState: 'neutral' | 'frustrated' | 'anxious' | 'confused' | 'worried';
}

// Define the intent recognition patterns
interface IntentPattern {
  intent: IntentType;
  patterns: RegExp[];
  requiredContext?: IntentType[];
  entities?: string[];
}

// Define entity structure for recognition
interface EntityDefinition {
  type: string;
  values: Record<string, string[]>; // Map of canonical name to synonyms
}

// Define a more structured medical knowledge base
interface MedicalCondition {
  keywords: string[];
  responses: string[];
  severity: 'low' | 'medium' | 'high';
  suggestedMedications: string[];
  followUpQuestions?: string[];
}

// Define medication information
interface MedicationInfo {
  dosage: string;
  sideEffects: string[];
  contraindications: string[];
  interactions: string[];
}

// Initialize conversation context
let conversationContext: ConversationContext = {
  lastIntent: null,
  lastEntities: [],
  lastMentionedCondition: '',
  lastMentionedMedication: null,
  questionCount: 0,
  lastResponseTime: 0,
  userEmotionalState: 'neutral'
};

// Entity definitions
const entityDefinitions: Record<string, EntityDefinition> = {
  symptom: {
    type: 'symptom',
    values: {
      'headache': ['headache', 'migraine', 'head pain', 'head ache', 'head hurts'],
      'fever': ['fever', 'high temperature', 'feeling hot', 'chills', 'sweating'],
      'cough': ['cough', 'coughing', 'hack', 'chest congestion', 'phlegm', 'mucus'],
      'sore throat': ['sore throat', 'throat pain', 'painful swallowing', 'strep', 'scratchy throat'],
      'stomachache': ['stomachache', 'stomach pain', 'abdominal pain', 'tummy ache', 'gut pain', 'nausea', 'vomiting'],
      'rash': ['rash', 'skin irritation', 'hives', 'itchy skin', 'red spots', 'skin outbreak'],
      'dizziness': ['dizzy', 'dizziness', 'lightheaded', 'vertigo', 'faint', 'balance problems'],
      'fatigue': ['fatigue', 'tired', 'exhaustion', 'no energy', 'lethargy', 'weakness'],
      'breathing difficulty': ['breathing difficulty', 'shortness of breath', 'can\'t breathe', 'breathless', 'wheezing'],
      'chest pain': ['chest pain', 'chest tightness', 'heart pain', 'pressure in chest']
    }
  },
  medication: {
    type: 'medication',
    values: {
      'paracetamol': ['paracetamol', 'acetaminophen', 'tylenol'],
      'ibuprofen': ['ibuprofen', 'advil', 'motrin', 'nurofen'],
      'aspirin': ['aspirin', 'bayer', 'acetylsalicylic acid'],
      'antihistamine': ['antihistamine', 'benadryl', 'zyrtec', 'claritin'],
      'antibiotics': ['antibiotics', 'amoxicillin', 'penicillin', 'azithromycin'],
      'decongestant': ['decongestant', 'sudafed', 'pseudoephedrine'],
      'antacid': ['antacid', 'tums', 'rolaids', 'maalox']
    }
  },
  emotion: {
    type: 'emotion',
    values: {
      'frustration': ['frustrated', 'annoying', 'tired of this', 'arghh', 'hate', 'ugh', 'hassle', 'fed up', 'irritating'],
      'anxiety': ['anxious', 'worried', 'scared', 'nervous', 'fear', 'panic', 'stress', 'stressed', 'concerned', 'terrified'],
      'confusion': ['confused', 'unsure', 'don\'t understand', 'what does this mean', 'not sure', 'unclear', 'don\'t know what to do', 'lost']
    }
  }
};

// Intent patterns for recognition including new emotional intents
const intentPatterns: IntentPattern[] = [
  {
    intent: 'symptom_check',
    patterns: [
      /i (have|feel|am experiencing|got) (a|an)? ([a-z\s]+)/i,
      /what (causes|about) ([a-z\s]+)/i,
      /why (do|does|am|is) ([a-z\s]+)/i
    ],
    entities: ['symptom']
  },
  {
    intent: 'medication_inquiry',
    patterns: [
      /(what|which) (medication|medicine|drug) (for|should I take for) ([a-z\s]+)/i,
      /can I take ([a-z\s]+) for ([a-z\s]+)/i
    ],
    entities: ['medication', 'symptom']
  },
  {
    intent: 'suggest_medication',
    patterns: [
      /what (should|can) I take/i,
      /any (medicine|medication|remedy) for (this|it)/i,
      /what (helps|works) for this/i
    ],
    requiredContext: ['symptom_check']
  },
  {
    intent: 'dosage_inquiry',
    patterns: [
      /how (much|many) ([a-z\s]+) (should|can) I take/i,
      /what('s| is) the (right|correct) dosage/i,
      /(dosage|dose) (information|details)/i
    ],
    entities: ['medication']
  },
  {
    intent: 'side_effect_inquiry',
    patterns: [
      /what are the side effects/i,
      /does ([a-z\s]+) have side effects/i,
      /is ([a-z\s]+) safe/i
    ],
    entities: ['medication']
  },
  {
    intent: 'treatment_duration',
    patterns: [
      /how long (should|do) I (take|use) ([a-z\s]+)/i,
      /for how (long|many days)/i,
      /when (should|will) (I|it) (stop|get better)/i
    ],
    entities: ['medication']
  },
  {
    intent: 'severity_assessment',
    patterns: [
      /is (this|it) (serious|dangerous|concerning)/i,
      /should I (be concerned|worry)/i,
      /when should I see a doctor/i
    ],
    requiredContext: ['symptom_check']
  },
  {
    intent: 'follow_up_needed',
    patterns: [
      /should I (see|visit|call) (a|the) doctor/i,
      /do I need medical (attention|help)/i,
      /is this an emergency/i
    ]
  },
  {
    intent: 'general_inquiry',
    patterns: [
      /how (can|do) I prevent ([a-z\s]+)/i,
      /what (causes|triggers) ([a-z\s]+)/i,
      /is ([a-z\s]+) contagious/i
    ],
    entities: ['symptom']
  },
  // New emotional intents
  {
    intent: 'user_frustration',
    patterns: [
      /this is (so)? (frustrating|annoying|irritating)/i,
      /(hate|tired of) (being sick|feeling this way|this)/i,
      /ugh|arghh|fed up/i,
      /this is (such a)? hassle/i
    ],
    entities: ['emotion']
  },
  {
    intent: 'user_anxiety',
    patterns: [
      /i('m| am) (really |so )?(worried|scared|anxious|nervous|concerned)/i,
      /(is this|could this be) serious/i,
      /i('m| am) stressed (about|because of) my health/i,
      /i feel (anxious|panic|fear)/i,
      /what if (it's|it is|i have) something (serious|bad)/i
    ],
    entities: ['emotion']
  },
  {
    intent: 'user_confusion',
    patterns: [
      /i('m| am) (confused|unsure|not sure)/i,
      /i don't (understand|know what to do)/i,
      /what does this mean/i,
      /(this is|i am) (unclear|lost)/i
    ],
    entities: ['emotion']
  }
];

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
    suggestedMedications: ['paracetamol', 'ibuprofen'],
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
    suggestedMedications: ['paracetamol', 'ibuprofen'],
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
    suggestedMedications: ['decongestant', 'antihistamine'],
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
    suggestedMedications: ['antacid'],
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
    suggestedMedications: ['antihistamine'],
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
    suggestedMedications: [],
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
    suggestedMedications: [],
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
    suggestedMedications: ['paracetamol', 'ibuprofen'],
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
    suggestedMedications: [],
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
    suggestedMedications: [],
    followUpQuestions: ['Is the pain sharp, dull, or pressure-like in quality?', 'Does the discomfort radiate to the arm, jaw, or back?']
  }
};

// Emotional response templates
const emotionalResponseTemplates = {
  frustrated: [
    "I understand your frustration. Dealing with health concerns can be challenging. Let's work together to address your symptoms.",
    "I'm truly sorry you're feeling frustrated. Your concerns are valid, and I'm here to help you navigate this situation.",
    "I recognize how frustrating this must be for you. Let's take this one step at a time to find the best approach for your health."
  ],
  anxious: [
    "I can hear that you're worried, which is completely understandable. I'm here to provide clear information to help ease your concerns.",
    "It's natural to feel anxious about health matters. I'll do my best to provide you with accurate information to help you make informed decisions.",
    "I understand your concern. Let me assure you that we'll address this thoroughly. Many health issues are manageable with proper care."
  ],
  confused: [
    "It seems like you're feeling uncertain, which is completely normal. I'll provide clear information to help you better understand your situation.",
    "Medical information can sometimes be overwhelming. I'll explain things in straightforward terms to help clarify your understanding.",
    "I understand your confusion. Let me break down the information into clearer steps to help you navigate this health concern."
  ]
};

// Medication information database
const medicationDatabase: Record<string, MedicationInfo> = {
  paracetamol: {
    dosage: 'Adults: 500-1000 mg every 4-6 hours as needed, not exceeding 4000 mg in 24 hours. Children: dosage based on weight and age.',
    sideEffects: ['Rare allergic reactions', 'Liver damage with overdose or prolonged use'],
    contraindications: ['Liver disease', 'Alcoholism'],
    interactions: ['Warfarin', 'Alcohol']
  },
  ibuprofen: {
    dosage: 'Adults: 200-400 mg every 4-6 hours as needed, not exceeding 1200 mg in 24 hours without medical advice.',
    sideEffects: ['Stomach upset', 'Heartburn', 'Increased risk of heart attack or stroke with prolonged use'],
    contraindications: ['Peptic ulcer', 'Heart failure', 'Third trimester pregnancy'],
    interactions: ['Aspirin', 'Blood pressure medications', 'Diuretics']
  },
  aspirin: {
    dosage: 'Adults: 325-650 mg every 4-6 hours as needed. Not recommended for children under 12 years due to risk of Reye\'s syndrome.',
    sideEffects: ['Stomach upset', 'Increased bleeding risk', 'Tinnitus with high doses'],
    contraindications: ['Bleeding disorders', 'Children under 12', 'Third trimester pregnancy'],
    interactions: ['Blood thinners', 'Methotrexate', 'NSAIDs']
  },
  antihistamine: {
    dosage: 'Adults: Varies by product. Typically one tablet every 12-24 hours.',
    sideEffects: ['Drowsiness', 'Dry mouth', 'Blurred vision'],
    contraindications: ['Glaucoma', 'Urinary retention', 'Some heart conditions'],
    interactions: ['CNS depressants', 'Alcohol', 'MAO inhibitors']
  },
  antibiotics: {
    dosage: 'Dosage varies widely depending on the specific antibiotic and the infection being treated. Always follow your doctor\'s instructions.',
    sideEffects: ['Nausea', 'Diarrhea', 'Allergic reactions'],
    contraindications: ['Allergies to specific antibiotics'],
    interactions: ['Warfarin', 'Oral contraceptives']
  },
  decongestant: {
    dosage: 'Adults: Varies by product. Typically one tablet every 4-6 hours as needed.',
    sideEffects: ['Increased blood pressure', 'Insomnia', 'Anxiety'],
    contraindications: ['High blood pressure', 'Heart disease', 'Glaucoma'],
    interactions: ['MAO inhibitors', 'Tricyclic antidepressants']
  },
  antacid: {
    dosage: 'Adults: 1-2 tablets as needed for heartburn or indigestion.',
    sideEffects: ['Constipation', 'Diarrhea'],
    contraindications: ['Kidney disease'],
    interactions: ['Tetracycline antibiotics', 'Iron supplements']
  }
};

// Function to identify entities in user input
const identifyEntities = (input: string): Entity[] => {
  const entities: Entity[] = [];
  const lowercaseInput = input.toLowerCase();
  
  // Check for each entity type
  Object.entries(entityDefinitions).forEach(([entityType, definition]) => {
    // Check each canonical entity value and its synonyms
    Object.entries(definition.values).forEach(([canonicalName, synonyms]) => {
      synonyms.forEach(synonym => {
        let position = lowercaseInput.indexOf(synonym.toLowerCase());
        while (position !== -1) {
          // Check if it's a standalone word using word boundaries
          const beforeChar = position === 0 ? ' ' : lowercaseInput[position - 1];
          const afterChar = position + synonym.length >= lowercaseInput.length ? 
                            ' ' : lowercaseInput[position + synonym.length];
          
          if (!/[a-zA-Z0-9]/.test(beforeChar) && !/[a-zA-Z0-9]/.test(afterChar)) {
            entities.push({
              name: entityType,
              value: canonicalName,
              position: [position, position + synonym.length]
            });
          }
          
          // Look for next occurrence
          position = lowercaseInput.indexOf(synonym.toLowerCase(), position + 1);
        }
      });
    });
  });
  
  return entities;
};

// Function to identify intent in user input
const identifyIntent = (input: string, entities: Entity[]): IntentType => {
  // First check for emotional intents as they take priority
  for (const intentPattern of intentPatterns) {
    if (intentPattern.intent === 'user_frustration' || 
        intentPattern.intent === 'user_anxiety' || 
        intentPattern.intent === 'user_confusion') {
      
      for (const pattern of intentPattern.patterns) {
        if (pattern.test(input)) {
          // Update the user's emotional state
          switch (intentPattern.intent) {
            case 'user_frustration':
              conversationContext.userEmotionalState = 'frustrated';
              break;
            case 'user_anxiety':
              conversationContext.userEmotionalState = 'anxious';
              break;
            case 'user_confusion':
              conversationContext.userEmotionalState = 'confused';
              break;
          }
          return intentPattern.intent;
        }
      }
    }
  }
  
  // Then check for other intents if no emotional intent is found
  for (const intentPattern of intentPatterns) {
    // Skip if already checked emotional intents
    if (intentPattern.intent === 'user_frustration' || 
        intentPattern.intent === 'user_anxiety' || 
        intentPattern.intent === 'user_confusion') {
      continue;
    }
    
    // Skip if this intent requires context and we don't have the right one
    if (intentPattern.requiredContext && 
        (!conversationContext.lastIntent || 
         !intentPattern.requiredContext.includes(conversationContext.lastIntent))) {
      continue;
    }
    
    // Check if required entities are present if specified
    if (intentPattern.entities) {
      const foundEntityTypes = entities.map(entity => entity.name);
      const hasAllRequiredEntities = intentPattern.entities.every(
        requiredEntity => foundEntityTypes.includes(requiredEntity)
      );
      
      if (!hasAllRequiredEntities) {
        continue;
      }
    }
    
    // Check if any pattern matches
    for (const pattern of intentPattern.patterns) {
      if (pattern.test(input)) {
        return intentPattern.intent;
      }
    }
  }
  
  // Check for emotional keywords even if pattern doesn't match
  for (const entity of entities) {
    if (entity.name === 'emotion') {
      switch (entity.value) {
        case 'frustration':
          conversationContext.userEmotionalState = 'frustrated';
          return 'user_frustration';
        case 'anxiety':
          conversationContext.userEmotionalState = 'anxious';
          return 'user_anxiety';
        case 'confusion':
          conversationContext.userEmotionalState = 'confused';
          return 'user_confusion';
      }
    }
  }
  
  // Default to general inquiry if no specific intent is matched
  return 'general_inquiry';
};

// Function to generate an empathetic response based on emotional state
const generateEmpatheticResponse = (): string => {
  let responses;
  
  switch (conversationContext.userEmotionalState) {
    case 'frustrated':
      responses = emotionalResponseTemplates.frustrated;
      break;
    case 'anxious':
      responses = emotionalResponseTemplates.anxious;
      break;
    case 'confused':
      responses = emotionalResponseTemplates.confused;
      break;
    default:
      return '';
  }
  
  // Reset emotional state to neutral after responding
  const response = responses[Math.floor(Math.random() * responses.length)];
  conversationContext.userEmotionalState = 'neutral';
  return response;
};

// Function to generate a response based on intent and entities
const generateResponseForIntent = (intent: IntentType, entities: Entity[], input: string): string => {
  // Generate empathetic response for emotional intents
  if (intent === 'user_frustration' || intent === 'user_anxiety' || intent === 'user_confusion') {
    const empathyResponse = generateEmpatheticResponse();
    return `${empathyResponse} Would you like to tell me more about your symptoms or concerns so I can provide specific guidance?`;
  }
  
  // Check if an empathetic prefix should be added (even for non-emotional intents)
  let empathyPrefix = '';
  if (conversationContext.userEmotionalState !== 'neutral') {
    empathyPrefix = generateEmpatheticResponse() + ' ';
  }
  
  // Update last mentioned condition if a symptom is found
  const symptomEntity = entities.find(entity => entity.name === 'symptom');
  if (symptomEntity) {
    conversationContext.lastMentionedCondition = symptomEntity.value;
  }
  
  // Update last mentioned medication if found
  const medicationEntity = entities.find(entity => entity.name === 'medication');
  if (medicationEntity) {
    conversationContext.lastMentionedMedication = medicationEntity.value;
  }
  
  let medicalResponse = '';
  
  switch (intent) {
    case 'symptom_check':
      if (symptomEntity && medicalKnowledgeBase[symptomEntity.value]) {
        const condition = medicalKnowledgeBase[symptomEntity.value];
        medicalResponse = condition.responses[Math.floor(Math.random() * condition.responses.length)];
      } else if (conversationContext.lastMentionedCondition && medicalKnowledgeBase[conversationContext.lastMentionedCondition]) {
        // Use previously mentioned condition if available
        const condition = medicalKnowledgeBase[conversationContext.lastMentionedCondition];
        medicalResponse = condition.responses[Math.floor(Math.random() * condition.responses.length)];
      }
      break;
      
    case 'medication_inquiry':
    case 'suggest_medication':
      let condition = '';
      
      if (symptomEntity && medicalKnowledgeBase[symptomEntity.value]) {
        condition = symptomEntity.value;
      } else if (conversationContext.lastMentionedCondition) {
        condition = conversationContext.lastMentionedCondition;
      }
      
      if (condition && medicalKnowledgeBase[condition]) {
        const suggestedMeds = medicalKnowledgeBase[condition].suggestedMedications;
        if (suggestedMeds.length > 0) {
          if (suggestedMeds.length === 1) {
            medicalResponse = `For ${condition}, ${suggestedMeds[0]} is clinically recommended. Would you like information on the appropriate dosage?`;
          } else {
            medicalResponse = `For ${condition}, clinical guidelines recommend ${suggestedMeds.slice(0, -1).join(', ')} or ${suggestedMeds[suggestedMeds.length - 1]}. Each has specific indications and contraindications. Would you like more detailed information on any of these medications?`;
          }
        }
      }
      break;
      
    case 'dosage_inquiry':
      let medication = '';
      
      if (medicationEntity) {
        medication = medicationEntity.value;
      } else if (conversationContext.lastMentionedMedication) {
        medication = conversationContext.lastMentionedMedication;
      }
      
      if (medication && medicationDatabase[medication]) {
        medicalResponse = `The recommended dosage for ${medication} is: ${medicationDatabase[medication].dosage}`;
      }
      break;
      
    case 'side_effect_inquiry':
      if (medicationEntity && medicationDatabase[medicationEntity.value]) {
        const med = medicationDatabase[medicationEntity.value];
        medicalResponse = `${medicationEntity.value} may cause: ${med.sideEffects.join(', ')}. Contraindications include: ${med.contraindications.join(', ')}. Please consult your healthcare provider before use.`;
      } else if (conversationContext.lastMentionedMedication && medicationDatabase[conversationContext.lastMentionedMedication]) {
        const med = medicationDatabase[conversationContext.lastMentionedMedication];
        medicalResponse = `${conversationContext.lastMentionedMedication} may cause: ${med.sideEffects.join(', ')}. Contraindications include: ${med.contraindications.join(', ')}. Please consult your healthcare provider before use.`;
      }
      break;
      
    case 'treatment_duration':
      if (medicationEntity || conversationContext.lastMentionedMedication) {
        const med = medicationEntity ? medicationEntity.value : conversationContext.lastMentionedMedication;
        medicalResponse = `Treatment duration with ${med} depends on your specific condition and response to therapy. For acute symptoms, short-term use of 3-5 days is typically sufficient. For chronic conditions, your healthcare provider may recommend a specific regimen tailored to your needs.`;
      } else if (conversationContext.lastMentionedCondition) {
        medicalResponse = `Treatment duration for ${conversationContext.lastMentionedCondition} varies based on severity and patient response. Mild cases often resolve within days with appropriate management, while more significant presentations may require prolonged therapy under medical supervision.`;
      }
      break;
      
    case 'severity_assessment':
      if (conversationContext.lastMentionedCondition && medicalKnowledgeBase[conversationContext.lastMentionedCondition]) {
        const condition = medicalKnowledgeBase[conversationContext.lastMentionedCondition];
        switch (condition.severity) {
          case 'high':
            medicalResponse = `${conversationContext.lastMentionedCondition} can represent a serious medical condition requiring prompt clinical evaluation. Please seek immediate medical attention, particularly if experiencing ${condition.keywords.slice(0, 2).join(' or ')}.`;
          case 'medium':
            medicalResponse = `${conversationContext.lastMentionedCondition} may indicate a condition requiring medical assessment if symptoms persist beyond 48-72 hours or if accompanied by ${condition.keywords.slice(0, 2).join(' or ')}.`;
          case 'low':
            medicalResponse = `${conversationContext.lastMentionedCondition} typically represents a benign condition manageable
