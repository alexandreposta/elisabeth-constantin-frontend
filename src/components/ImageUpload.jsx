import React, { useRef } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import '../styles/imageUpload.css';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  multiple = false, 
  maxImages = null,
  className = "",
  label = "Images",
  showInCanvas = false
}) => {
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (multiple) {
      const newImages = [...images, ...files];
      onImagesChange(maxImages ? newImages.slice(0, maxImages) : newImages);
    } else {
      onImagesChange(files[0] || null);
    }
  };

  const handleRemoveImage = (index) => {
    if (multiple) {
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
    } else {
      onImagesChange(null);
    }
  };

  const openFileSelector = () => {
    fileInputRef.current.click();
  };

  const getImageSrc = (image) => {
    if (typeof image === 'string') return image;
    if (image instanceof File) return URL.createObjectURL(image);
    return '';
  };

  return (
    <div className={`image-upload ${className} ${showInCanvas ? 'canvas-mode' : ''}`}>
      {label && <label className="image-upload-label">{label}</label>}
      
      <div className="image-upload-container">
        {multiple ? (
          <>
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img 
                  src={getImageSrc(image)} 
                  alt={`Preview ${index + 1}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                  title="Supprimer cette image"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            
            {(!maxImages || images.length < maxImages) && (
              <div className="add-image-btn" onClick={openFileSelector}>
                <FaPlus />
                <span>Ajouter</span>
              </div>
            )}
          </>
        ) : (
          <div className={`single-image-upload ${showInCanvas ? 'canvas-container' : ''}`}>
            {images ? (
              <div className="image-preview">
                <img 
                  src={getImageSrc(images)} 
                  alt="Preview"
                  className={`preview-image ${showInCanvas ? 'canvas-image' : ''}`}
                />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(0)}
                  title="Supprimer cette image"
                >
                  <FaTimes />
                </button>
              </div>
            ) : (
              <div className={`add-image-btn ${showInCanvas ? 'canvas-add-btn' : ''}`} onClick={openFileSelector}>
                <FaPlus />
                <span>{showInCanvas ? 'Ajouter l\'image du tableau' : 'Ajouter'}</span>
              </div>
            )}
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
};

export default ImageUpload;
