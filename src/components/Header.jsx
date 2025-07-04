import React, { useEffect } from "react";
import { Moon, Sun, User } from "lucide-react"; // Added User icon
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Header = ({ darkMode, toggleDarkMode, isLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  const handleProfile = () => {
    navigate("/profile"); // Navigate to profile page
  };

  // Apply dark mode class to document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    document.documentElement.classList.toggle('light', !darkMode);
  }, [darkMode]);

  return (
    <header
      className={`w-full h-16 flex items-center justify-between px-6 fixed top-0 z-50 transition-colors duration-300 ${
        darkMode ? "bg-gray-900" : "bg-white shadow-md"
      }`}
    >
      <h1
        className={`text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text ${
          darkMode ? "drop-shadow-[0_0_12px_rgba(147,197,253,0.4)]" : ""
        }`}
      >
        Echo
      </h1>
      
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full transition-colors ${
            darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
          }`}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <Sun size={24} className="text-yellow-300" />
          ) : (
            <Moon size={24} className="text-gray-700" />
          )}
        </button>

        {isLoggedIn && (
          <>
            <button
              onClick={handleProfile}
              className={`p-2 rounded-full transition-colors ${
                darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
              }`}
              aria-label="Profile"
            >
              <User size={24} className={darkMode ? "text-white" : "text-gray-700"} />
            </button>
            
            <button
              onClick={handleLogout}
              className={`px-4 py-2 rounded-full flex items-center gap-2 transition-colors ${
                darkMode
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-red-500 hover:bg-red-600 text-white"
              }`}
            >
              <span className="text-sm font-medium">Logout</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;