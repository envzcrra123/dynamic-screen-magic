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
  | 'general_inquiry';

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
  lastResponseTime: 0
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
  }
};

// Intent patterns for recognition
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
  // Check each intent pattern for a match
  for (const intentPattern of intentPatterns) {
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
  
  // Default to general inquiry if no specific intent is matched
  return 'general_inquiry';
};

// Function to generate a response based on intent and entities
const generateResponseForIntent = (intent: IntentType, entities: Entity[], input: string): string => {
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
  
  switch (intent) {
    case 'symptom_check':
      if (symptomEntity && medicalKnowledgeBase[symptomEntity.value]) {
        const condition = medicalKnowledgeBase[symptomEntity.value];
        return condition.responses[Math.floor(Math.random() * condition.responses.length)];
      } else if (conversationContext.lastMentionedCondition && medicalKnowledgeBase[conversationContext.lastMentionedCondition]) {
        // Use previously mentioned condition if available
        const condition = medicalKnowledgeBase[conversationContext.lastMentionedCondition];
        return condition.responses[Math.floor(Math.random() * condition.responses.length)];
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
            return `For ${condition}, ${suggestedMeds[0]} is clinically recommended. Would you like information on the appropriate dosage?`;
          } else {
            return `For ${condition}, clinical guidelines recommend ${suggestedMeds.slice(0, -1).join(', ')} or ${suggestedMeds[suggestedMeds.length - 1]}. Each has specific indications and contraindications. Would you like more detailed information on any of these medications?`;
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
        return `The recommended dosage for ${medication} is: ${medicationDatabase[medication].dosage}`;
      }
      break;
      
    case 'side_effect_inquiry':
      if (medicationEntity && medicationDatabase[medicationEntity.value]) {
        const med = medicationDatabase[medicationEntity.value];
        return `${medicationEntity.value} may cause: ${med.sideEffects.join(', ')}. Contraindications include: ${med.contraindications.join(', ')}. Please consult your healthcare provider before use.`;
      } else if (conversationContext.lastMentionedMedication && medicationDatabase[conversationContext.lastMentionedMedication]) {
        const med = medicationDatabase[conversationContext.lastMentionedMedication];
        return `${conversationContext.lastMentionedMedication} may cause: ${med.sideEffects.join(', ')}. Contraindications include: ${med.contraindications.join(', ')}. Please consult your healthcare provider before use.`;
      }
      break;
      
    case 'treatment_duration':
      if (medicationEntity || conversationContext.lastMentionedMedication) {
        const med = medicationEntity ? medicationEntity.value : conversationContext.lastMentionedMedication;
        return `Treatment duration with ${med} depends on your specific condition and response to therapy. For acute symptoms, short-term use of 3-5 days is typically sufficient. For chronic conditions, your healthcare provider may recommend a specific regimen tailored to your needs.`;
      } else if (conversationContext.lastMentionedCondition) {
        return `Treatment duration for ${conversationContext.lastMentionedCondition} varies based on severity and patient response. Mild cases often resolve within days with appropriate management, while more significant presentations may require prolonged therapy under medical supervision.`;
      }
      break;
      
    case 'severity_assessment':
      if (conversationContext.lastMentionedCondition && medicalKnowledgeBase[conversationContext.lastMentionedCondition]) {
        const condition = medicalKnowledgeBase[conversationContext.lastMentionedCondition];
        switch (condition.severity) {
          case 'high':
            return `${conversationContext.lastMentionedCondition} can represent a serious medical condition requiring prompt clinical evaluation. Please seek immediate medical attention, particularly if experiencing ${condition.keywords.slice(0, 2).join(' or ')}.`;
          case 'medium':
            return `${conversationContext.lastMentionedCondition} may indicate a condition requiring medical assessment if symptoms persist beyond 48-72 hours or if accompanied by ${condition.keywords.slice(0, 2).join(' or ')}.`;
          case 'low':
            return `${conversationContext.lastMentionedCondition} typically represents a benign condition manageable with conservative measures. However, clinical evaluation is recommended if symptoms worsen or persist beyond 5-7 days.`;
        }
      }
      break;
      
    case 'follow_up_needed':
      if (conversationContext.lastMentionedCondition && medicalKnowledgeBase[conversationContext.lastMentionedCondition]) {
        const condition = medicalKnowledgeBase[conversationContext.lastMentionedCondition];
        switch (condition.severity) {
          case 'high':
            return `For ${conversationContext.lastMentionedCondition}, immediate medical consultation is recommended, particularly if symptoms are acute in onset or severe in nature.`;
          case 'medium':
            return `For ${conversationContext.lastMentionedCondition}, medical evaluation is recommended if symptoms persist beyond 48-72 hours, worsen in intensity, or are accompanied by additional concerning manifestations.`;
          case 'low':
            return `For ${conversationContext.lastMentionedCondition}, medical consultation may be beneficial if symptoms do not improve with conservative management after 5-7 days or if there is significant impact on daily functioning.`;
        }
      }
      break;
      
    case 'general_inquiry':
      // Provide general information about a condition
      if (symptomEntity && medicalKnowledgeBase[symptomEntity.value]) {
        return `${symptomEntity.value} may be associated with various underlying causes. Prevention strategies include ${generatePreventionTips(symptomEntity.value)}. This information is based on current clinical guidelines.`;
      } else if (conversationContext.lastMentionedCondition) {
        return `${conversationContext.lastMentionedCondition} may be associated with various underlying causes. Prevention strategies include ${generatePreventionTips(conversationContext.lastMentionedCondition)}. This information is based on current clinical guidelines.`;
      }
      break;
  }
  
  // Fallback response if no specific answer is available
  return `Based on current medical knowledge, your inquiry requires more specific clinical information for accurate assessment. Consider consulting with a healthcare provider who can perform an appropriate evaluation.`;
};

// Helper function to generate prevention tips
const generatePreventionTips = (condition: string): string => {
  const preventionTips = {
    headache: 'adequate hydration, stress management techniques, regular sleep patterns, and ergonomic workspace setup',
    fever: 'maintaining good hygiene practices, avoiding contact with ill individuals, and ensuring proper immunization status',
    cough: 'avoiding respiratory irritants, proper hand hygiene, maintaining adequate hydration, and appropriate management of underlying respiratory conditions',
    stomachache: 'proper food safety practices, regular meals, adequate hydration, and stress management techniques',
    rash: 'avoiding known allergens or irritants, maintaining proper skin hygiene, and using appropriate moisturizers for skin protection',
    dizziness: 'proper hydration, gradual position changes, and regular monitoring of blood pressure if applicable',
    fatigue: 'regular physical activity, balanced nutrition, stress management, and maintenance of consistent sleep patterns',
    'sore throat': 'proper hand hygiene, avoiding sharing personal items, maintaining hydration, and limiting exposure to environmental irritants',
    'breathing difficulty': 'avoiding known respiratory triggers, maintaining appropriate treatment for underlying conditions, and implementing air quality measures',
    'chest pain': 'cardiovascular risk factor management, regular physical activity as medically appropriate, and stress reduction techniques'
  };
  
  return preventionTips[condition as keyof typeof preventionTips] || 
         'maintaining a balanced lifestyle with adequate nutrition, regular physical activity, proper hydration, and appropriate stress management';
};

// Function to generate a follow-up question based on context
const generateFollowUp = (intent: IntentType, entities: Entity[]): string | null => {
  // If we identified a condition and have follow-up questions for it
  if (conversationContext.lastMentionedCondition && 
      medicalKnowledgeBase[conversationContext.lastMentionedCondition]?.followUpQuestions?.length) {
    
    const followUps = medicalKnowledgeBase[conversationContext.lastMentionedCondition].followUpQuestions;
    if (followUps && followUps.length > 0) {
      return followUps[Math.floor(Math.random() * followUps.length)];
    }
  }
  
  // Based on intent, we might ask different follow-ups
  switch (intent) {
    case 'symptom_check':
      return 'When did you first notice these symptoms?';
    case 'medication_inquiry':
      return 'Do you have any known allergies or current medications?';
    case 'suggest_medication':
      return 'Would you like information on potential side effects of the suggested medication?';
    case 'dosage_inquiry':
      return 'What is your age and weight? This helps determine the optimal dosage.';
    case 'side_effect_inquiry':
      return 'Have you experienced adverse reactions to similar medications in the past?';
  }
  
  return null;
};

export const generateAIResponse = async (prompt: string): Promise<AIResponse> => {
  try {
    // Update conversation context
    conversationContext.questionCount++;
    conversationContext.lastResponseTime = Date.now();
    
    // Identify entities in the input
    const entities = identifyEntities(prompt);
    
    // Identify intent based on the input and entities
    const intent = identifyIntent(prompt, entities);
    
    // Update the context with the current intent and entities
    conversationContext.lastIntent = intent;
    conversationContext.lastEntities = entities;
    
    // Simulate processing time (longer for first question, shorter for follow-ups)
    const processingTime = conversationContext.questionCount === 1 ? 1500 : 800;
    await new Promise(resolve => setTimeout(resolve, processingTime));
    
    // Generate response based on intent and entities
    const response = generateResponseForIntent(intent, entities, prompt);
    
    // Generate a follow-up question if appropriate
    const followUpQuestion = generateFollowUp(intent, entities);
    const followUpText = followUpQuestion ? `\n\nTo better assess your condition: ${followUpQuestion}` : '';
    
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
