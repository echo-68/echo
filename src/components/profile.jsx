import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { User, Mail, Edit, Save, LogOut } from 'lucide-react';
import './Profile.css';
import { updateProfile } from "firebase/auth";
import Header from './Header';

const Profile = ({ darkMode, toggleDarkMode, isLoggedIn }) => {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    photoURL: ''
  });

  const handleSave = async () => {
    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: formData.displayName,
          photoURL: formData.photoURL,
        });
        setUser({ ...auth.currentUser });
        setIsEditing(false);
        console.log("Profile updated");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        setFormData({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });
      } else {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    auth.signOut()
      .then(() => navigate('/'))
      .catch((error) => console.error('Logout error:', error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className={`profile-page ${darkMode ? 'dark' : 'light'}`}>
        <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        isLoggedIn={isLoggedIn}
      />
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-container">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="profile-avatar" />
            ) : (
              <div className="default-avatar">
                <User size={48} />
              </div>
            )}
          </div>
          {isEditing ? (
            <>
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="profile-name-input"
              />
              <input
                type="text"
                name="photoURL"
                placeholder="Image URL"
                value={formData.photoURL}
                onChange={handleInputChange}
                className="profile-url-input"
              />
            </>
          ) : (
            <h2 className="profile-name">{user?.displayName || 'Anonymous User'}</h2>
          )}
        </div>

        <div className="profile-details">
          <div className="detail-item">
            <Mail size={20} className="detail-icon" />
            <span className="detail-label">Email:</span>
            <span className="detail-value">{user?.email}</span>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <button onClick={handleSave} className="save-btn">
              <Save size={18} /> Save Changes
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="edit-btn">
              <Edit size={18} /> Edit Profile
            </button>
          )}
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
        <button onClick={() => navigate(-1)} className="back-btn">
  ← Back
</button>

      </div>
    </div>
  );
};

export default Profile;