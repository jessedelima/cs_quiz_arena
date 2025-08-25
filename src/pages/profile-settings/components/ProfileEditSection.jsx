import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ProfileEditSection = ({ currentUser, onProfileUpdate }) => {
  const [profileData, setProfileData] = useState({
    username: currentUser?.username || '',
    email: currentUser?.email || '',
    name: currentUser?.name || '',
    bio: currentUser?.bio || '',
    country: currentUser?.country || '',
    socialLinks: currentUser?.socialLinks || {
      twitter: '',
      twitch: '',
      youtube: '',
      discord: ''
    }
  });

  const [profileImage, setProfileImage] = useState(currentUser?.avatar || null);
  const [previewImage, setPreviewImage] = useState(currentUser?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (social links)
      const [parent, child] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors(prev => ({
        ...prev,
        image: 'Formato inválido. Use JPEG, PNG ou GIF.'
      }));
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({
        ...prev,
        image: 'A imagem deve ter no máximo 2MB.'
      }));
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewImage(e.target.result);
    };
    reader.readAsDataURL(file);
    
    // In a real app, you would upload the file to a server here
    setProfileImage(file);
    setErrors(prev => ({ ...prev, image: null }));
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    setPreviewImage(null);
    fileInputRef.current.value = '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!profileData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório';
    } else if (profileData.username.length < 3) {
      newErrors.username = 'Nome de usuário deve ter pelo menos 3 caracteres';
    }
    
    if (!profileData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^\S+@\S+\.\S+$/.test(profileData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (profileData.bio && profileData.bio.length > 200) {
      newErrors.bio = 'Bio deve ter no máximo 200 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Simulate upload process
    setIsUploading(true);
    
    // In a real app, you would upload the data to a server here
    setTimeout(() => {
      const updatedProfile = {
        ...profileData,
        avatar: previewImage
      };
      
      onProfileUpdate(updatedProfile);
      setIsUploading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center space-x-2">
          <Icon name="User" size={20} color="var(--color-primary)" />
          <span>Editar Perfil</span>
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Image */}
          <div className="flex flex-col items-center space-y-4">
            <div 
              className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-primary cursor-pointer"
              onClick={handleImageClick}
            >
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Foto de perfil" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <Icon name="User" size={48} color="var(--color-muted-foreground)" />
                </div>
              )}
              
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Icon name="Camera" size={24} color="white" />
              </div>
            </div>
            
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
              accept="image/jpeg,image/png,image/gif"
            />
            
            {errors.image && (
              <p className="text-sm text-destructive">{errors.image}</p>
            )}
            
            <div className="flex space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={handleImageClick}
              >
                <Icon name="Upload" size={16} className="mr-2" />
                Alterar foto
              </Button>
              
              {previewImage && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  <Icon name="Trash2" size={16} className="mr-2" />
                  Remover
                </Button>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-foreground">
                Nome de usuário*
              </label>
              <Input
                id="username"
                name="username"
                value={profileData.username}
                onChange={handleInputChange}
                placeholder="Seu nome de usuário"
                error={errors.username}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email*
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                placeholder="seu.email@exemplo.com"
                error={errors.email}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Nome completo
              </label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleInputChange}
                placeholder="Seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="country" className="text-sm font-medium text-foreground">
                País
              </label>
              <Input
                id="country"
                name="country"
                value={profileData.country}
                onChange={handleInputChange}
                placeholder="Seu país"
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label htmlFor="bio" className="text-sm font-medium text-foreground">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              placeholder="Conte um pouco sobre você..."
              className="w-full min-h-[100px] p-3 rounded-md border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              maxLength={200}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{profileData.bio?.length || 0}/200 caracteres</span>
              {errors.bio && (
                <span className="text-destructive">{errors.bio}</span>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-foreground">Links sociais</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Icon name="Twitter" size={20} color="var(--color-muted-foreground)" />
                <Input
                  name="socialLinks.twitter"
                  value={profileData.socialLinks.twitter}
                  onChange={handleInputChange}
                  placeholder="@seu_twitter"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Twitch" size={20} color="var(--color-muted-foreground)" />
                <Input
                  name="socialLinks.twitch"
                  value={profileData.socialLinks.twitch}
                  onChange={handleInputChange}
                  placeholder="seu_canal_twitch"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="Youtube" size={20} color="var(--color-muted-foreground)" />
                <Input
                  name="socialLinks.youtube"
                  value={profileData.socialLinks.youtube}
                  onChange={handleInputChange}
                  placeholder="URL do seu canal"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Icon name="MessageSquare" size={20} color="var(--color-muted-foreground)" />
                <Input
                  name="socialLinks.discord"
                  value={profileData.socialLinks.discord}
                  onChange={handleInputChange}
                  placeholder="Seu Discord (nome#0000)"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button 
              type="submit" 
              disabled={isUploading}
              className="min-w-[120px]"
            >
              {isUploading ? (
                <>
                  <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>Salvar alterações</>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditSection;