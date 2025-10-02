import React from 'react';
import './BlockchainBadge.css';

const BlockchainBadge = ({ status = 'verified', size = 'medium', prominent = false }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: '✅',
          label: 'Verified',
          color: 'var(--blockchain-verified)',
          bgColor: 'var(--success-bg)'
        };
      case 'pending':
        return {
          icon: '⏳',
          label: 'Pending',
          color: 'var(--blockchain-pending)',
          bgColor: 'var(--warning-bg)'
        };
      case 'failed':
        return {
          icon: '❌',
          label: 'Failed',
          color: 'var(--blockchain-failed)',
          bgColor: 'var(--error-bg)'
        };
      default:
        return {
          icon: '🔗',
          label: 'Blockchain',
          color: 'var(--blockchain-primary)',
          bgColor: 'var(--primary-bg)'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <span 
      className={`blockchain-badge ${size} ${status} ${prominent ? 'prominent' : ''}`}
      style={{
        '--badge-color': config.color,
        '--badge-bg': config.bgColor
      }}
    >
      <span className="badge-icon">{config.icon}</span>
      <span className="badge-label">{config.label}</span>
    </span>
  );
};

export default BlockchainBadge;