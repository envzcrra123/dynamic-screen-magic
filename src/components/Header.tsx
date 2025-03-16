
import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    // Check if we can go back in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      console.log('No history to go back to');
    }
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
