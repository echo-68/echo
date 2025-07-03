import React from "react";
import { Moon, Sun } from "lucide-react";

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header
      className={`w-full h-16 flex items-center justify-between px-6 fixed top-0 z-50 transition-colors duration-300 ${
        darkMode ? "dark-mode-header" : "light-mode-header"
      }`}
    >
      <h1
        className={`text-4xl sm:text-5xl font-extrabold tracking-wide bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text ${
          darkMode ? "drop-shadow-[0_0_12px_rgba(147,197,253,0.4)]" : ""
        }`}
      >
        Echo
      </h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-opacity-10 transition-colors"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? (
          <Sun size={30} className="text-white" />
        ) : (
          <Moon size={30} className="text-gray-900" />
        )}
      </button>
    </header>
  );
};

export default Header;
