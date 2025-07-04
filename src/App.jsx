import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./components/Welcome";
import ChatPage from "./components/chat";
import Profile from "./components/profile.jsx";

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      localStorage.setItem("darkMode", !prev);
      return !prev;
    });
  };

  useEffect(() => {
    document.documentElement.className = darkMode ? "dark" : "light";
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/chat" element={<ChatPage darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/profile" element={<Profile darkMode={darkMode} toggleDarkMode={toggleDarkMode} />} />
      </Routes>
    </Router>
  );
}

export default App;
