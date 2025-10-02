import './ErrorDisplay.css';

const ErrorDisplay = ({ 
  title = 'Something went wrong', 
  message = 'An unexpected error occurred. Please try again.', 
  onRetry,
  showRetry = true
}) => {
  return (
    <div className="error-display">
      <div className="error-icon">⚠️</div>
      <h3 className="error-title">{title}</h3>
      <p className="error-message">{message}</p>
      {showRetry && onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;