import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageUploader from '../ImageUploader/ImageUploader';
import { updateUserProfile } from '../../utils/authService';

const ProfileForm = ({ user, onProfileUpdate }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    avatar: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        name: user.name || '',
        avatar: user.avatar || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o campo é editado
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleImageUpload = (imageData) => {
    setFormData(prev => ({
      ...prev,
      avatar: imageData
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    
    try {
      const result = await updateUserProfile(formData);
      
      if (result.success) {
        setMessage({ text: result.message, type: 'success' });
        if (onProfileUpdate) {
          onProfileUpdate(result.user);
        }
      } else {
        setMessage({ text: result.error, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'Ocorreu um erro ao atualizar o perfil.', type: 'error' });
      console.error('Erro ao atualizar perfil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Editar Perfil</h2>
        <p className="text-muted-foreground">Atualize suas informações pessoais</p>
      </div>
      
      <div className="mb-6">
        <label className="block mb-2 font-medium text-foreground">Foto de Perfil</label>
        <ImageUploader 
          currentImage={formData.avatar} 
          onImageUpload={handleImageUpload} 
          className="max-w-[200px] mx-auto"
        />
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="space-y-2">
          <label className="block font-medium text-foreground">Nome de Usuário</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.username ? 'border-destructive' : 'border-input'}`}
            required
          />
          {errors.username && (
            <p className="text-destructive text-sm">{errors.username}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium text-foreground">Nome Completo</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${errors.name ? 'border-destructive' : 'border-input'}`}
            required
          />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="block font-medium text-foreground">Biografia</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            placeholder="Conte um pouco sobre você..."
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>
      
      {message.text && (
        <div className={`p-3 rounded-md mb-4 text-center ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}
      
      <div className="flex justify-center">
        <button 
          type="submit" 
          className="bg-primary text-white px-5 py-2 rounded-md hover:bg-primary/90 transition-colors disabled:bg-muted disabled:cursor-not-allowed" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  user: PropTypes.object,
  onProfileUpdate: PropTypes.func
};

export default ProfileForm;