import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Header({isRegister,isLogin, isWingo,isLogout}) {
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
      <header className={`flex ${
          (isRegister || isLogin || isWingo || isLogout) ? "justify-between" : "justify-center"
        } items-center p-4 bg-gray-800`}
      >
        <div className="text-2xl font-bold text-yellow-400">GOLDEN CMA</div>
        {(isRegister || isLogin || isWingo || isLogout) && (
          <div className="flex gap-4">
          {isAuthenticated ? (
            <>
             {
              isWingo && ( <Link to="/wingo" className="bg-blue-500 text-white px-4 py-1 rounded">WinGo</Link>)
             }
             {isLogout && ( <button onClick={handleLogout} className="bg-blue-500 text-white px-4 py-1 rounded">
                Logout
              </button>)}
            </>
          ) : (
            <>
             { isRegister && ( <Link to="/register" className="bg-blue-500 text-white px-4 py-1 rounded">
                Register
              </Link>)
             }
             {
              isLogin && (
                <Link to="/login" className="text-white">
                Login
              </Link>
              ) }
            </>
          )}
        </div>
        )}
      </header>
    </div>
  );
}

export default Header;
