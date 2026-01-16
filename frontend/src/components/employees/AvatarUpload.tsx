import { employeeApi } from '@/api/employees';
import { PhotoCamera as PhotoCameraIcon } from '@mui/icons-material';
import { Avatar, Box, CircularProgress, IconButton } from '@mui/material';
import React, { useRef, useState } from 'react';

interface AvatarUploadProps {
  employeeId: number;
  currentAvatarUrl?: string;
  fullName: string;
  onUploadSuccess: (newUrl: string) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ employeeId, currentAvatarUrl, fullName, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await employeeApi.uploadAvatar(employeeId, file);
      if (response.success && response.avatar_url) {
        onUploadSuccess(response.avatar_url);
      }
    } catch (error) {
      console.error('Failed to upload avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ position: 'relative', display: 'inline-block' }}>
      <Avatar
        src={currentAvatarUrl}
        sx={{
          width: 120,
          height: 120,
          mx: 'auto',
          bgcolor: 'primary.main',
          fontSize: '3rem',
          mb: 1,
          border: '4px solid',
          borderColor: 'background.paper',
          boxShadow: 2,
        }}
      >
        {fullName.charAt(0)}
      </Avatar>
      
      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
      />
      
      <IconButton
        color="primary"
        onClick={handleButtonClick}
        disabled={uploading}
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 0,
          bgcolor: 'background.paper',
          boxShadow: 1,
          '&:hover': { bgcolor: 'grey.100' },
        }}
        size="small"
      >
        {uploading ? <CircularProgress size={20} /> : <PhotoCameraIcon fontSize="small" />}
      </IconButton>
    </Box>
  );
};

export default AvatarUpload;
