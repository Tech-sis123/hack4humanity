import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postService } from '../services/postService';
import ResourceTypeSelector from '../components/ResourceTypeSelector';
import OfferCard from '../components/OfferCard';
import NeedCard from '../components/NeedCard';
import LoadingSpinner from '../components/LoadingSpinner';
import MapView from '../components/MapView';
import exportService from '../services/exportService';
import './Browse.css';

const Browse = () => {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'offers', 'needs'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [offers, setOffers] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [filteredNeeds, setFilteredNeeds] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    resourceTypes: [],
    location: '',
    urgency: '',
    sortBy: 'newest' // 'newest', 'oldest', 'urgent', 'nearby'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  // Apply filters when data or filters change
  useEffect(() => {
    applyFilters();
  }, [offers, needs, filters]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [offersData, needsData] = await Promise.all([
        postService.getOffers(),
        postService.getNeeds()
      ]);
      
      setOffers(offersData.offers || offersData || []);
      setNeeds(needsData.needs || needsData || []);
    } catch (err) {
      setError('Failed to load posts. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filteredOffersList = [...offers];
    let filteredNeedsList = [...needs];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredOffersList = filteredOffersList.filter(offer =>
        offer.title.toLowerCase().includes(searchTerm) ||
        offer.description.toLowerCase().includes(searchTerm) ||
        offer.location.toLowerCase().includes(searchTerm)
      );
      filteredNeedsList = filteredNeedsList.filter(need =>
        need.title.toLowerCase().includes(searchTerm) ||
        need.description.toLowerCase().includes(searchTerm) ||
        need.location.toLowerCase().includes(searchTerm)
      );
    }

    // Resource type filter
    if (filters.resourceTypes.length > 0) {
      filteredOffersList = filteredOffersList.filter(offer =>
        filters.resourceTypes.includes(offer.resourceType)
      );
      filteredNeedsList = filteredNeedsList.filter(need =>
        filters.resourceTypes.includes(need.resourceType)
      );
    }

    // Location filter
    if (filters.location) {
      const locationTerm = filters.location.toLowerCase();
      filteredOffersList = filteredOffersList.filter(offer =>
        offer.location.toLowerCase().includes(locationTerm)
      );
      filteredNeedsList = filteredNeedsList.filter(need =>
        need.location.toLowerCase().includes(locationTerm)
      );
    }

    // Urgency filter (for needs only)
    if (filters.urgency) {
      filteredNeedsList = filteredNeedsList.filter(need =>
        need.urgency === filters.urgency
      );
    }

    // Sorting
    const sortItems = (items, type) => {
      switch (filters.sortBy) {
        case 'oldest':
          return items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        case 'urgent':
          if (type === 'needs') {
            const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
            return items.sort((a, b) => 
              (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2)
            );
          }
          return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'newest':
        default:
          return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }
    };

    setFilteredOffers(sortItems(filteredOffersList, 'offers'));
    setFilteredNeeds(sortItems(filteredNeedsList, 'needs'));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleConnect = async (post) => {
    try {
      const postType = post.resourceType ? (post.urgency ? 'need' : 'offer') : 'offer';
      await postService.connectToPost(post._id || post.id, postType);
      
      // Show success message or redirect
      alert(`Connected to ${post.title} successfully! 🤝`);
      
      // Optionally refresh data or update UI
      fetchData();
    } catch (error) {
      alert(`Failed to connect: ${error.message}`);
    }
  };

  const handleViewDetails = (post) => {
    const postType = post.urgency ? 'need' : 'offer';
    navigate(`/posts/${postType}/${post._id || post.id}`);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      resourceTypes: [],
      location: '',
      urgency: '',
      sortBy: 'newest'
    });
  };

  // Export posts data
  const handleExportPosts = () => {
    exportService.exportPosts(offers, needs);
  };

  const getTabCounts = () => {
    return {
      all: filteredOffers.length + filteredNeeds.length,
      offers: filteredOffers.length,
      needs: filteredNeeds.length
    };
  };

  const renderPosts = () => {
    let postsToShow = [];

    if (activeTab === 'all') {
      const allPosts = [
        ...filteredOffers.map(offer => ({ ...offer, type: 'offer' })),
        ...filteredNeeds.map(need => ({ ...need, type: 'need' }))
      ];
      postsToShow = allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeTab === 'offers') {
      postsToShow = filteredOffers.map(offer => ({ ...offer, type: 'offer' }));
    } else if (activeTab === 'needs') {
      postsToShow = filteredNeeds.map(need => ({ ...need, type: 'need' }));
    }

    if (postsToShow.length === 0) {
      return (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>No posts found</h3>
          <p>Try adjusting your filters or check back later for new posts.</p>
          <button onClick={clearFilters} className="clear-filters-button">
            Clear Filters
          </button>
        </div>
      );
    }

    return (
      <div className="posts-grid">
        {postsToShow.map((post) => (
          post.type === 'offer' ? (
            <OfferCard
              key={`offer-${post._id || post.id}`}
              offer={post}
              onConnect={handleConnect}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <NeedCard
              key={`need-${post._id || post.id}`}
              need={post}
              onConnect={handleConnect}
              onViewDetails={handleViewDetails}
            />
          )
        ))}
      </div>
    );
  };

  const tabCounts = getTabCounts();

  if (loading) {
    return <LoadingSpinner size="large" message="Loading community posts..." />;
  }

  return (
    <div className="browse-container">
      <div className="browse-header">
        <div className="header-content">
          <h1>🌟 Community Hub</h1>
          <p>Discover opportunities to help or find the support you need</p>
        </div>
        <div className="header-actions">
          <button
            onClick={handleExportPosts}
            className="export-button"
          >
            📤 Export Data
          </button>
          <button
            onClick={() => navigate('/create-post')}
            className="create-post-button"
          >
            <span className="button-icon">➕</span>
            Share Your Heart
          </button>
        </div>
      </div>

      <div className="browse-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search posts, locations, or keywords..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`filters-toggle ${showFilters ? 'active' : ''}`}
          >
            <span className="filter-icon">🎛️</span>
            Filters
            {(filters.resourceTypes.length > 0 || filters.location || filters.urgency) && (
              <span className="active-filters-count">
                {filters.resourceTypes.length + (filters.location ? 1 : 0) + (filters.urgency ? 1 : 0)}
              </span>
            )}
          </button>

          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="urgent">Most Urgent</option>
          </select>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filter-section">
            <ResourceTypeSelector
              allowMultiple={true}
              selectedTypes={filters.resourceTypes}
              onTypesSelect={(types) => handleFilterChange('resourceTypes', types)}
              showLabel={true}
              size="small"
            />
          </div>

          <div className="filter-section">
            <label htmlFor="location-filter">Location</label>
            <input
              id="location-filter"
              type="text"
              placeholder="Filter by location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="filter-input"
            />
          </div>

          <div className="filter-section">
            <label htmlFor="urgency-filter">Urgency (Needs only)</label>
            <select
              id="urgency-filter"
              value={filters.urgency}
              onChange={(e) => handleFilterChange('urgency', e.target.value)}
              className="filter-select"
            >
              <option value="">All urgency levels</option>
              <option value="critical">Critical</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="filter-actions">
            <button onClick={clearFilters} className="clear-button">
              Clear All
            </button>
          </div>
        </div>
      )}

      <div className="content-tabs">
        <div className="tabs-list">
          <button
            onClick={() => setActiveTab('all')}
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          >
            <span className="tab-icon">🌐</span>
            <span className="tab-text">All Posts</span>
            <span className="tab-count">({tabCounts.all})</span>
          </button>
          <button
            onClick={() => setActiveTab('offers')}
            className={`tab ${activeTab === 'offers' ? 'active' : ''}`}
          >
            <span className="tab-icon">💝</span>
            <span className="tab-text">Offers</span>
            <span className="tab-count">({tabCounts.offers})</span>
          </button>
          <button
            onClick={() => setActiveTab('needs')}
            className={`tab ${activeTab === 'needs' ? 'active' : ''}`}
          >
            <span className="tab-icon">🙏</span>
            <span className="tab-text">Needs</span>
            <span className="tab-count">({tabCounts.needs})</span>
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`tab ${activeTab === 'map' ? 'active' : ''}`}
          >
            <span className="tab-icon">🗺️</span>
            <span className="tab-text">Map View</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button onClick={fetchData} className="retry-button">
            Try Again
          </button>
        </div>
      )}

      <div className="browse-content">
        {activeTab === 'map' ? (
          <MapView 
            posts={[...filteredOffers, ...filteredNeeds]} 
            onPostSelect={handleViewDetails}
          />
        ) : (
          renderPosts()
        )}
      </div>
    </div>
  );
};

export default Browse;