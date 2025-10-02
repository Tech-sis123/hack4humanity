import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', gradient = false }) => {
  return (
    <div className={`loading-container ${size}`}>
      <div className={`spinner ${gradient ? 'gradient' : ''}`}></div>
      <p className="loading-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;