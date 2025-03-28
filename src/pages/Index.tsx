
import React, { useState, useRef, useEffect } from 'react';
import StatusBar from '@/components/StatusBar';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import SymptomInput from '@/components/SymptomInput';
import ChatMessage from '@/components/ChatMessage';
import MedicalBot from '@/components/MedicalBot';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateAIResponse } from '@/utils/aiService';

interface ChatMessageType {
  id: string;
  message: string;
  isBot: boolean;
}

const Index: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hello! I\'m your medical assistant. Please describe your symptoms or ask any health-related questions, and I\'ll try to help. Remember, this is not a substitute for professional medical care.',
      isBot: true
    }
  ]);
  const [loading, setLoading] = useState(false);
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
      // Generate response using our simplified AI service
      const aiResponse = await generateAIResponse(input);
      
      if (aiResponse.isError) {
        toast({
          title: "AI Error",
          description: aiResponse.message,
          variant: "destructive"
        });
      }
      
      // Add AI response
      setChatMessages(prevMessages => [
        ...prevMessages,
        {
          id: (Date.now() + 1).toString(),
          message: aiResponse.message,
          isBot: true
        }
      ]);
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

  return (
    <div className="mobile-container">
      <StatusBar />
      <Header title="Symptoms Checker" />
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        {chatMessages.length <= 1 && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center">
            <MedicalBot className="mb-4" />
            <div className="bg-gray-200 rounded-lg p-4 max-w-sm text-center text-gray-600 text-sm">
              Enter a brief patient's description and user will provide a list of possible disease diagnoses.
            </div>
          </div>
        )}
        
        {(chatMessages.length > 1 || loading) && (
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
                  <span>Analyzing your question...</span>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
        
        <div className="mt-4">
          <SymptomInput 
            onSubmit={handleSymptomSubmit} 
            loading={loading}
            placeholder="Enter a brief patient's description..."
          />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
