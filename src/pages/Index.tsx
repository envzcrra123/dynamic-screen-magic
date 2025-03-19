
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
      message: 'Hello! I\'m your medical assistant powered by Dialogflow. Please describe your symptoms or ask any health-related questions, and I\'ll try to help. Remember, this is not a substitute for professional medical care.',
      isBot: true
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
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
      if (apiKey.trim()) {
        // Use Dialogflow-powered response
        const aiPrompt = `${input}`;
        
        const aiResponse = await generateAIResponse(aiPrompt, apiKey);
        
        if (aiResponse.isError) {
          toast({
            title: "AI Error",
            description: "Could not get a Dialogflow response. Please check your API key or try again later.",
            variant: "destructive"
          });
          
          // Add error message
          setChatMessages(prevMessages => [
            ...prevMessages,
            {
              id: (Date.now() + 1).toString(),
              message: "I'm sorry, I couldn't process your request. Please check your Dialogflow API key and try again.",
              isBot: true
            }
          ]);
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
        }
      } else {
        // No API key provided
        setChatMessages(prevMessages => [
          ...prevMessages,
          {
            id: (Date.now() + 1).toString(),
            message: "To get accurate medical advice, please set your Dialogflow API key using the button in the top-right corner. Without an API key, I can't provide personalized medical information.",
            isBot: true
          }
        ]);
        
        toast({
          title: "API Key Required",
          description: "Please set your Dialogflow API key to use the medical assistant.",
          variant: "destructive"
        });
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

  return (
    <div className="mobile-container">
      <StatusBar />
      <Header title="Medical Assistant">
        <ApiKeyInput onApiKeyChange={setApiKey} />
      </Header>
      
      <main className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="mb-3">
          <div className={`rounded-lg text-xs py-1 px-2 inline-block ${apiKey ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {apiKey ? 'Dialogflow-Powered Assistant' : 'Dialogflow API Key Required'}
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
          <SymptomInput onSubmit={handleSymptomSubmit} loading={loading} />
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
};

export default Index;
