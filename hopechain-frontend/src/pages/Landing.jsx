import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Connect Hearts, <span className="highlight">Transform Lives</span>
            </h1>
            <p className="hero-subtitle">
              HopeChain bridges the gap between those who need help and those ready to give it. 
              From financial support to volunteering services, blood donations to skill sharing - 
              find your community of care.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="cta-button primary">
                Start Helping Today
              </Link>
              <Link to="/login" className="cta-button secondary">
                Sign In
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="connection-graphic">
              <div className="node donor-node">
                <div className="node-icon">💝</div>
                <span>Donors</span>
              </div>
              <div className="connection-line"></div>
              <div className="node platform-node">
                <div className="platform-logo">HC</div>
                <span>HopeChain</span>
              </div>
              <div className="connection-line"></div>
              <div className="node recipient-node">
                <div className="node-icon">🤝</div>
                <span>Recipients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">How HopeChain Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Discover Needs</h3>
              <p>Browse verified requests for help in your local community. From emergency medical needs to educational support.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💫</div>
              <h3>Offer Support</h3>
              <p>Share your skills, resources, or time. Whether it's financial aid, professional services, or volunteer work.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>Connect Securely</h3>
              <p>Our blockchain-verified system ensures safe, transparent connections between helpers and those in need.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📍</div>
              <h3>Local Impact</h3>
              <p>Focus on your immediate community. Help neighbors in Lagos, Abuja, or wherever you call home.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Help Section */}
      <section className="help-types-section">
        <div className="container">
          <h2 className="section-title">Every Kind of Help Matters</h2>
          <div className="help-types-grid">
            <div className="help-type">
              <div className="help-icon">💰</div>
              <h4>Financial Support</h4>
              <p>Emergency funds, medical bills, education fees</p>
            </div>
            <div className="help-type">
              <div className="help-icon">🩸</div>
              <h4>Blood Donation</h4>
              <p>Life-saving blood donations for medical emergencies</p>
            </div>
            <div className="help-type">
              <div className="help-icon">🛠️</div>
              <h4>Professional Services</h4>
              <p>Legal aid, medical consultation, technical support</p>
            </div>
            <div className="help-type">
              <div className="help-icon">⏰</div>
              <h4>Volunteer Time</h4>
              <p>Tutoring, elderly care, community service</p>
            </div>
            <div className="help-type">
              <div className="help-icon">🎓</div>
              <h4>Skill Sharing</h4>
              <p>Teaching, mentoring, career guidance</p>
            </div>
            <div className="help-type">
              <div className="help-icon">🏠</div>
              <h4>Basic Needs</h4>
              <p>Food, shelter, clothing, transportation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1,247</div>
              <div className="stat-label">Lives Touched</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">₦2.4M</div>
              <div className="stat-label">Funds Raised</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15</div>
              <div className="stat-label">Cities Covered</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">Verified Connections</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Make a Difference?</h2>
            <p>Join thousands of Nigerians already making their communities stronger through HopeChain.</p>
            <div className="cta-buttons">
              <Link to="/register" className="cta-button primary large">
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
