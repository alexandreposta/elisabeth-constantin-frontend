import React from 'react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import '../styles/sortButton.css';

const SortButton = ({ 
  field, 
  currentSort, 
  onSort, 
  label, 
  className = '',
  size = 'medium' // small, medium, large
}) => {
  const getSortIcon = () => {
    if (currentSort?.field !== field) {
      return <FaSort className="sort-icon inactive" />;
    }
    
    return currentSort.direction === 'asc' ? (
      <FaSortUp className="sort-icon active ascending" />
    ) : (
      <FaSortDown className="sort-icon active descending" />
    );
  };

  const handleClick = () => {
    let newDirection = 'asc';
    
    if (currentSort?.field === field) {
      newDirection = currentSort.direction === 'asc' ? 'desc' : 'asc';
    }
    
    onSort({ field, direction: newDirection });
  };

  const isActive = currentSort?.field === field;

  return (
    <button 
      className={`sort-button ${size} ${isActive ? 'active' : ''} ${className}`}
      onClick={handleClick}
      type="button"
    >
      <span className="sort-label">{label}</span>
      {getSortIcon()}
    </button>
  );
};

export default SortButton;
