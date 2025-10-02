import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './AuthPages.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    type: 'recipient',
    phone: '',
    location: '',
    needs: '',
    skills: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Prepare data for backend - MATCHING BACKEND EXPECTED FIELDS
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        type: formData.type,
        location: formData.location || 'Not specified'
      };

      // Add type-specific fields ONLY if they have values
      if (formData.type === 'recipient' && formData.needs) {
        registrationData.needs = formData.needs;
      } else if (formData.type === 'donor' && formData.skills) {
        registrationData.skills = formData.skills;
      }

      await authService.register(registrationData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 1) {
      // Validate basic info before proceeding
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    setError('');
    setCurrentStep(2);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(1);
  };

  return (
    <div className="auth-container">
      <div className="auth-split-layout">
        {/* Left Side - Branding */}
        <div className="auth-brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <div className="logo-icon">HC</div>
              <h1>HopeChain</h1>
            </div>
            <h2>Start Your Journey of Impact</h2>
            <p>Whether you're seeking help or offering support, join our community of changemakers making a real difference.</p>
            
            <div className="signup-steps">
              <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
                <div className="step-number">1</div>
                <span>Basic Information</span>
              </div>
              <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
                <div className="step-number">2</div>
                <span>Profile Details</span>
              </div>
            </div>

            <div className="brand-stats">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <span>Active Members</span>
              </div>
              <div className="stat-item">
                <div className="stat-number">50K+</div>
                <span>Lives Impacted</span>
              </div>
              <div className="stat-item">
                <div className="stat-number">100%</div>
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="auth-form-section">
          <div className="form-container">
            <div className="form-header">
              <h2>Create Your Account</h2>
              <p>Join thousands making a difference</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {currentStep === 1 && (
                <>
                  <div className="form-group">
                    <label htmlFor="name">Full Name</label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                          <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Enter your full name"
                        autoComplete="name"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                      <div className="input-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="Enter your email"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <circle cx="12" cy="16" r="1"></circle>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                        <input
                          type={showPassword ? "text" : "password"}
                          id="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Create a password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="confirmPassword">Confirm Password</label>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <circle cx="12" cy="16" r="1"></circle>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </div>
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm your password"
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                              <line x1="1" y1="1" x2="23" y2="23"></line>
                            </svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                              <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="error-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                      {error}
                    </div>
                  )}

                  <button type="button" className="auth-button" onClick={nextStep}>
                    Continue
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9,18 15,12 9,6"></polyline>
                    </svg>
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="form-group">
                    <label htmlFor="type">I am a:</label>
                    <div className="radio-group">
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="type"
                          value="recipient"
                          checked={formData.type === 'recipient'}
                          onChange={handleChange}
                        />
                        <div className="radio-content">
                          <div className="radio-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M9 12l2 2 4-4"></path>
                              <circle cx="12" cy="12" r="10"></circle>
                            </svg>
                          </div>
                          <div>
                            <strong>Seeker</strong>
                            <p>Looking for help and support</p>
                          </div>
                        </div>
                      </label>
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="type"
                          value="donor"
                          checked={formData.type === 'donor'}
                          onChange={handleChange}
                        />
                        <div className="radio-content">
                          <div className="radio-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                            </svg>
                          </div>
                          <div>
                            <strong>Helper</strong>
                            <p>Ready to offer support</p>
                          </div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone">Phone Number</label>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                          </svg>
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="Your phone number"
                          autoComplete="tel"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label htmlFor="location">Location</label>
                      <div className="input-wrapper">
                        <div className="input-icon">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="City, State"
                          autoComplete="address-level2"
                        />
                      </div>
                    </div>
                  </div>

                  {formData.type === 'recipient' && (
                    <div className="form-group">
                      <label htmlFor="needs">What kind of help do you need?</label>
                      <textarea
                        id="needs"
                        name="needs"
                        value={formData.needs}
                        onChange={handleChange}
                        placeholder="Briefly describe your needs or situation..."
                        rows="3"
                      />
                    </div>
                  )}

                  {formData.type === 'donor' && (
                    <div className="form-group">
                      <label htmlFor="skills">How would you like to help?</label>
                      <textarea
                        id="skills"
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="Describe your skills, resources, or how you'd like to contribute..."
                        rows="3"
                      />
                    </div>
                  )}

                  {error && (
                    <div className="error-message">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="button" className="auth-button secondary" onClick={prevStep}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="15,18 9,12 15,6"></polyline>
                      </svg>
                      Back
                    </button>
                    <button type="submit" className="auth-button" disabled={loading}>
                      {loading ? (
                        <>
                          <div className="loading-spinner"></div>
                          Creating Account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>

            <div className="auth-footer">
              <p>
                Already have an account?{' '}
                <Link to="/login" className="auth-link">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
