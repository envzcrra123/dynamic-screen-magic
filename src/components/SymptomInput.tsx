
import React, { useState } from 'react';
import { Send, Plus } from 'lucide-react';
import { Button } from './ui/button';

const SymptomInput: React.FC<{
  onSubmit: (input: string) => void;
  loading: boolean;
}> = ({ onSubmit, loading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="w-full bg-white border border-gray-200 rounded-lg p-2 relative flex items-center">
      <button 
        className="text-medical-darkGray hover:text-medical-purple transition-colors mr-2"
        aria-label="Add attachment"
      >
        <Plus size={20} />
      </button>
      
      <textarea
        placeholder="Enter your symptoms..."
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
        className="ml-2 bg-medical-purple hover:bg-medical-purple/90 rounded-full p-2 h-auto w-auto"
        aria-label="Send message"
      >
        <Send size={18} className="text-white" />
      </Button>
    </div>
  );
};

export default SymptomInput;
