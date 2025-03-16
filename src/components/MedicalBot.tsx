
import React from 'react';
import { cn } from '@/lib/utils';

interface MedicalBotProps {
  className?: string;
}

const MedicalBot: React.FC<MedicalBotProps> = ({ className }) => {
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden mb-2 flex items-center justify-center">
        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-12 h-12 text-gray-600"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
              fill="currentColor"
            />
            <path
              d="M20 17.6075C19.4359 16.6454 18.5303 15.8781 17.4347 15.4257C16.339 14.9734 15.1102 14.8662 13.9305 15.119C13.1238 15.3098 12.4346 15.731 11.9999 16.314C11.3914 15.5056 10.5022 14.9663 9.50437 14.8019C8.50652 14.6375 7.48636 14.8606 6.64786 15.4257C5.54224 15.8781 4.63658 16.6454 4.07251 17.6075"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>
      <h3 className="text-xl font-bold text-center">Medical Bot</h3>
    </div>
  );
};

export default MedicalBot;
