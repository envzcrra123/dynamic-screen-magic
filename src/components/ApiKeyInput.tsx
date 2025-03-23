
import React from 'react';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

const ApiKeyInput: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            aria-label="About AI Model"
          >
            <Info size={14} />
            Medical Assistance
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">
            This medical assistant provides professional clinical information based on current medical knowledge and best practices.
            The system recognizes emotional cues and offers empathetic support alongside medical guidance.
            It can detect when you're feeling frustrated, anxious, or confused, and adapts its responses accordingly to provide both emotional support and accurate medical information.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyInput;
