
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: string;
  isBot: boolean;
  className?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isBot, className }) => {
  return (
    <div className={cn(
      "flex items-start gap-2 max-w-[80%]",
      isBot ? "self-start" : "self-end ml-auto flex-row-reverse",
      className
    )}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        {isBot ? (
          <AvatarFallback className="bg-gray-300 text-gray-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-5 h-5"
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
          </AvatarFallback>
        ) : (
          <AvatarFallback className="bg-medical-purple text-white">
            <svg
              viewBox="0 0 24 24"
              fill="none" 
              className="w-5 h-5"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                fill="currentColor"
              />
              <path
                d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z"
                fill="currentColor" 
              />
            </svg>
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className={cn(
        "py-2 px-3 rounded-lg text-sm",
        isBot 
          ? "bg-gray-100 text-gray-800" 
          : "bg-medical-purple text-white"
      )}>
        {message}
      </div>
    </div>
  );
};

export default ChatMessage;
