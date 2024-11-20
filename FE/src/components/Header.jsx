import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('token') ? true : false);

  useEffect(() => {
    // Update authentication status on component mount, in case the token changes
    setIsAuthenticated(localStorage.getItem('token') ? true : false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("isAdmin");
    setIsAuthenticated(false); // Update the state after logout
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <div className="text-2xl font-bold text-yellow-400">GOLDEN CMA</div>
        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/wingo" className="bg-blue-500 text-white px-4 py-1 rounded">WinGo</Link>
              <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-1 rounded">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register" className="bg-blue-500 text-white px-4 py-1 rounded">
                Register
              </Link>
              <Link to="/login" className="text-white">
                Login
              </Link>
            </>
          )}
        </div>
      </header>
    </div>
  );
}

export default Header;
