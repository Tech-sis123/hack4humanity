import './Logo.css';

const Logo = ({ size = 'medium' }) => {
  return (
    <div className={`logo-container ${size}`}>
      <div className="logo-icon">
        <svg viewBox="0 0 100 100" className="logo-svg">
          {/* Two hands forming a heart shape */}
          <path 
            d="M30,40 Q50,10 70,40 Q80,50 70,60 L50,80 L30,60 Q20,50 30,40 Z" 
            className="heart-shape"
          />
          {/* Left hand */}
          <path 
            d="M25,45 Q15,50 20,60 Q25,65 30,60 Q35,55 30,45 Z" 
            className="hand-left"
          />
          {/* Right hand */}
          <path 
            d="M75,45 Q85,50 80,60 Q75,65 70,60 Q65,55 70,45 Z" 
            className="hand-right"
          />
        </svg>
      </div>
      <span className="logo-text">HopeChain</span>
    </div>
  );
};

export default Logo;