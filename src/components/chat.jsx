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

  // 🎤 Voice-to-text
const startListening = () => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const spokenText = event.results[0][0].transcript;
    console.log("🎙️ You said:", spokenText);
    handleSendVoice(spokenText); // Voice-based handler
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };

  recognition.start();
};

// 🔊 Echo speaks back
const speakText = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-IN";
  utterance.pitch = 1;
  utterance.rate = 1;

  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find((v) => v.lang === "en-IN") || voices[0];
  if (indianVoice) utterance.voice = indianVoice;

  window.speechSynthesis.speak(utterance);
};


  const handleSend = async () => {
    if (input.trim() === "") return;
  
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
  
    try {
      const userId = auth.currentUser?.uid;
  
      const res = await fetch("http://localhost:5000/api/echo/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          userMessage: input,
        }),
      });
  
      const data = await res.json();
      const botReply = {
        sender: "bot",
        text: data.reply,
      };
  
      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      console.error("Echo API error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Echo is currently offline. Please try again later 🛠️",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendVoice = async (spokenText) => {
  if (!spokenText.trim()) return;

  const userMessage = { sender: "user", text: spokenText };
  setMessages((prev) => [...prev, userMessage]);
  setIsTyping(true);

  try {
    const userId = auth.currentUser?.uid;

    const res = await fetch("http://localhost:5000/api/echo/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userMessage: spokenText,
      }),
    });

    const data = await res.json();
    const botReply = {
      sender: "bot",
      text: data.reply,
    };

    setMessages((prev) => [...prev, botReply]);
    speakText(data.reply); // 🔊 Speak Echo's reply
  } catch (err) {
    console.error("Echo voice API error:", err);
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Echo is having trouble replying. Try again later 😔",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
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
        <button
          onClick={startListening}
          className="mic-button"
          title="Talk to Echo"
        >
          🎙️
        </button>

      </div>
    </div>
  );
};

export default ChatPage;