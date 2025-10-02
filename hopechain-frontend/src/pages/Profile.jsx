import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import LoadingSpinner from '../components/LoadingSpinner';
import BlockchainBadge from '../components/BlockchainBadge';
import exportService from '../services/exportService';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
        setFormData(profile);
      } catch (err) {
        setError('Failed to load profile');
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedProfile = await authService.updateProfile(formData);
      setUser(updatedProfile);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setError('');
  };

  // Function to truncate DID for display
  const truncateDID = (did) => {
    if (!did) return '';
    if (did.length <= 20) return did;
    return `${did.substring(0, 10)}...${did.substring(did.length - 8)}`;
  };

  // Export profile data
  const handleExportProfile = () => {
    if (user) {
      exportService.exportUserProfile(user);
    }
  };

  if (loading) {
    return <LoadingSpinner size="large" message="Loading your profile..." />;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            user?.name?.charAt(0).toUpperCase() || '👤'
          )}
        </div>
        <div className="profile-info">
          <h1>{user?.name || 'Your Name'}</h1>
          <p className="profile-type">
            {user?.type === 'donor' ? '💝 Helper' : '🤝 Seeker'}
          </p>
          <p className="join-date">
            Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
          </p>
          {user?.did && (
            <div className="did-display">
              <span className="did-label">Blockchain ID: </span>
              <span className="did-value" title={user.did}>
                {truncateDID(user.did)}
              </span>
              <BlockchainBadge status="verified" size="small" />
            </div>
          )}
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <>
              <button 
                onClick={() => setIsEditing(true)} 
                className="edit-button"
              >
                ✏️ Edit Profile
              </button>
              <button 
                onClick={handleExportProfile} 
                className="export-button"
              >
                📤 Export Data
              </button>
            </>
          ) : (
            <div className="edit-actions">
              <button 
                onClick={handleCancel} 
                className="cancel-button"
                disabled={saving}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                className="save-button"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-content">
        <div className="profile-section">
          <h2>Personal Information</h2>
          <div className="profile-fields">
            <div className="field-group">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                />
              ) : (
                <p>{user?.name || 'Not provided'}</p>
              )}
            </div>

            <div className="field-group">
              <label>Email Address</label>
              <p>{user?.email || 'Not provided'}</p>
              <small>Email cannot be changed</small>
            </div>

            <div className="field-group">
              <label>Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                />
              ) : (
                <p>{user?.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="field-group">
              <label>Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your location"
                />
              ) : (
                <p>{user?.location || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>
            {user?.type === 'donor' ? 'How I Help' : 'What I Need'}
          </h2>
          <div className="field-group">
            {isEditing ? (
              <textarea
                name={user?.type === 'donor' ? 'skills' : 'needs'}
                value={formData[user?.type === 'donor' ? 'skills' : 'needs'] || ''}
                onChange={handleInputChange}
                placeholder={
                  user?.type === 'donor'
                    ? 'Describe how you\'d like to help others...'
                    : 'Describe what kind of help you need...'
                }
                rows="4"
              />
            ) : (
              <p className="description">
                {user?.skills || user?.needs || 'Not provided'}
              </p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Account Stats</h2>
          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-label">Hope Points</span>
              <span className="stat-value">42</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Connections</span>
              <span className="stat-value">3</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Impact Score</span>
              <span className="stat-value">7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;