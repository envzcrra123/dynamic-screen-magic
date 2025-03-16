
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // In a real app, this would navigate back
    // For now we'll just prevent going anywhere as we only have one page
    console.log('Back button pressed');
  };

  return (
    <div className="w-full bg-medical-purple text-white py-3 px-4 flex items-center">
      <button 
        onClick={handleBack}
        className="mr-4 hover:bg-white/10 rounded-full p-1 transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={24} />
      </button>
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
};

export default Header;
