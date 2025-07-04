import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./Chat.css";
import Header from "./Header";

const ChatPage = ({ darkMode, toggleDarkMode }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  useEffect(() => {
    document.documentElement.className = darkMode ? 'dark' : 'light';
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
      if (!user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSend = () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot typing
    setIsTyping(true);

    // Simulate bot response after a delay
    setTimeout(() => {
      const botReply = {
        sender: "bot",
        text: getBotResponse(input),
      };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000); // Random delay between 1-3 seconds
  };

  const getBotResponse = (userInput) => {
    const inputLower = userInput.toLowerCase();
    const responses = [
      "That's an interesting point! Could you tell me more?",
      "I'm still learning about this topic. What else would you like to discuss?",
      "Thanks for sharing that with me!",
      "I'd love to hear more about your thoughts on this.",
      "That's something worth considering. What's your perspective?",
      "I'm just an AI, but I find that fascinating!",
      "Let me think about that... what else is on your mind?",
      "Interesting! I'm making notes to improve my knowledge.",
    ];

    // Some basic response matching
    if (inputLower.includes("hello") || inputLower.includes("hi")) {
      return "Hello there! How can I help you today?";
    }
    if (inputLower.includes("how are you")) {
      return "I'm just a bot, but I'm functioning well! How about you?";
    }
    if (inputLower.includes("thank")) {
      return "You're very welcome! Is there anything else I can help with?";
    }

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => console.error("Logout failed:", error));
  };

  return (
    <div className={`chat-page ${darkMode ? "dark" : "light"}`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isLoggedIn={isLoggedIn}
      />

      <div className="chat-window">
        {messages.length === 0 ? (
          <div className="welcome-message">
            <h3>Welcome to EchoChat!</h3>
            <p>Start a conversation by typing a message below.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`chat-bubble ${
                msg.sender === "user" ? "user" : "bot"
              } ${darkMode ? "dark" : "light"}`}
            >
              {msg.sender === "bot" && <div className="bot-avatar">🤖</div>}
              <div className="message-content">{msg.text}</div>
              {msg.sender === "user" && <div className="user-avatar">👤</div>}
            </div>
          ))
        )}
        {isTyping && (
          <div
            className={`chat-bubble bot typing-indicator ${
              darkMode ? "dark" : "light"
            }`}
          >
            <div className="bot-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-dots">
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={`chat-input-area ${darkMode ? "dark" : "light"}`}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          disabled={input.trim() === ""}
          className={input.trim() === "" ? "disabled" : ""}
        >
          <span className="send-icon">↑</span> Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;