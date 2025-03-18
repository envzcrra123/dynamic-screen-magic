import React, { useState, useRef, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SymptomInput from '@/components/SymptomInput';
import ChatMessage from '@/components/ChatMessage';
import ApiKeyInput from '@/components/ApiKeyInput';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateAIResponse } from '@/utils/aiService';

interface Diagnosis {
  disease: string;
  probability: number;
  description: string;
  advice: string;
}

interface ChatMessageType {
  id: string;
  message: string;
  isBot: boolean;
}

// Database of symptoms and corresponding advice
const symptomDatabase = {
  fever: {
    advice: "For fever: Stay hydrated, rest, and take acetaminophen or ibuprofen as directed. Consider seeking medical attention if fever exceeds 103°F (39.4°C) or persists longer than 3 days.",
    relatedConditions: ["Common Cold", "Flu", "COVID-19", "Infection"]
  },
  headache: {
    advice: "For headaches: Rest in a quiet, dark room. Apply a cold compress to your forehead. Stay hydrated and consider over-the-counter pain relievers if appropriate.",
    relatedConditions: ["Tension Headache", "Migraine", "Sinusitis", "Dehydration"]
  },
  cough: {
    advice: "For cough: Stay hydrated, use honey (if over 1 year old), try cough drops, and use a humidifier. Seek medical attention if coughing up blood or having difficulty breathing.",
    relatedConditions: ["Common Cold", "Bronchitis", "Asthma", "COVID-19"]
  },
  sore_throat: {
    advice: "For sore throat: Gargle with warm salt water, drink warm liquids, use throat lozenges, and stay hydrated. Consider seeking medical advice if symptoms persist beyond a week.",
    relatedConditions: ["Strep Throat", "Common Cold", "Tonsillitis", "Allergies"]
  },
  fatigue: {
    advice: "For fatigue: Ensure adequate rest, stay hydrated, eat nutritious meals, and consider gentle exercise. Consult a doctor if fatigue is severe or persists.",
    relatedConditions: ["Anemia", "Depression", "Chronic Fatigue Syndrome", "Hypothyroidism"]
  },
  nausea: {
    advice: "For nausea: Try small, frequent meals, avoid strong odors, ginger tea may help, and stay hydrated. Seek medical attention if accompanied by severe abdominal pain or persistent vomiting.",
    relatedConditions: ["Gastroenteritis", "Food Poisoning", "Migraine", "Pregnancy"]
  },
  dizziness: {
    advice: "For dizziness: Sit or lie down immediately, avoid sudden movements, stay hydrated, and ensure adequate ventilation. Seek urgent care if accompanied by chest pain or loss of consciousness.",
    relatedConditions: ["Vertigo", "Inner Ear Infection", "Low Blood Pressure", "Anemia"]
  },
  rash: {
    advice: "For rash: Avoid scratching, use gentle cleansers, apply cool compresses, and consider calamine lotion or hydrocortisone cream. Consult a doctor if the rash spreads rapidly or is accompanied by other symptoms.",
    relatedConditions: ["Allergic Reaction", "Eczema", "Contact Dermatitis", "Psoriasis"]
  }
};

const Index: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hello! I\'m your medical assistant. Please describe your symptoms in detail, and I\'ll try to provide some possible diagnoses and advice. Remember, this is not a substitute for professional medical care.',
      isBot: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isAIMode, setIsAIMode] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Effect for scrolling to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [chatMessages]);

  // Effect to set AI mode when API key is available
  useEffect(() => {
    setIsAIMode(apiKey.trim() !== '');
  }, [apiKey]);

  // Function to detect symptoms in user input
  const detectSymptoms = (input: string): string[] => {
    const lowercaseInput = input.toLowerCase();
    const detectedSymptoms: string[] = [];
    
    if (lowercaseInput.includes('fever') || lowercaseInput.includes('temperature')) {
      detectedSymptoms.push('fever');
    }
    if (lowercaseInput.includes('headache') || lowercaseInput.includes('head pain') || lowercaseInput.includes('head ache')) {
      detectedSymptoms.push('headache');
    }
    if (lowercaseInput.includes('cough') || lowercaseInput.includes('coughing')) {
      detectedSymptoms.push('cough');
    }
    if (lowercaseInput.includes('sore throat') || lowercaseInput.includes('throat pain')) {
      detectedSymptoms.push('sore_throat');
    }
    if (lowercaseInput.includes('tired') || lowercaseInput.includes('fatigue') || lowercaseInput.includes('exhausted')) {
      detectedSymptoms.push('fatigue');
    }
    if (lowercaseInput.includes('nausea') || lowercaseInput.includes('feeling sick') || lowercaseInput.includes('want to vomit')) {
      detectedSymptoms.push('nausea');
    }
    if (lowercaseInput.includes('dizzy') || lowercaseInput.includes('dizziness') || lowercaseInput.includes('lightheaded')) {
      detectedSymptoms.push('dizziness');
    }
    if (lowercaseInput.includes('rash') || lowercaseInput.includes('skin irritation') || lowercaseInput.includes('itchy skin')) {
      detectedSymptoms.push('rash');
    }
    
    return detectedSymptoms;
  };

  // Generate potential diagnoses based on symptoms
  const generateDiagnoses = (symptoms: string[]): Diagnosis[] => {
    // Create a mapping of conditions to their frequency
    const conditionFrequency: Record<string, number> = {};
    
    symptoms.forEach(symptom => {
      if (symptomDatabase[symptom as keyof typeof symptomDatabase]) {
        const relatedConditions = symptomDatabase[symptom as keyof typeof symptomDatabase].relatedConditions;
        relatedConditions.forEach(condition => {
          conditionFrequency[condition] = (conditionFrequency[condition] || 0) + 1;
        });
      }
    });
    
    // Convert to array and sort by frequency
    const sortedConditions = Object.entries(conditionFrequency)
      .map(([disease, count]) => ({
        disease,
        count,
        probability: count / symptoms.length
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3); // Top 3 most likely conditions
    
    // Generate diagnoses with descriptions
    return sortedConditions.map(condition => {
      const descriptions: Record<string, string> = {
        "Common Cold": "A viral infectious disease of the upper respiratory tract that primarily affects the nose.",
        "Flu": "An infectious disease caused by influenza viruses that affects the respiratory system.",
        "COVID-19": "An infectious disease caused by the SARS-CoV-2 virus, affecting the respiratory system.",
        "Infection": "The invasion of tissue by pathogenic microorganisms that multiply and produce disease.",
        "Tension Headache": "The most common type of headache, often described as a constant ache or pressure around the head.",
        "Migraine": "A headache of varying intensity, often accompanied by nausea and sensitivity to light and sound.",
        "Sinusitis": "Inflammation of the sinuses, often caused by infection, allergies, or autoimmune issues.",
        "Dehydration": "A condition caused by the loss of too much fluid from the body.",
        "Bronchitis": "Inflammation of the lining of the bronchial tubes, which carry air to and from the lungs.",
        "Asthma": "A condition in which a person's airways become inflamed, narrow and swell and produce extra mucus.",
        "Strep Throat": "A bacterial infection causing inflammation and pain in the throat.",
        "Tonsillitis": "Inflammation of the tonsils, typically caused by a viral or bacterial infection.",
        "Allergies": "An immune system response to substances that are usually harmless.",
        "Anemia": "A condition in which there is a deficiency of red blood cells or hemoglobin in the blood.",
        "Depression": "A mental health disorder characterized by persistently depressed mood and loss of interest in activities.",
        "Chronic Fatigue Syndrome": "A complicated disorder characterized by extreme fatigue that lasts for at least six months.",
        "Hypothyroidism": "A condition in which the thyroid gland doesn't produce enough thyroid hormone.",
        "Gastroenteritis": "Inflammation of the gastrointestinal tract involving both the stomach and the small intestine.",
        "Food Poisoning": "Illness caused by eating contaminated food.",
        "Pregnancy": "The condition of having a developing embryo or fetus in the body.",
        "Vertigo": "A sensation of feeling off balance or that you or your surroundings are spinning or moving.",
        "Inner Ear Infection": "Infection of the inner ear, often causing inflammation and vestibular dysfunction.",
        "Low Blood Pressure": "Abnormally low blood pressure that causes symptoms like dizziness and fainting.",
        "Allergic Reaction": "An exaggerated response of the immune system to a substance.",
        "Eczema": "A condition that makes your skin red and itchy, often related to allergies and asthma.",
        "Contact Dermatitis": "A red, itchy rash caused by direct contact with a substance or an allergic reaction to it.",
        "Psoriasis": "A skin condition that speeds up the life cycle of skin cells, causing cells to build up rapidly on the surface of the skin."
      };
      
      const generalAdvice = "Please consult with a healthcare professional for a proper diagnosis and treatment plan.";
      
      return {
        disease: condition.disease,
        probability: condition.probability,
        description: descriptions[condition.disease] || "A medical condition requiring professional diagnosis.",
        advice: generalAdvice
      };
    });
  };

  const handleSymptomSubmit = async (input: string) => {
    // Add user message
    const userMessageId = Date.now().toString();
    setChatMessages(prevMessages => [
      ...prevMessages,
      {
        id: userMessageId,
        message: input,
        isBot: false
      }
    ]);
    
    setLoading(true);
    
    try {
      if (isAIMode) {
        // Use AI-powered response
        const aiPrompt = `Medical question: ${input}\n\nPlease provide medical advice, possible conditions, and recommendations. Include relevant medical information while reminding that this is not a substitute for professional medical care.`;
        
        const aiResponse = await generateAIResponse(aiPrompt, apiKey);
        
        if (aiResponse.isError) {
          toast({
            title: "AI Error",
            description: "Could not get an AI response. Falling back to basic analysis.",
            variant: "destructive"
          });
          
          // Fall back to basic symptom detection if AI fails
          processBasicSymptomDetection(input);
        } else {
          // Add AI response
          setChatMessages(prevMessages => [
            ...prevMessages,
            {
              id: (Date.now() + 1).toString(),
              message: aiResponse.message,
              isBot: true
            }
          ]);
          
          toast({
            title: "AI Analysis Complete",
            description: "AI has analyzed your query and provided a response.",
          });
        }
      } else {
        // Use basic symptom detection
        processBasicSymptomDetection(input);
      }
    } catch (error) {
      console.error("Error in symptom processing:", error);
      
      // Add error message
      setChatMessages(prevMessages => [
        ...prevMessages,
        {
          id: (Date.now() + 1).toString(),
          message: "Sorry, there was an error processing your request. Please try again.",
          isBot: true
        }
      ]);
      
      toast({
        title: "Error",
        description: "There was a problem analyzing your symptoms.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const processBasicSymptomDetection = (input: string) => {
    // Detect symptoms from user input
    const detectedSymptoms = detectSymptoms(input);
    
    let botResponse = "";
    
    if (detectedSymptoms.length === 0) {
      botResponse = "I couldn't identify specific symptoms from your description. Please provide more details about how you're feeling. For example, do you have fever, headache, cough, or other symptoms?";
    } else {
      // Add specific advice for each detected symptom
      botResponse = "Based on your description, I've identified these symptoms:\n\n";
      detectedSymptoms.forEach(symptom => {
        if (symptomDatabase[symptom as keyof typeof symptomDatabase]) {
          botResponse += `**${symptom.replace('_', ' ')}**: ${symptomDatabase[symptom as keyof typeof symptomDatabase].advice}\n\n`;
        }
      });
      
      // Generate potential diagnoses
      const diagnoses = generateDiagnoses(detectedSymptoms);
      
      if (diagnoses.length > 0) {
        botResponse += "## Possible conditions based on your symptoms:\n\n";
        
        diagnoses.forEach((diagnosis, index) => {
          botResponse += `${index + 1}. **${diagnosis.disease}** (${Math.floor(diagnosis.probability * 100)}% match)\n${diagnosis.description}\n\n`;
        });
        
        botResponse += "**Important reminder**: This is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.";
      }
    }
    
    // Add bot message
    setChatMessages(prevMessages => [
      ...prevMessages,
      {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        isBot: true
      }
    ]);
    
    toast({
      title: "Symptom Analysis Complete",
      description: "We've analyzed your symptoms and provided possible information.",
    });
  };

  return (
    <div className="mobile-container">
      <StatusBar />
      <Header title="Symptoms Checker">
        <ApiKeyInput onApiKeyChange={setApiKey} />
      </Header>
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="mb-3">
          <div className={`rounded-lg text-xs py-1 px-2 inline-block ${isAIMode ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
            {isAIMode ? 'Advanced AI Mode' : 'Basic Analysis Mode'}
          </div>
        </div>
        
        <ScrollArea className="flex-1 pr-2" ref={scrollAreaRef}>
          <div className="flex flex-col space-y-4 pb-4">
            {chatMessages.map((msg) => (
              <ChatMessage 
                key={msg.id}
                message={msg.message}
                isBot={msg.isBot}
              />
            ))}
            
            {loading && (
              <div className="self-start flex items-center gap-2 text-sm text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-medical-purple rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-medical-purple rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-medical-purple rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span>{isAIMode ? "AI is thinking..." : "Analyzing symptoms..."}</span>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4">
          <SymptomInput onSubmit={handleSymptomSubmit} loading={loading} />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
