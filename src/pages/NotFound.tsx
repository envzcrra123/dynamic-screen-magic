
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatusBar from "@/components/StatusBar";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="mobile-container">
      <StatusBar />
      
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-24 h-24 bg-medical-purple/10 rounded-full flex items-center justify-center mb-6">
          <span className="text-5xl text-medical-purple">404</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-gray-600 text-center mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>
        
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center space-x-2 bg-medical-purple text-white px-6 py-3 rounded-lg transition-transform hover:scale-105 active:scale-95"
        >
          <ArrowLeft size={18} />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};

export default NotFound;
