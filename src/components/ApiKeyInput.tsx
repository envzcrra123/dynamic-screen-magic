
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
            Medical Information
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[300px] p-4">
          <p className="text-sm">
            This medical assistant provides professional clinical information based on current medical knowledge and best practices.
            The system utilizes advanced intent recognition and contextual awareness to deliver accurate responses to your health inquiries.
            Responses include proper medical terminology and professional assessments for various conditions and treatments.
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ApiKeyInput;
