import React from 'react';
import { Flame, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RecentPick = ({ id, title, date }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/article/${id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="group cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Flame size={14} className="text-orange-500 flex-shrink-0" />
            <span className="text-xs text-gray-500 font-medium">{date}</span>
          </div>
          <h4 className="text-sm font-bold leading-tight text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-2">
            {title}
          </h4>
        </div>
        <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0 mt-1 transition-colors" />
      </div>
    </div>
  );
};

export default RecentPick;