import React, { useState } from 'react';
import { MessageCircle, LogIn, UserPlus } from 'lucide-react';
import './Welcome.css';
import { auth, provider } from '../firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

const Welcome = ({ onGuestContinue }) => {
  const [user, setUser] = useState(null);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error('Google Login failed:', error);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setUser(result.user);
    } catch (error) {
      console.error('Email Login failed:', error);
      alert('Invalid email or password.');
    }
  };

  const handleGuest = () => {
    setUser({ isGuest: true });
    onGuestContinue(); // callback
  };

  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <div className="welcome-header">
          <div className="welcome-icon-circle">
            <MessageCircle size={40} className="welcome-icon" />
          </div>
          <h1 className="welcome-title">Welcome to Echo</h1>
          <p className="welcome-subtext">
            Your AI companion that learns and adapts to your unique personality and communication style.
          </p>
        </div>

        <div className="welcome-buttons">
          <button onClick={handleGoogleLogin} className="login-btn">
            <LogIn size={20} />
            Login with Google
          </button>

          <button onClick={() => setShowEmailForm(!showEmailForm)} className="login-btn">
            <LogIn size={20} />
            Login with Email
          </button>

          <button onClick={handleGuest} className="guest-btn">
            <UserPlus size={20} />
            Continue as Guest
          </button>
        </div>

        {showEmailForm && (
          <form onSubmit={handleEmailLogin} className="email-login-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="email-input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="password-input"
            />
            <button type="submit" className="submit-email-btn">
              Login
            </button>
          </form>
        )}

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
      </div>
    </div>
  );
};

export default Welcome;
