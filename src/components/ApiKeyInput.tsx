
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
            Medical Info
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">
            This medical assistant provides professional clinical information based on current medical knowledge.
            All inquiries are processed with complete privacy and confidentiality.
            The system is designed to complement, not replace, consultation with licensed healthcare providers.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyInput;
