
import React, { useState, useRef, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SymptomInput from '@/components/SymptomInput';
import ChatMessage from '@/components/ChatMessage';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Diagnosis {
  disease: string;
  probability: number;
  description: string;
}

interface ChatMessageType {
  id: string;
  message: string;
  isBot: boolean;
}

const Index: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hello! I\'m your medical assistant. Please describe your symptoms, and I\'ll try to provide some possible diagnoses.',
      isBot: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableElement) {
        scrollableElement.scrollTop = scrollableElement.scrollHeight;
      }
    }
  }, [chatMessages]);

  const handleSymptomSubmit = (input: string) => {
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
    
    // Simulate API call for diagnosis
    setTimeout(() => {
      // This is simulated data - in a real app, this would come from an API
      const mockDiagnoses: Diagnosis[] = [
        {
          disease: "Common Cold",
          probability: 0.85,
          description: "A viral infectious disease of the upper respiratory tract that primarily affects the nose."
        },
        {
          disease: "Seasonal Allergies",
          probability: 0.65,
          description: "An allergic reaction to pollen from trees, grasses, or weeds, or to airborne mold spores."
        },
        {
          disease: "Sinusitis",
          probability: 0.45,
          description: "Inflammation of the sinuses, often caused by infection, allergies, or autoimmune issues."
        }
      ];
      
      // Create bot response with diagnoses
      let botResponse = "Based on your symptoms, here are some possible diagnoses:\n\n";
      
      mockDiagnoses.forEach((diagnosis, index) => {
        botResponse += `${index + 1}. **${diagnosis.disease}** (${Math.floor(diagnosis.probability * 100)}% match)\n${diagnosis.description}\n\n`;
      });
      
      botResponse += "Please note that these results are for informational purposes only and do not constitute medical advice. Consult with a healthcare professional for proper diagnosis and treatment.";
      
      // Add bot message
      setChatMessages(prevMessages => [
        ...prevMessages,
        {
          id: (Date.now() + 1).toString(),
          message: botResponse,
          isBot: true
        }
      ]);
      
      setLoading(false);
      
      toast({
        title: "Diagnosis Complete",
        description: "We've analyzed your symptoms and provided possible diagnoses.",
      });
    }, 1500);
  };

  return (
    <div className="mobile-container">
      <StatusBar />
      <Header title="Symptoms Checker" />
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
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
                <span>Analyzing symptoms...</span>
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
