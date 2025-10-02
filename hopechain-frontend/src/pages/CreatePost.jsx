import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService, URGENCY_LEVELS } from '../services/postService';
import ResourceTypeSelector from '../components/ResourceTypeSelector';
import LoadingSpinner from '../components/LoadingSpinner';
import './CreatePost.css';

const CreatePost = () => {
  const navigate = useNavigate();
  
  const [postType, setPostType] = useState('offer'); // 'offer' or 'need'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    resourceType: '',
    location: '',
    quantity: '',
    unit: '',
    contactMethod: '',
    // Offer-specific fields
    availability: '',
    // Need-specific fields
    urgency: 'medium',
    deadline: '',
    beneficiaries: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleResourceTypeSelect = (resourceType) => {
    setFormData(prev => ({
      ...prev,
      resourceType
    }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Please provide a title');
      return false;
    }
    
    if (!formData.description.trim()) {
      setError('Please provide a description');
      return false;
    }
    
    if (!formData.resourceType) {
      setError('Please select a resource type');
      return false;
    }
    
    if (!formData.location.trim()) {
      setError('Please provide a location');
      return false;
    }
    
    if (formData.quantity && isNaN(Number(formData.quantity))) {
      setError('Quantity must be a valid number');
      return false;
    }
    
    if (postType === 'need' && formData.beneficiaries && isNaN(Number(formData.beneficiaries))) {
      setError('Number of beneficiaries must be a valid number');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const postData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        resourceType: formData.resourceType,
        location: formData.location.trim(),
        contactMethod: formData.contactMethod.trim() || 'Contact through platform',
        ...(formData.quantity && { 
          quantity: Number(formData.quantity),
          unit: formData.unit.trim() || 'items'
        })
      };
      
      if (postType === 'offer') {
        if (formData.availability) {
          postData.availability = formData.availability.trim();
        }
        await postService.createOffer(postData);
        setSuccess('Offer created successfully! 🎉');
      } else {
        postData.urgency = formData.urgency;
        if (formData.deadline) {
          postData.deadline = formData.deadline;
        }
        if (formData.beneficiaries) {
          postData.beneficiaries = Number(formData.beneficiaries);
        }
        await postService.createNeed(postData);
        setSuccess('Need posted successfully! 🙏');
      }
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/browse');
      }, 2000);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      resourceType: '',
      location: '',
      quantity: '',
      unit: '',
      contactMethod: '',
      availability: '',
      urgency: 'medium',
      deadline: '',
      beneficiaries: ''
    });
    setError('');
    setSuccess('');
  };

  if (loading) {
    return <LoadingSpinner size="large" message={`Creating your ${postType}...`} />;
  }

  return (
    <div className="create-post-container">
      <div className="create-post-header">
        <h1>🤝 Share Your Heart</h1>
        <p>Whether you're offering help or seeking support, every connection matters</p>
      </div>

      <div className="post-type-selector">
        <div className="type-tabs">
          <button
            type="button"
            className={`type-tab ${postType === 'offer' ? 'active' : ''}`}
            onClick={() => {
              setPostType('offer');
              resetForm();
            }}
          >
            <span className="tab-icon">💝</span>
            <span className="tab-text">I Want to Help</span>
          </button>
          <button
            type="button"
            className={`type-tab ${postType === 'need' ? 'active' : ''}`}
            onClick={() => {
              setPostType('need');
              resetForm();
            }}
          >
            <span className="tab-icon">🙏</span>
            <span className="tab-text">I Need Help</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-post-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-group">
            <label htmlFor="title">
              {postType === 'offer' ? 'What are you offering?' : 'What do you need?'}
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder={
                postType === 'offer' 
                  ? 'e.g., Free tutoring for math students'
                  : 'e.g., Need groceries for family of 4'
              }
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder={
                postType === 'offer'
                  ? 'Describe what you\'re offering, any conditions, and how people can benefit...'
                  : 'Describe your situation, why you need help, and any specific requirements...'
              }
              rows="4"
              required
            />
          </div>

          <ResourceTypeSelector
            selectedType={formData.resourceType}
            onTypeSelect={handleResourceTypeSelect}
          />
        </div>

        <div className="form-section">
          <h2>Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="quantity">
                {postType === 'offer' ? 'Quantity Available' : 'Quantity Needed'}
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter number"
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="unit">Unit</label>
              <input
                type="text"
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                placeholder="e.g., hours, meals, bags"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="City, State or general area"
              required
            />
          </div>

          {postType === 'offer' && (
            <div className="form-group">
              <label htmlFor="availability">Availability</label>
              <input
                type="text"
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleInputChange}
                placeholder="e.g., Weekends, After 6 PM, Flexible"
              />
            </div>
          )}

          {postType === 'need' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="urgency">Urgency Level</label>
                  <select
                    id="urgency"
                    name="urgency"
                    value={formData.urgency}
                    onChange={handleInputChange}
                  >
                    {Object.entries(URGENCY_LEVELS).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value.charAt(0).toUpperCase() + value.slice(1)} Priority
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label htmlFor="deadline">Deadline (Optional)</label>
                  <input
                    type="date"
                    id="deadline"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="beneficiaries">Number of People This Will Help</label>
                <input
                  type="number"
                  id="beneficiaries"
                  name="beneficiaries"
                  value={formData.beneficiaries}
                  onChange={handleInputChange}
                  placeholder="How many people will benefit?"
                  min="1"
                />
              </div>
            </>
          )}
        </div>

        <div className="form-section">
          <h2>Contact Information</h2>
          
          <div className="form-group">
            <label htmlFor="contactMethod">Preferred Contact Method</label>
            <input
              type="text"
              id="contactMethod"
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleInputChange}
              placeholder="e.g., Phone, Email, HopeChain messages"
            />
            <small>Leave blank to use HopeChain's built-in messaging system</small>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/browse')}
            className="cancel-button"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="submit-button"
          >
            {postType === 'offer' ? 'Share Your Offer 💝' : 'Post Your Need 🙏'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;