
import React, { useState } from 'react';
import { Plus, Copy } from 'lucide-react';

const SymptomInput: React.FC<{
  onSubmit: (input: string) => void;
}> = ({ onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);
      setInput('');
    }
  };

  return (
    <div className="w-full bg-medical-gray rounded-lg p-4 relative">
      <textarea
        placeholder="Enter a brief patient's description and user will provide a list of possible disease diagnoses."
        className="w-full bg-transparent border-none outline-none resize-none text-sm text-gray-700 input-placeholder h-16"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      />
      <div className="flex justify-between mt-1">
        <button 
          className="text-medical-darkGray hover:text-medical-purple transition-colors"
          aria-label="Add attachment"
        >
          <Plus size={20} />
        </button>
        <button 
          className="text-medical-darkGray hover:text-medical-purple transition-colors"
          aria-label="Copy text"
        >
          <Copy size={20} />
        </button>
      </div>
    </div>
  );
};

export default SymptomInput;
