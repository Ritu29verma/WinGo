import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Header({ isRegister, isLogin, isWingo, isLogout }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setIsAuthenticated(false);
          setIsAuthorized(false);
          return;
        }

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/auth/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setIsAuthenticated(true);
        setIsAuthorized(response.data.isAuthenticated); // Assumes the backend sends `isAuthenticated`
      } catch (error) {
        console.error("Authentication failed:", error);
        setIsAuthenticated(false);
        setIsAuthorized(false);
      }
    };

    checkUserAuthentication();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsAuthenticated(false);
    setIsAuthorized(false);
    window.location.href = "https://goldencma.com/logout";
  };

  return (
    <div>
      <header
        className={`flex ${
          isRegister || isLogin || isWingo || isLogout ? "justify-between" : "justify-center"
        } items-center p-4 bg-gray-800`}
      >
        <div className="text-2xl font-bold text-yellow-400">GOLDEN CMA</div>
        {(isRegister || isLogin || isWingo || isLogout) && (
          <div className="flex gap-4">
            {isAuthenticated && isAuthorized ? (
              <>
                {isWingo && (
                  <Link to="/wingo" className="bg-blue-500 text-white px-4 py-1 rounded">
                    WinGo
                  </Link>
                )}
                {isLogout && (
                  <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white px-4 py-1 rounded"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <>
                {isRegister && (
                  <Link to="/register" className="bg-blue-500 text-white px-4 py-1 rounded">
                    Register
                  </Link>
                )}
                {isLogin && (
                  <Link to="/login" className="text-white bg-green-500 px-4 py-1 rounded">
                    Login
                  </Link>
                )}
              </>
            )}
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
