import { useNavigate, useLocation } from 'react-router-dom';

const NavItem = ({ icon, label }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const routes = {
    "Home": "/",
    "Library": "/library",
    "Profile": "/profile",
    "Saved": "/saved",
    "Liked": "/liked",
  };

  const isActive = location.pathname === routes[label];

  return (
    <div 
      onClick={() => navigate(routes[label])}
      className={`flex items-center space-x-4 p-2 cursor-pointer transition-colors ${isActive ? 'text-black' : 'text-gray-500 hover:text-black'}`}
    >
      {icon}
      <span className="hidden lg:block text-sm">{label}</span>
    </div>
  );
};

export default NavItem;