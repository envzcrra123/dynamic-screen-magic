
import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';
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

  return (
    <div className="w-full bg-gray-200 border border-gray-300 rounded-lg p-2 relative flex items-center">
      <button 
        className="text-gray-500 hover:text-medical-purple transition-colors mr-2"
        aria-label="Add attachment"
      >
        <Plus size={20} />
      </button>
      
      <textarea
        placeholder={placeholder}
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
        variant="ghost"
        className="ml-2 text-gray-600 hover:text-gray-800 p-1 h-auto w-auto"
        aria-label="Send message"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 9L12 12.5L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17V7C2 5.89543 2.89543 5 4 5H20C21.1046 5 22 5.89543 22 7V17C22 18.1046 21.1046 19 20 19H4C2.89543 19 2 18.1046 2 17Z" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
      </Button>
    </div>
  );
};

export default SymptomInput;
