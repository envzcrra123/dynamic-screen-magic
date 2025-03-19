
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

interface ChatMessageType {
  id: string;
  message: string;
  isBot: boolean;
}

const Index: React.FC = () => {
  const [chatMessages, setChatMessages] = useState<ChatMessageType[]>([
    {
      id: '1',
      message: 'Hello! I\'m your medical assistant powered by an AI model running in your browser. Please describe your symptoms or ask any health-related questions, and I\'ll try to help. Remember, this is not a substitute for professional medical care.',
      isBot: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Effect for loading the AI model on component mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        setModelLoading(true);
        // We'll just try to generate a simple response to trigger model loading
        await generateAIResponse("Initialize");
        setModelLoading(false);
      } catch (error) {
        console.error("Error loading AI model:", error);
        toast({
          title: "Model Loading Error",
          description: "There was a problem loading the AI model. Please refresh and try again.",
          variant: "destructive"
        });
      }
    };
    
    loadModel();
  }, []);

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
      // Generate response using the client-side AI model
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
      <Header title="Medical Assistant">
        <ApiKeyInput />
      </Header>
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="mb-3">
          <div className={`rounded-lg text-xs py-1 px-2 inline-block ${!modelLoading ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {!modelLoading ? 'AI Model Loaded - Ready to Help' : 'AI Model Loading...'}
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
                <span>Analyzing your question...</span>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="mt-4">
          <SymptomInput onSubmit={handleSymptomSubmit} loading={loading || modelLoading} />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
