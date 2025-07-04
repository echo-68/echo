import React, { useState, useEffect } from "react";
import { MessageCircle, LogIn, Mail, Lock, User } from "lucide-react";
import "./Welcome.css";
import { auth, provider } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import Header from "./Header";

const Welcome = ({ onGuestContinue }) => {
  const [user, setUser] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        navigate("/chat");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const savedMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedMode);
    document.documentElement.classList.toggle('dark', savedMode);
    document.documentElement.classList.toggle('light', !savedMode);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    document.documentElement.classList.toggle('dark', newMode);
    document.documentElement.classList.toggle('light', !newMode);
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
      navigate("/chat");
    } catch (error) {
      console.error("Google Login failed:", error);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const result = await signInWithEmailAndPassword(auth, email, password);
        setUser(result.user);
      } else {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        // Update user profile with display name
        await updateProfile(result.user, {
          displayName: name
        });
        setUser({ ...result.user, displayName: name });
      }
      navigate("/chat");
    } catch (error) {
      console.error(isLogin ? "Login failed:" : "Signup failed:", error);
      alert(
        isLogin
          ? "Invalid email or password."
          : "Signup failed. Please try again."
      );
    }
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} isLoggedIn={!!user}/>

      <div className="welcome-container">
        <div className="welcome-box">
          {!showAuthForm ? (
            <>
              <div className="welcome-header">
                <div className="welcome-icon-circle">
                  <MessageCircle size={40} className="welcome-icon" />
                </div>
                <h1 className="welcome-title">Welcome to Echo</h1>
                <p className="welcome-subtext">
                  Your AI companion that learns and adapts to your unique
                  personality and communication style.
                </p>
              </div>

              <div className="welcome-buttons">
                <button
                  onClick={handleGoogleLogin}
                  className="login-btn google-btn"
                >
                  <svg className="google-icon" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => setShowAuthForm(true)}
                  className="login-btn email-btn"
                >
                  <Mail size={18} />
                  Continue with Email
                </button>
              </div>

              <div className="welcome-features">
                <div className="feature">
                  <div className="dot sky"></div>
                  <span>Personalized AI responses</span>
                </div>
                <div className="feature">
                  <div className="dot blue"></div>
                  <span>Secure and private conversations</span>
                </div>
                <div className="feature">
                  <div className="dot indigo"></div>
                  <span>Chat history and favorites</span>
                </div>
              </div>
            </>
          ) : (
            <div className="auth-form-container">
              <h2 className="auth-form-title">
                {isLogin ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="auth-form-subtitle">
                {isLogin
                  ? "Log in to continue your conversation"
                  : "Sign up to get started"}
              </p>

              <form onSubmit={handleEmailAuth} className="email-auth-form">
                {!isLogin && (
                  <div className="input-group">
                    <User size={18} className="input-icon" />
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="auth-input"
                    />
                  </div>
                )}

                <div className="input-group">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>

                <div className="input-group">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="auth-input"
                  />
                </div>

                <button type="submit" className="submit-auth-btn">
                  {isLogin ? "Log In" : "Sign Up"}
                </button>
              </form>

              <div className="auth-form-footer">
                <span>
                  {isLogin
                    ? "Don't have an account?"
                    : "Already have an account?"}
                </span>
                <button
                  type="button"
                  className="toggle-auth-btn"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    // Clear form when toggling
                    if (!isLogin) {
                      setName("");
                    }
                    setEmail("");
                    setPassword("");
                  }}
                >
                  {isLogin ? "Sign Up" : "Log In"}
                </button>
              </div>

              <button
                className="back-btn"
                onClick={() => {
                  setShowAuthForm(false);
                  setIsLogin(true);
                  setName("");
                  setEmail("");
                  setPassword("");
                }}
              >
                ← Back to all options
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Welcome;