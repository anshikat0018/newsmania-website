import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import api from "../api/interceptor";

const ProtectedRoute = ({children}) => {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("auth/user/profile/me");
        // console.log("PROTECTED_ROUTE",res.data.data.role); 
        // console.log("PROTECTED_ROUTE",res.data.data.name); 
        if (res.data.data.role === 'admin') {
          setUser(null);
          return;
        }
        setUser(res.data.data);
        window.dispatchEvent(new Event("userUpdated"));
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if(loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (user === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm font-medium">Verifying...</p>
        </div>
      </div>
    );
  }

  // if (user == null) return <Navigate to="/sign-in" replace />;

  return React.cloneElement(children, { user });
};

export default ProtectedRoute;