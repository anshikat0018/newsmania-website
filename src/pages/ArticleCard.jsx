import { Bookmark, Star, Clock, Calendar, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ArticleCard = ({ id, category, title, date, image, readTime }) => {
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate(`/article/${id}`)}
      className="group cursor-pointer py-5 border-b border-gray-100 hover:border-gray-300 transition-colors duration-300"
    >
      <div className="flex items-start gap-5">
        
        {/* LEFT: Text content */}
        <div className="flex-1 flex flex-col gap-2 min-w-0">

          {/* Category badge */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-[11px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full">
              <Star size={9} className="fill-amber-500 text-amber-500" />
              {category}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-[17px] sm:text-lg font-bold leading-snug text-gray-900 group-hover:text-black line-clamp-2 transition-colors">
            <span className="bg-gradient-to-r from-gray-900 to-gray-900 bg-[length:0%_1px] bg-no-repeat bg-bottom group-hover:bg-[length:100%_1px] transition-all duration-500">
              {title}
            </span>
          </h2>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[12px] text-gray-400 mt-auto pt-1">
            <span className="flex items-center gap-1">
              <Calendar size={12} className="text-gray-400" />
              {date}
            </span>
            {readTime && (
              <>
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 block" />
                <span className="flex items-center gap-1">
                  <Clock size={12} className="text-gray-400" />
                  {readTime} min read
                </span>
              </>
            )}
            <span className="ml-auto flex items-center gap-0.5 text-gray-300 group-hover:text-gray-700 transition-colors duration-300">
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>

        {/* RIGHT: Thumbnail */}
        <div className="relative w-24 h-16 sm:w-36 sm:h-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <img
            src={`http://localhost:5000${image}`}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Bookmark button overlay */}
          <button
            onClick={(e) => { e.stopPropagation(); /* handle bookmark */ }}
            className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm hover:bg-white"
          >
            <Bookmark size={11} className="text-gray-600" />
          </button>
        </div>

      </div>
    </article>
  );
};

export default ArticleCard;