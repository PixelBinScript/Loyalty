import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Gift, History, Home, Users, Settings } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Crown className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold">Loyalty Pro</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <NavLink to="/" icon={<Home className="h-5 w-5" />} text="Dashboard" />
            <NavLink to="/rewards" icon={<Gift className="h-5 w-5" />} text="Rewards" />
            <NavLink to="/customers" icon={<Users className="h-5 w-5" />} text="Customers" />
            <NavLink to="/activity" icon={<History className="h-5 w-5" />} text="Activity" />
            <NavLink to="/settings" icon={<Settings className="h-5 w-5" />} text="Settings" />
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; text: string }> = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 transition-colors"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Navigation;