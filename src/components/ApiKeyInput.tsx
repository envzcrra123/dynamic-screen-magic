
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
            Medical Support
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">
            This medical assistant provides professional clinical information while recognizing your emotional needs. 
            The system combines medical expertise with emotional intelligence to deliver accurate and empathetic responses
            to your health inquiries. We understand that health concerns can be stressful, and we're here to support you
            with both medical guidance and compassionate care.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyInput;
