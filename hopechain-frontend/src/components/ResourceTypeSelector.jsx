import { useState } from 'react';
import { RESOURCE_TYPES, RESOURCE_TYPE_INFO } from '../services/postService';
import './ResourceTypeSelector.css';

const ResourceTypeSelector = ({ 
  selectedType, 
  onTypeSelect, 
  showLabel = true, 
  allowMultiple = false,
  selectedTypes = [],
  onTypesSelect = () => {},
  size = 'medium' 
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTypeClick = (type) => {
    if (allowMultiple) {
      const newTypes = selectedTypes.includes(type)
        ? selectedTypes.filter(t => t !== type)
        : [...selectedTypes, type];
      onTypesSelect(newTypes);
    } else {
      onTypeSelect(type);
      setIsDropdownOpen(false);
    }
  };

  const getSelectedTypeInfo = () => {
    if (allowMultiple) {
      return selectedTypes.length > 0 
        ? `${selectedTypes.length} types selected`
        : 'Select resource types';
    }
    return selectedType 
      ? RESOURCE_TYPE_INFO[selectedType]?.label 
      : 'Select resource type';
  };

  const getSelectedIcon = () => {
    if (allowMultiple) {
      return selectedTypes.length > 0 ? '📋' : '🤝';
    }
    return selectedType 
      ? RESOURCE_TYPE_INFO[selectedType]?.icon 
      : '🤝';
  };

  return (
    <div className={`resource-selector ${size}`}>
      {showLabel && (
        <label className="resource-selector-label">
          Resource Type {allowMultiple ? '(Multiple)' : ''}
        </label>
      )}
      
      <div className="resource-dropdown">
        <button
          type="button"
          className={`resource-dropdown-trigger ${
            (selectedType || selectedTypes.length > 0) ? 'selected' : ''
          }`}
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <span className="selected-type">
            <span className="type-icon">{getSelectedIcon()}</span>
            <span className="type-label">{getSelectedTypeInfo()}</span>
          </span>
          <span className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}>
            ▼
          </span>
        </button>

        {isDropdownOpen && (
          <div className="resource-dropdown-menu">
            <div className="resource-types-grid">
              {Object.entries(RESOURCE_TYPE_INFO).map(([type, info]) => {
                const isSelected = allowMultiple 
                  ? selectedTypes.includes(type)
                  : selectedType === type;
                
                return (
                  <button
                    key={type}
                    type="button"
                    className={`resource-type-option ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleTypeClick(type)}
                    style={{
                      '--type-color': info.color
                    }}
                  >
                    <span className="option-icon">{info.icon}</span>
                    <div className="option-content">
                      <div className="option-label">{info.label}</div>
                      <div className="option-description">{info.description}</div>
                    </div>
                    {allowMultiple && isSelected && (
                      <span className="checkmark">✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </div>
  );
};

export default ResourceTypeSelector;