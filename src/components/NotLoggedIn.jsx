import { useNavigate } from "react-router-dom";
import { User, Lock, LogIn, ArrowRight } from "lucide-react";
const NotLoggedIn = () => {
  const navigate = useNavigate();
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&display=swap');
        .pf-title { font-family: 'Playfair Display', Georgia, serif; }
        @keyframes floatIn { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        .float-in { animation: floatIn 0.5s ease both; }
        .float-in-2 { animation: floatIn 0.5s 0.1s ease both; }
        .float-in-3 { animation: floatIn 0.5s 0.2s ease both; }
      `}</style>

      <div className="flex flex-col items-center justify-center min-h-[72vh] px-4 text-center">
        {/* Icon ring */}
        <div className="float-in relative mb-8">
          <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
            <User size={38} className="text-amber-400" strokeWidth={1.5} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-sm">
            <Lock size={14} className="text-gray-400" />
          </span>
        </div>

        <h2 className="pf-title float-in-2 text-3xl font-bold text-gray-900 mb-2">
          You're not logged in
        </h2>
        <p className="float-in-2 text-[14px] text-gray-400 max-w-xs leading-relaxed mb-8">
          Sign in to view and manage your profile, bookmarks, and reading history.
        </p>

        <div className="float-in-3 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/sign-in')}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-[13px] font-semibold rounded-lg hover:bg-gray-800 active:scale-95 transition-all"
          >
            <LogIn size={15} />
            Sign In
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-200 text-gray-600 text-[13px] font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 active:scale-95 transition-all"
          >
            Create Account
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </>
  );
};

export default NotLoggedIn;