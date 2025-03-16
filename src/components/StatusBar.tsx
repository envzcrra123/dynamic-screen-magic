
import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';

const StatusBar: React.FC = () => {
  // Get current time in format "10:00 AM"
  const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    return `${hours}:${minutes} ${ampm}`;
  };

  return (
    <div className="w-full px-4 py-2 bg-medical-purple text-white flex justify-between items-center">
      <div className="font-medium">{getCurrentTime()}</div>
      <div className="flex items-center space-x-2">
        <Wifi size={16} className="animate-pulse-slow" />
        <Signal size={16} />
        <Battery size={16} />
      </div>
    </div>
  );
};

export default StatusBar;
