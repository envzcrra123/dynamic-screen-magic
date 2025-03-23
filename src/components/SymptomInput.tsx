
import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/button';

const SymptomInput: React.FC<{
  onSubmit: (input: string) => void;
  loading: boolean;
  placeholder?: string;
}> = ({ onSubmit, loading, placeholder = "Enter your symptoms..." }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  // Array of example prompts for the input suggestion
  const examplePrompts = [
    "I'm feeling anxious about my headache",
    "What can I do to feel better?",
    "I'm tired of this pain, it's frustrating",
    "I feel so down today with these symptoms",
    "I'm worried, is my fever serious?"
  ];
  
  // Randomly select one example prompt
  const randomPrompt = examplePrompts[Math.floor(Math.random() * examplePrompts.length)];

  return (
    <div className="w-full bg-gray-100 border border-gray-300 rounded-lg p-2 relative flex flex-col">
      <div className="flex items-center w-full">
        <button 
          className="text-gray-500 hover:text-medical-purple transition-colors mr-2"
          aria-label="Add attachment"
        >
          <Plus size={20} />
        </button>
        
        <textarea
          placeholder="Ask about symptoms, medications, or how you're feeling..."
          className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-gray-700 input-placeholder h-10 py-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        
        <Button 
          onClick={handleSubmit}
          disabled={!input.trim() || loading}
          className={`ml-2 p-1 h-8 w-8 rounded-full ${!input.trim() || loading ? 'bg-gray-300 text-gray-500' : 'bg-cyan-500 text-white hover:bg-cyan-600'}`}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </Button>
      </div>
      
      <div className="text-xs text-gray-500 mt-1 px-2">
        Try: "{randomPrompt}"
      </div>
    </div>
  );
};

export default SymptomInput;
