
import React from 'react';
import { Home, MapPin, Phone, MessageCircle, User } from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, active = false, onClick }) => {
  return (
    <button 
      className={`nav-item ${active ? 'nav-item-active' : 'nav-item-inactive'}`} 
      onClick={onClick}
    >
      {icon}
    </button>
  );
};

const BottomNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('home');

  return (
    <div className="w-full bg-medical-purple px-2 py-1 flex justify-between items-center mt-auto">
      <NavItem 
        icon={<Home size={24} />} 
        active={activeTab === 'home'} 
        onClick={() => setActiveTab('home')}
      />
      <NavItem 
        icon={<MapPin size={24} />} 
        active={activeTab === 'location'} 
        onClick={() => setActiveTab('location')}
      />
      <NavItem 
        icon={<Phone size={24} />} 
        active={activeTab === 'call'} 
        onClick={() => setActiveTab('call')}
      />
      <NavItem 
        icon={<MessageCircle size={24} />} 
        active={activeTab === 'messages'} 
        onClick={() => setActiveTab('messages')}
      />
      <NavItem 
        icon={<User size={24} />} 
        active={activeTab === 'profile'} 
        onClick={() => setActiveTab('profile')}
      />
    </div>
  );
};

export default BottomNavigation;
