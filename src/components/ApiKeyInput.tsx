
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
            AI Info
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">
            This medical assistant uses a local AI model that runs directly in your browser.
            No external APIs are used, and your questions remain private.
            For serious medical concerns, please consult a healthcare professional.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyInput;
