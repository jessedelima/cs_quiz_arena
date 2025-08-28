import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from '../AppIcon';

const ImageUploader = ({ currentImage, onImageUpload, className }) => {
  const [previewUrl, setPreviewUrl] = useState(currentImage || '');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione apenas arquivos de imagem.');
      return;
    }

    // Criar URL para preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      onImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    onImageUpload('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full mb-5 ${className || ''}`}>
      <div 
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-all
          ${isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary hover:bg-card'} 
          ${previewUrl ? 'border-solid p-3' : ''}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {previewUrl ? (
          <div className="relative w-full h-full">
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[200px] rounded object-cover mx-auto" />
            <button 
              type="button" 
              className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-md hover:bg-primary/90 transition-transform hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveImage();
              }}
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-muted-foreground">
            <Icon name="upload" size={40} className="mb-3 text-primary" />
            <p>Arraste uma imagem ou clique para selecionar</p>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

ImageUploader.propTypes = {
  currentImage: PropTypes.string,
  onImageUpload: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default ImageUploader;